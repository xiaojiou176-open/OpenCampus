import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fromRepoRoot = (relativePath) => path.join(repoRoot, relativePath);
const packetPath = 'docs/container-publication-prep.md';

export function validateContainerPublicationSurface() {
  const failures = [];

  for (const requiredPath of [packetPath, 'Dockerfile', 'DISTRIBUTION.md', 'docs/15-publication-submission-packet.md']) {
    if (!existsSync(fromRepoRoot(requiredPath))) {
      failures.push(`missing_container_publication_path:${requiredPath}`);
    }
  }

  if (failures.length > 0) {
    return failures;
  }

  const dockerfile = readFileSync(fromRepoRoot('Dockerfile'), 'utf8');
  const packet = readFileSync(fromRepoRoot(packetPath), 'utf8');
  const distribution = readFileSync(fromRepoRoot('DISTRIBUTION.md'), 'utf8');
  const packetLedger = readFileSync(fromRepoRoot('docs/15-publication-submission-packet.md'), 'utf8');
  const readme = readFileSync(fromRepoRoot('README.md'), 'utf8');
  const mcpReadme = readFileSync(fromRepoRoot('packages/mcp-server/README.md'), 'utf8');

  const requiredLabels = [
    'org.opencontainers.image.title=',
    'org.opencontainers.image.description=',
    'org.opencontainers.image.licenses=',
    'org.opencontainers.image.url=',
    'org.opencontainers.image.source=',
    'org.opencontainers.image.documentation=',
    'org.opencontainers.image.version=',
    'org.opencontainers.image.revision=',
  ];

  for (const label of requiredLabels) {
    if (!dockerfile.includes(label)) {
      failures.push(`container_publication_missing_label:${label}`);
    }
  }

  const packetSnippets = [
    'campus-copilot-api:local',
    'ghcr.io/xiaojiou176-open/campus-copilot-api',
    'thin local BFF',
    'not the stdio MCP transport',
    'pnpm check:container-publication-surface',
    'pnpm smoke:docker:api',
  ];

  for (const snippet of packetSnippets) {
    if (!packet.includes(snippet)) {
      failures.push(`container_publication_packet_missing_snippet:${snippet}`);
    }
  }

  if (!distribution.includes('docs/container-publication-prep.md')) {
    failures.push('container_publication_distribution_missing_packet_link');
  }
  if (!packetLedger.includes('container-publication-prep.md')) {
    failures.push('container_publication_submission_packet_missing_link');
  }
  if (!readme.includes('docs/container-publication-prep.md')) {
    failures.push('container_publication_readme_missing_packet_link');
  }
  if (!mcpReadme.includes('../../docs/container-publication-prep.md')) {
    failures.push('container_publication_mcp_readme_missing_packet_link');
  }

  return failures;
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const failures = validateContainerPublicationSurface();

  if (failures.length > 0) {
    console.error(failures.join('\n'));
    process.exit(1);
  }

  console.log('container_publication_surface_ok');
}
