import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgPath = path.resolve(__dirname, '../../../package.json');

let cliVersion = '1.1.0';

try {
  const raw = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);
  if (pkg?.version) {
    cliVersion = pkg.version;
  }
} catch (error) {
  // Swallow errors; fallback version will be used.
}

export { cliVersion };
