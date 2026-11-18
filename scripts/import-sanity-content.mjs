import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import nextEnv from '@next/env';
import { keyed } from '../src/cms/sanity/seed-value-conversion.mjs';
import { toSanityDocumentId, fromSanityDocumentId } from '../src/cms/sanity/document-ids.mjs';

// Explicit opt-in: default execution is read-only. Never imports form submissions.
nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const apply = process.argv.includes('--apply');
const root = process.cwd();
const defaults = JSON.parse(await readFile(path.join(root, 'src/cms/sanity/defaults.json'), 'utf8'));
const getSingletonDefaults = id => keyed(defaults.seeds[id] ?? {});
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error('Configure NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN.');
if (Object.entries(defaults.seeds).some(([id, doc]) => !/^(global|page)\./.test(id) || doc._type === 'formSubmission')) {
  throw new Error('Import inventory must contain only fixed website content documents.');
}
if (!/^[a-z0-9-]+$/.test(projectId) || !/^[-\w]+$/.test(dataset)) throw new Error('Invalid public Sanity identifiers.');
const base = `https://${projectId}.api.sanity.io/v2024-01-01`;
const stats = { documents: 0, draftsPreserved: 0, assetsUploaded: 0, assetsReused: 0, imageReferences: 0 };
async function request(endpoint, options = {}) {
  for (let attempt = 0; attempt < 4; attempt++) {
    let response;
    try {
      response = await fetch(base + endpoint, { ...options, headers: { Authorization: `Bearer ${token}`, ...options.headers }, signal: AbortSignal.timeout(60000) });
    } catch {
      if (attempt < 3) continue;
      throw new Error('Sanity network request failed; no credential details logged.');
    }
    if (response.ok) return response.json();
    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      continue;
    }
    const failure = await response.json().catch(() => ({}));
    const detail = String(failure.error?.description || failure.error?.message || failure.message || '').split(token).join('[redacted]').slice(0, 1200);
    throw new Error(`Sanity HTTP ${response.status} at ${endpoint.split('?')[0]}: ${detail}`);
  }
}
async function query(groq, params = {}) {
  const search = new URLSearchParams({ query: groq, perspective: 'raw' });
  for (const [key, value] of Object.entries(params)) search.set('$' + key, JSON.stringify(value));
  return (await request(`/data/query/${dataset}?${search}`)).result;
}
const ids = Object.keys(defaults.seeds);
if (new Set(ids.map(toSanityDocumentId)).size !== ids.length) throw new Error('Document ID conversion collision.');
const existing = await query('*[_id in path("global.**") || _id in path("page.**") || _id in path("drafts.global.**") || _id in path("drafts.page.**") || _id match "global__*" || _id match "page__*" || _id match "drafts.global__*" || _id match "drafts.page__*"]');
const documents = new Map(existing.map(doc => [doc._id, doc]));
const assetDocuments = await query('*[_type == "sanity.imageAsset"]{_id,sha1hash}');
const assetsByHash = new Map(assetDocuments.map(asset => [asset.sha1hash, asset._id]));
const localFiles = new Map();
function scan(value) {
  if (!value || typeof value !== 'object') return;
  if ('alt' in value && ('src' in value || 'optimizedSrc' in value) && !value.asset?._ref) {
    const src = value.optimizedSrc || value.src;
    if (typeof src === 'string' && src.startsWith('/') && !src.startsWith('//')) localFiles.set(src, null);
  }
  for (const entry of Object.values(value)) scan(entry);
}
for (const id of ids) {
  scan(getSingletonDefaults(id));
  scan(documents.get(id));
  scan(documents.get('drafts.' + id));
  scan(documents.get(toSanityDocumentId(id)));
  scan(documents.get('drafts.' + toSanityDocumentId(id)));
}
const publicRoot = path.resolve(root, 'public');
for (const src of localFiles.keys()) {
  const filePath = path.resolve(publicRoot, '.' + src);
  if (!filePath.startsWith(publicRoot + path.sep)) throw new Error('Image path escapes public directory.');
  const bytes = await readFile(filePath);
  localFiles.set(src, { bytes, hash: createHash('sha1').update(bytes).digest('hex'), filename: path.basename(filePath) });
}
console.log(JSON.stringify({ mode: apply ? 'apply' : 'read-only', dataset, singletonDocuments: ids.length, existingDocuments: existing.length, uniqueLocalImages: localFiles.size, totalImageBytes: [...localFiles.values()].reduce((sum, file) => sum + file.bytes.length, 0) }));
if (!apply) process.exit(0);
const backupDirectory = path.join(root, '.sanity-import-backups');
await mkdir(backupDirectory, { recursive: true });
await writeFile(path.join(backupDirectory, new Date().toISOString().replace(/[:.]/g, '-') + '.json'), JSON.stringify({ projectId, dataset, documents: existing }, null, 2), { flag: 'wx' });

// Upload identical bytes once; asset hashes make subsequent runs reusable.
const entries = [...localFiles.entries()];
let next = 0;
const assetsBySource = new Map();
const pendingHashes = new Map();
async function upload(file) {
  if (assetsByHash.has(file.hash)) { stats.assetsReused++; return assetsByHash.get(file.hash); }
  if (pendingHashes.has(file.hash)) { stats.assetsReused++; return pendingHashes.get(file.hash); }
  const pending = (async () => {
    const result = await request(`/assets/images/${dataset}?filename=${encodeURIComponent(file.filename)}`, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file.bytes });
    assetsByHash.set(file.hash, result.document._id);
    stats.assetsUploaded++;
    if (stats.assetsUploaded % 25 === 0) console.log(`Images uploaded: ${stats.assetsUploaded}`);
    return result.document._id;
  })();
  pendingHashes.set(file.hash, pending);
  return pending;
}
await Promise.all(Array.from({ length: 3 }, async () => {
  while (next < entries.length) {
    const [src, file] = entries[next++];
    assetsBySource.set(src, await upload(file));
  }
}));
function withAssets(value) {
  if (Array.isArray(value)) return value.map(withAssets);
  if (!value || typeof value !== 'object') return value;
  const result = Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, withAssets(entry)]));
  if ('alt' in result && ('src' in result || 'optimizedSrc' in result)) {
    const ref = assetsBySource.get(result.optimizedSrc || result.src);
    if (!result.asset?._ref && ref) { result.asset = { _type: 'reference', _ref: ref }; stats.imageReferences++; }
    if (result.asset?._ref) {
      // Responsive derivatives are generated from the asset by the frontend.
      // Storing every local variant exceeds Sanity's document attribute limit.
      delete result.variants;
      delete result.blurDataURL;
    }
  }
  return result;
}
function fillMissing(seed, saved) {
  if (saved === undefined || saved === null) return seed;
  if (typeof saved === 'string') return saved.trim() ? saved : seed ?? saved;
  if (Array.isArray(saved)) {
    if (!saved.length) return Array.isArray(seed) ? seed : saved;
    return saved.map((item, index) => {
      const fallback = Array.isArray(seed) ? seed.find(entry => entry && item && typeof entry === 'object' && typeof item === 'object' && (entry._key && entry._key === item._key || entry.id && entry.id === item.id)) ?? seed[index] : undefined;
      return fillMissing(fallback, item);
    });
  }
  if (typeof saved === 'object') {
    const fallback = seed && typeof seed === 'object' && !Array.isArray(seed) ? seed : {};
    const result = { ...fallback };
    for (const [key, value] of Object.entries(saved)) result[key] = key === 'alt' && saved.decorative ? value : fillMissing(fallback[key], value);
    return result;
  }
  return saved;
}
function mutationFor(id, seed) {
  const saved = documents.get(id);
  const legacyId = (id.startsWith('drafts.') ? 'drafts.' : '') + fromSanityDocumentId(id);
  const merged = withAssets(fillMissing(seed, saved ?? documents.get(legacyId)));
  if (!saved) {
    const fields = Object.fromEntries(Object.entries(merged).filter(([key]) => !key.startsWith('_') || key === '_type'));
    return { createIfNotExists: { ...fields, _id: id } };
  }
  const fields = Object.fromEntries(Object.entries(merged).filter(([key]) => !key.startsWith('_')));
  return { patch: { id, ifRevisionID: saved._rev, set: fields } };
}
// Revision guards prevent overwriting edits made after the snapshot was read.
// Existing draft content stays a draft; publishing source defaults never publishes someone else's draft.
for (let offset = 0; offset < ids.length; offset += 15) {
  const mutations = [];
  for (const id of ids.slice(offset, offset + 15)) {
    const seed = getSingletonDefaults(id);
    const targetId = toSanityDocumentId(id);
    mutations.push(mutationFor(targetId, seed));
    if (documents.has('drafts.' + id) || documents.has('drafts.' + targetId)) { mutations.push(mutationFor('drafts.' + targetId, seed)); stats.draftsPreserved++; }
  }
  await request(`/data/mutate/${dataset}?visibility=sync`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mutations }) });
  stats.documents += ids.slice(offset, offset + 15).length;
  console.log(`Content documents published: ${stats.documents}/${ids.length}`);
}
const published = await query('count(*[_id in $ids])', { ids: ids.map(toSanityDocumentId) });
if (published !== ids.length) throw new Error('Published document count does not match defaults inventory.');
console.log('IMPORT_COMPLETE', JSON.stringify({ dataset, ...stats, publishedVerified: published }));
