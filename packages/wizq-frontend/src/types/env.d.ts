/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_AUTH0_AUDIENCE: string;
    NEXT_PUBLIC_AUTH0_DOMAIN: string;
    NEXT_PUBLIC_AUTH0_ISSUER_URL: string;
    NEXT_PUBLIC_AUTH0_CLIENT_ID: string;
    [key: string]: never; // don't allow other keys to be used
  }
}
