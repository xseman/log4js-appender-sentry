import {
	afterEach,
	describe,
	expect,
	test,
} from "bun:test";

import log4js from "log4js";
import { levels } from "log4js";
// @ts-ignore: missing type definitions
import layouts from "log4js/lib/layouts.js";
// @ts-ignore: missing type definitions
import LoggingEvent from "log4js/lib/LoggingEvent.js";

import {
	type Config,
	configure,
	sentry,
} from "./index.js";

function makeEvent(level: log4js.Level, data: unknown[] = ["test"]): log4js.LoggingEvent {
	return new LoggingEvent("default", level, data, {});
}

function shutdown(appender: log4js.AppenderFunction): Promise<void> {
	return new Promise((resolve, reject) => {
		// @ts-ignore: log4js does not type the shutdown property of an appender
		appender.shutdown((error?: Error) => error ? reject(error) : resolve());
	});
}

/**
 * Local stand-in for the Sentry ingest API, collects event payloads.
 */
function startSentry(handler?: () => Promise<Response>) {
	const events: any[] = [];
	const server = Bun.serve({
		port: 0,
		async fetch(req) {
			// envelope: header, item header, item payload
			const [, item, payload] = (await req.text()).split("\n");
			if (JSON.parse(item!).type === "event") {
				events.push(JSON.parse(payload!));
			}

			return handler ? handler() : new Response("{}");
		},
	});

	return {
		events: events,
		server: server,
		dsn: `http://public@127.0.0.1:${server.port}/1`,
	};
}

let stop: (() => void) | undefined;

afterEach(() => {
	stop?.();
	stop = undefined;
});

describe("sentry appender", () => {
	test("ignore events below WARN", async () => {
		const { events, server, dsn } = startSentry();
		stop = () => server.stop(true);

		const appender = sentry({ dsn: dsn }, levels, layouts.messagePassThroughLayout);
		appender(makeEvent(levels.INFO));
		appender(makeEvent(levels.DEBUG));
		await shutdown(appender);

		expect(events).toHaveLength(0);
	});

	test("report WARN, ERROR and FATAL with mapped level", async () => {
		const { events, server, dsn } = startSentry();
		stop = () => server.stop(true);

		const appender = sentry({ dsn: dsn }, levels, layouts.messagePassThroughLayout);
		appender(makeEvent(levels.WARN, ["warn"]));
		appender(makeEvent(levels.ERROR, ["error"]));
		appender(makeEvent(levels.FATAL, ["fatal"]));
		await shutdown(appender);

		// each event is a separate request, they can arrive in any order
		const reported = events.map((e) => [e.message, e.level]).sort();
		expect(reported).toEqual([
			["error", "error"],
			["fatal", "fatal"],
			["warn", "warning"],
		]);
	});

	test("attach category and user", async () => {
		const { events, server, dsn } = startSentry();
		stop = () => server.stop(true);

		const config: Config = { dsn: dsn, user: { id: "42" } };
		const appender = sentry(config, levels, layouts.messagePassThroughLayout);
		appender(makeEvent(levels.ERROR));
		await shutdown(appender);

		expect(events).toHaveLength(1);
		expect(events[0].extra).toEqual({ category: "default" });
		expect(events[0].user).toMatchObject({ id: "42" });
	});

	test("shutdown gives up after shutdownTimeout when Sentry does not respond", async () => {
		const { server, dsn } = startSentry(() => new Promise(() => {}));
		stop = () => server.stop(true);

		const appender = sentry(
			{ dsn: dsn, shutdownTimeout: 100 },
			levels,
			layouts.messagePassThroughLayout,
		);
		appender(makeEvent(levels.ERROR));

		const start = performance.now();
		await shutdown(appender);

		expect(performance.now() - start).toBeLessThan(1_000);
	});
});

describe("configure", () => {
	test("log4js.shutdown calls back after the appender is closed", async () => {
		const { events, server, dsn } = startSentry();
		stop = () => server.stop(true);

		log4js.configure({
			appenders: {
				sentry: { type: { configure: configure }, dsn: dsn },
			},
			categories: {
				default: { level: "debug", appenders: ["sentry"] },
			},
		});
		log4js.getLogger("app").error("boom");

		const error = await new Promise((resolve) => log4js.shutdown(resolve));

		expect(error).toBeUndefined();
		expect(events).toHaveLength(1);
		expect(events[0].message).toContain("boom");
		expect(events[0].extra).toEqual({ category: "app" });
	});
});
