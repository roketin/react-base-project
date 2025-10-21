import fs from 'fs';

export function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeFile(filePath, content, overwrite) {
  if (fs.existsSync(filePath) && !overwrite) {
    return false;
  }

  fs.writeFileSync(filePath, content);
  return true;
}

export function fileExists(filePath) {
  return fs.existsSync(filePath);
}
