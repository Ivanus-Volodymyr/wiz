import { WebAuth } from 'auth0-js';

export const webAuth = new WebAuth({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
});
