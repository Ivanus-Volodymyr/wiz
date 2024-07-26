/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    AUTH0_AUDIENCE: string;
    AUTH0_ISSUER_URL: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;
    [key: string]: never; // don't allow other keys to be used
  }
}
