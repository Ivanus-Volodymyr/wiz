import * as Sentry from '@sentry/nextjs';
import * as dotenv from 'dotenv';

dotenv.config('.env');

/**
 * This is the server-side Sentry configuration for nestjs /api folder
 * It has no use at all but we need that config to make it work with @sentry/nextjs
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // Replay may only be enabled for the client-side
    integrations: [],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // ...

    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });
} else {
  console.warn('Sentry DSN not found, skipping Sentry initialization');
}
