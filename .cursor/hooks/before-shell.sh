#!/usr/bin/env node
/**
 * Warn before curl/wget/httpie to hosts that are not the usual toolchain.
 * Allow npm/ng/git/localhost. failClosed is not set — a hook error must not block the agent.
 */
const fs = require('node:fs');

let payload = {};
try {
  payload = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  payload = {};
}

const command = String(payload.command || '');
const looksLikeEgress =
  /\b(curl|wget|httpie)\b/i.test(command) ||
  /\bfetch\(\s*['"]https?:\/\//i.test(command);

const allowlisted =
  /localhost|127\.0\.0\.1|registry\.npmjs\.org|npmjs\.com|angular\.dev|github\.com|githubusercontent\.com|cursor\.com|cursor\.sh/i.test(
    command,
  );

if (looksLikeEgress && !allowlisted) {
  process.stdout.write(
    JSON.stringify({
      permission: 'ask',
      user_message:
        'This command looks like network egress. This prototype is mock-only — confirm it is not a live customer API.',
      agent_message:
        'Prefer fixtures in the current app src/assets/mock/. Do not add live API clients, secrets, or production URLs.',
    }),
  );
} else {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
}
