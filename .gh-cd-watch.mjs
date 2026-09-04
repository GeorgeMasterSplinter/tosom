import { execSync } from 'child_process';
import fs from 'fs';

const REPO = 'GeorgeMasterSplinter/tosom';
const SHA = process.argv[2] || '8655a4f';
const LOG = '/tmp/cd-watch.log';

function getToken() {
  try {
    const cred = execSync("printf 'protocol=https\\nhost=github.com\\n\\n' | git credential fill 2>/dev/null", {
      encoding: 'utf8',
    });
    const line = cred.split('\n').find((l) => l.startsWith('password='));
    return line ? line.slice('password='.length).trim() : '';
  } catch {
    return '';
  }
}
const token = getToken();
if (!token) {
  fs.appendFileSync(LOG, 'INGEN TOKEN\n');
  process.exit(1);
}
async function api(path) {
  const res = await fetch('https://api.github.com/repos/' + REPO + path, {
    headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github+json' },
  });
  return res;
}

let runId = null;
let i = 0;
while (i < 80) {
  i++;
  let line;
  try {
    if (!runId) {
      const j = await (await api('/actions/runs?per_page=15')).json();
      const run = (j.workflow_runs || []).find((r) => r.name === 'ToSom CD' && r.head_sha.startsWith(SHA));
      if (run) runId = run.id;
    }
    if (!runId) {
      line = '[' + new Date().toISOString().slice(11, 19) + '] tick ' + i + ': CD-run for ' + SHA + ' finnes ikke ennå';
    } else {
      const rj = await (await api('/actions/runs/' + runId)).json();
      const jobs = await (await api('/actions/runs/' + runId + '/jobs?per_page=40')).json();
      const key = (jobs.jobs || [])
        .filter((x) => /ci-gate|DB Migrations|Deploy|health-check|deploy-gate|Docker/i.test(x.name))
        .map((x) => x.name.replace(/ Pre-Deploy | to /g, '') + ':' + (x.conclusion || x.status))
        .join(', ');
      line =
        '[' + new Date().toISOString().slice(11, 19) + '] tick ' + i + ': CD ' + runId + ' ' + rj.status + '/' + (rj.conclusion || '-') + ' | ' + key;
      if (rj.status === 'completed') {
        console.log(line);
        fs.appendFileSync(LOG, line + '\nCD COMPLETED: ' + (rj.conclusion || '-') + '\n');
        console.log('CD COMPLETED: ' + (rj.conclusion || '-'));
        break;
      }
    }
  } catch (e) {
    line = '[' + new Date().toISOString().slice(11, 19) + '] tick ' + i + ': ERROR ' + e.message;
  }
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
  await new Promise((r) => setTimeout(r, 60000));
}
fs.appendFileSync(LOG, 'CD WATCHER EXITED at tick ' + i + '\n');