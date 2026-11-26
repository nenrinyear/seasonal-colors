import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';

const require = createRequire(import.meta.url);
const root = new URL('../', import.meta.url);
let workspace;
let server;
let baseUrl;
let output = '';

before(async () => {
    workspace = await mkdtemp(join(tmpdir(), 'seasonal-colors-test-'));
    for (const entry of ['src', 'public', 'package.json', 'tsconfig.json', 'next.config.ts', 'postcss.config.mjs', 'wrangler.jsonc']) {
        await cp(new URL(entry, root), join(workspace, entry), { recursive: true });
    }
    await symlink(new URL('node_modules', root).pathname, join(workspace, 'node_modules'), 'junction');

    const fixtures = [
        { key: 'daily:2000-01-02', value: '#ABCDEF' },
        { key: 'daily:2000-01-03', value: '#abcdef', metadata: { hex: '#abcdef' } },
        { key: 'daily:2000-01-04', value: '#123456' },
    ];
    await writeFile(join(workspace, 'fixtures.json'), JSON.stringify(fixtures));

    const env = { ...process.env, XDG_CONFIG_HOME: join(workspace, 'config'), NEXT_TELEMETRY_DISABLED: '1' };
    execFileSync(process.execPath, [
        require.resolve('wrangler/bin/wrangler.js'),
        'kv', 'bulk', 'put', 'fixtures.json', '--binding', 'seasonal_colors', '--preview', '--local',
    ], { cwd: workspace, env, timeout: 30_000 });

    server = spawn(process.execPath, [
        require.resolve('next/dist/bin/next'), 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', '0',
    ], { cwd: workspace, env, stdio: ['ignore', 'pipe', 'pipe'] });

    const startup = AbortSignal.timeout(30_000);
    baseUrl = await new Promise((resolve, reject) => {
        startup.addEventListener('abort', () => reject(new Error('Next.js did not start in time')), { once: true });
        server.once('error', reject);
        server.once('exit', (code) => reject(new Error(`Next.js exited with code ${code}`)));
        server.stderr.on('data', (chunk) => { output += chunk; });
        server.stdout.on('data', (chunk) => {
            output += chunk;
            const address = output.match(/Local:\s+(http:\/\/127\.0\.0\.1:\d+)/)?.[1];
            if (address && output.includes('Ready in')) resolve(address);
        });
    });
});

after(async (context) => {
    if (output) context.diagnostic(output.trim());
    if (server && server.exitCode === null && server.signalCode === null) {
        const closed = once(server, 'close');
        server.kill();
        await closed;
    }
    if (workspace) await rm(workspace, { recursive: true, force: true });
});

test('shows all dates for a repeated HEX, with the latest date in share metadata', async () => {
    const response = await fetch(`${baseUrl}/?hex=%23ABCDEF`, { signal: AbortSignal.timeout(60_000) });
    assert.equal(response.status, 200);
    const html = await response.text();

    assert.match(html, /この色が出た日<\/h2>/);
    assert.match(html, /<li>2000年1月3日<\/li><li>2000年1月2日<\/li>/);
    assert.match(html, /property="og:title" content="2000年1月3日の色は#abcdef"/);
    assert.match(html, /name="twitter:title" content="2000年1月3日の色は#abcdef"/);
});

test('keeps the single date in the heading for a legacy record', async () => {
    const response = await fetch(`${baseUrl}/?hex=123456`, { signal: AbortSignal.timeout(60_000) });
    assert.equal(response.status, 200);
    const html = await response.text();

    assert.match(html, /2000年1月4日の色<\/h1>/);
    assert.doesNotMatch(html, /この色が出た日<\/h2>/);
});

test('returns 404 for a HEX that has no date', async () => {
    const response = await fetch(`${baseUrl}/?hex=FEDCBA`, { signal: AbortSignal.timeout(60_000) });
    assert.equal(response.status, 404);
    assert.match(await response.text(), /色が見つかりませんでした/);
});
