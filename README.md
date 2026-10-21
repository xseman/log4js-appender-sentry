# log4js appender - Sentry

Sends logging events to Sentry. This appender integrates
[@sentry/node][sentry_javascript].

[sentry_javascript]: https://github.com/getsentry/sentry-javascript

![visual](docs/visual.svg)

## Installation

```sh
npm install log4js-appender-sentry
# or
bun add log4js-appender-sentry
```

Requires Node.js `>=20.19` or `>=22.12` (as [@sentry/node][sentry_javascript] v11).

## Configuration

### TypeScript

If you're using TypeScript, importing this library as a side effect will
automatically merge the log4js interface `Appenders`. This merging enables
autocomplete for the appenders configuration, providing convenient access to its
properties.

```ts
import "log4js-appender-sentry";
```

### Example

```ts
import log4js from "log4js";

import "log4js-appender-sentry";

log4js.configure({
	appenders: {
		sentry: {
			type: "log4js-appender-sentry",
			dsn: "<config>",
			user: {
				// ...
			},
		},
	},
	categories: {
		default: {
			level: "debug",
			appenders: [
				"sentry",
			],
		},
	},
});

const log = log4js.getLogger();
// ...
```

### Shutdown

Call `log4js.shutdown` before the process exits, it flushes queued events to
Sentry. The callback runs once Sentry is closed, at the latest after
[`shutdownTimeout`](#shutdowntimeout).

```ts
process.on("SIGTERM", () => {
	log4js.shutdown(() => process.exit(0));
});
```

## Options

Sentry is mainly used to report application errors so the default log level is
`WARN` and above, other log levels will be ignored.

Any other [Sentry option][sentry_options] (`environment`, `release`,
`sampleRate`, ...) is passed to `Sentry.init`.

[sentry_options]: https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/

### type

_Required_\
Type: log4js-appender-sentry

The type of the appender. Must be set to `log4js-appender-sentry`.

### dsn

_Required_\
Type: `string`

A DSN (Data Source Name) specifies where the Sentry SDK should send events,
ensuring they are associated with the correct project. Refer to the Sentry
[documentation][sentry_dsn] for more details on DSN.

[sentry_dsn]: https://docs.sentry.io/product/sentry-basics/dsn-explainer/

### user

_Optional_\
Type: `User`

```ts
// import type { User } from "@sentry/node";

interface User {
	[key: string]: unknown;
	id?: string | number;
	ip_address?: string | null;
	email?: string;
	username?: string;
	geo?: GeoLocation;
}
```

User data used for scope configuration. For additional information, see the
Sentry user [documentation][sentry_user].

[sentry_user]: https://docs.sentry.io/platforms/javascript/enriching-events/identify-user/

### shutdownTimeout

_Optional_\
Type: `number`\
Default: `2000`

Maximum time in milliseconds `log4js.shutdown` waits for queued events to be
sent to Sentry.
