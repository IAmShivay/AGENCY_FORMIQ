// One-time Google consent for discovery-call booking.
// Reads GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET from .env and writes GOOGLE_REFRESH_TOKEN back into it.
// Usage: npm run google:auth

import { createServer } from 'node:http';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

const ENV_FILE = '.env';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.freebusy',
];
const REDIRECT_HOST = '127.0.0.1';
const REDIRECT_PORT = 5555;
const REDIRECT_PATH = '/oauth2callback';
const GRANT_AUTHORIZATION_CODE = 'authorization_code';
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const REFRESH_TOKEN_KEY = 'GOOGLE_REFRESH_TOKEN';
const REFRESH_TOKEN_LINE = new RegExp(`^${REFRESH_TOKEN_KEY}=.*$`, 'm');
const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_ERROR = 500;

const envPath = resolve(process.cwd(), ENV_FILE);
dotenv.config({ path: envPath });

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env first, then run: npm run google:auth');
  process.exit(1);
}

const redirectUri = `http://${REDIRECT_HOST}:${REDIRECT_PORT}${REDIRECT_PATH}`;
const consentUrl = `${AUTH_URL}?${new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES.join(' '),
})}`;

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', redirectUri);
  if (url.pathname !== REDIRECT_PATH) {
    res.writeHead(HTTP_NOT_FOUND).end();
    return;
  }

  const code = url.searchParams.get('code');
  if (!code) {
    res.writeHead(HTTP_BAD_REQUEST).end('Authorisation was cancelled. Close this tab and run the script again.');
    server.close();
    return;
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': FORM_CONTENT_TYPE },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: GRANT_AUTHORIZATION_CODE,
      }),
    });
    const data = await response.json();

    if (!data.refresh_token) {
      res.writeHead(HTTP_ERROR).end('Google did not return a refresh token. Check the terminal.');
      console.error('Token exchange failed:', data.error_description ?? response.status);
      return;
    }

    const line = `${REFRESH_TOKEN_KEY}=${data.refresh_token}`;
    const current = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
    const next = REFRESH_TOKEN_LINE.test(current)
      ? current.replace(REFRESH_TOKEN_LINE, line)
      : `${current.trimEnd()}\n${line}\n`;
    writeFileSync(envPath, next);

    res.writeHead(HTTP_OK, { 'Content-Type': 'text/plain' }).end('Google Calendar connected. You can close this tab.');
    console.log(`\nGoogle Calendar connected. ${REFRESH_TOKEN_KEY} was saved to .env. Restart the Next.js server (and add it to your host's env vars) to start taking bookings.\n`);
  } catch (error) {
    res.writeHead(HTTP_ERROR).end('Token exchange failed. Check the terminal.');
    console.error('Token exchange failed:', error instanceof Error ? error.message : error);
  } finally {
    server.close();
  }
});

server.listen(REDIRECT_PORT, REDIRECT_HOST, () => {
  console.log('Open this link, sign in with the Google account whose calendar takes bookings, and allow access:\n');
  console.log(`${consentUrl}\n`);
});
