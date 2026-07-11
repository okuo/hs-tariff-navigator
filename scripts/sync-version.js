#!/usr/bin/env node

/**
 * package.json の version を public/manifest.json に同期するスクリプト。
 * npm version の lifecycle フック（"version" スクリプト）として自動実行される。
 * Node.js 組み込みモジュールのみ使用。
 */

const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const manifestPath = path.resolve(__dirname, '..', 'public', 'manifest.json');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (manifest.version === pkg.version) {
  console.log(`Version already in sync: ${pkg.version}`);
  process.exit(0);
}

const oldVersion = manifest.version;
manifest.version = pkg.version;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log(`Synced manifest.json version: ${oldVersion} → ${pkg.version}`);
