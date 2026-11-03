// For staff content-staging PRs, verify both paths and Git object modes.
import { execFileSync } from 'node:child_process';
const base = process.argv[2];
if (!/^[a-f0-9]{40}$/.test(base || '')) throw new Error('Provide the PR base commit SHA.');
const changes = execFileSync('git', ['diff','--raw','--no-renames','-z',base+'...HEAD']).toString().split('\0');
for (let i=0; i<changes.length-1; i+=2) {
  const [,mode,,,status] = changes[i].slice(1).split(' ');
  const path = changes[i+1];
  const record = /^(content\/projects\/[a-z0-9]+(?:-[a-z0-9]+)*\.json|content\/company\.json)$/.test(path);
  const upload = /^public\/projects\/uploads\/[A-Za-z0-9][A-Za-z0-9_-]*\.(png|jpe?g|webp)$/i.test(path);
  if (mode !== '100644' || !(record && ['A','M'].includes(status) || upload && status === 'A'))
    throw new Error('Staff reviews allow project/company edits and new images only: '+path);
}
console.log('Editor changes are within the approved paths.');
