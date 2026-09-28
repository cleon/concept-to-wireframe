#!/usr/bin/env node
/**
 * Remind the agent if environment files pick up remote API base URLs.
 */
const fs = require('node:fs');

let payload = {};
try {
  payload = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  payload = {};
}

const filePath = String(payload.file_path || '');
const isEnvFile = /environment(\.[A-Za-z0-9_-]+)?\.ts$/.test(filePath);
const edits = JSON.stringify(payload.edits || []);
const hasRemoteUrl =
  /https?:\/\//i.test(edits) && !/localhost|127\.0\.0\.1/i.test(edits);

if (isEnvFile && hasRemoteUrl) {
  process.stdout.write(
    JSON.stringify({
      additional_context:
        'environment.ts now looks like it contains a remote URL. This prototype is mock-only — remove live API base URLs and keep fixtures in src/assets/mock/.',
    }),
  );
}
