import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/constants';
import config from '../next.config';
import vercelConfig from '../vercel.json';

function withBuildEnvironment(vercel: string | undefined, standalone: string | undefined, check: () => void) {
  const previous = { VERCEL: process.env.VERCEL, BUILD_STANDALONE: process.env.BUILD_STANDALONE };
  try {
    if (vercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = vercel;
    if (standalone === undefined) delete process.env.BUILD_STANDALONE;
    else process.env.BUILD_STANDALONE = standalone;
    check();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('Vercel build and runtime use the directory consumed by its Next.js adapter', () => {
  withBuildEnvironment('1', undefined, () => {
    for (const phase of [PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER]) {
      assert.equal(config(phase).distDir, '.next');
      assert.equal(config(phase).distDir, vercelConfig.outputDirectory);
    }
    assert.equal(vercelConfig.framework, 'nextjs');
  });
});

test('local development and production retain separate output directories', () => {
  withBuildEnvironment(undefined, undefined, () => {
    assert.equal(config(PHASE_DEVELOPMENT_SERVER).distDir, '.next');
    assert.equal(config(PHASE_PRODUCTION_BUILD).distDir, '.next-production');
    assert.equal(config(PHASE_PRODUCTION_SERVER).distDir, '.next-production');
  });
});

test('Docker standalone builds retain the directory copied by the Dockerfile', () => {
  withBuildEnvironment(undefined, '1', () => {
    assert.equal(config(PHASE_PRODUCTION_BUILD).distDir, '.next-production');
    assert.equal(config(PHASE_PRODUCTION_BUILD).output, 'standalone');
  });
});
