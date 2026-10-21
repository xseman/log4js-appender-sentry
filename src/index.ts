// NOTE: log4js appenders must be written in CommonJS

import * as Sentry from "@sentry/node";

import type {
	NodeOptions,
	SeverityLevel,
	User,
} from "@sentry/node";
import type {
	AppenderFunction,
	LayoutFunction,
	LayoutsParam,
	Levels,
	LoggingEvent,
} from "log4js";

export interface Config extends NodeOptions {
	/**
	 * The Data Source Name (DSN) for connecting to the Sentry server.
	 *
	 * @see https://<project_name>.sentry.io/settings/projects/node/keys/
	 * @see https://docs.sentry.io/product/sentry-basics/dsn-explainer/#the-parts-of-the-dsn
	 */
	dsn: string;
	/**
	 * Sentry user data for scope setting
	 */
	user?: User;
}

declare module "log4js" {
	interface Appenders {
		SentryAppender: {
			type: "log4js-appender-sentry";
		} & Config;
	}
}

export type SentryAppenderLevels = keyof Pick<
	Levels,
	| "WARN"
	| "ERROR"
	| "FATAL"
>;

/**
 * Map log4js string log levels to their corresponding Sentry levels.
 */
const levelMap = {
	WARN: "warning",
	ERROR: "error",
	FATAL: "fatal",
} satisfies Record<SentryAppenderLevels, SeverityLevel>;

/**
 * Same default as the Sentry SDK uses when it flushes on an uncaught exception.
 */
const DEFAULT_SHUTDOWN_TIMEOUT = 2_000;

export function sentry(
	config: Config,
	levels: Levels,
	layout: LayoutFunction,
): AppenderFunction {
	Sentry.init(config);

	function appender(loggingEvent: LoggingEvent) {
		/**
		 * Sentry is mainly used to report application errors.
		 */
		if (!loggingEvent.level.isGreaterThanOrEqualTo(levels.WARN)) {
			return;
		}

		const level = loggingEvent.level.levelStr as SentryAppenderLevels;

		Sentry.captureMessage(layout(loggingEvent), {
			level: levelMap[level],
			extra: { category: loggingEvent.categoryName },
			user: config.user,
		});
	}

	/**
	 * log4js.shutdown waits until every appender calls `done`. Without the
	 * timeout an unreachable Sentry would keep the process alive.
	 */
	appender.shutdown = (done: (error?: Error) => void) => {
		Sentry.close(config.shutdownTimeout ?? DEFAULT_SHUTDOWN_TIMEOUT)
			.then(() => done(), done);
	};

	return appender;
}

export function configure(
	config: Config,
	layouts: LayoutsParam,
	_findAppender: () => AppenderFunction,
	levels: Levels,
): AppenderFunction {
	return sentry(config, levels, layouts.basicLayout);
}
