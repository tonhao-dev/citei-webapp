// Publica os contratos da pasta ./pacts no Pact Broker.
// Uso: npm run pact:publish   (broker padrão: http://localhost:9292)
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const broker = (process.env.PACT_BROKER_BASE_URL ?? 'http://localhost:9292').replace(/\/$/, '');
const dir = path.resolve('pacts');

const git = command => execSync(`git ${command}`, { encoding: 'utf8' }).trim();

function version() {
  if (process.env.PACT_VERSION) return process.env.PACT_VERSION;
  const sha = git('rev-parse --short HEAD');
  const dirty = git('status --porcelain') !== '';
  return dirty ? `${sha}-dirty-${Date.now()}` : sha;
}

const files = readdirSync(dir).filter(name => name.endsWith('.json'));
if (files.length === 0) {
  console.error('Nenhum contrato em ./pacts. Rode "npm run test:pact" primeiro.');
  process.exit(1);
}

const consumerVersion = version();
const branch = git('rev-parse --abbrev-ref HEAD');

const contracts = files.map(file => {
  const content = readFileSync(path.join(dir, file), 'utf8');
  const pact = JSON.parse(content);
  return {
    consumerName: pact.consumer.name,
    providerName: pact.provider.name,
    specification: 'pact',
    contentType: 'application/json',
    content: Buffer.from(content).toString('base64'),
  };
});

const response = await fetch(`${broker}/contracts/publish`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pacticipantName: contracts[0].consumerName,
    pacticipantVersionNumber: consumerVersion,
    branch,
    contracts,
  }),
});

const body = await response.json();
if (!response.ok) {
  console.error('Falha ao publicar:', JSON.stringify(body, null, 2));
  process.exit(1);
}

console.log(`Publicado ${contracts.length} contrato(s) | versão ${consumerVersion} | branch ${branch}`);
for (const notice of body.notices ?? []) console.log(`- ${notice.text}`);
