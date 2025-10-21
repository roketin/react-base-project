export function sanitizeFolderName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function capitalize(str) {
  return str
    .trim()
    .split(/[\s-_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export function camelCase(str) {
  const c = capitalize(str);
  return c.charAt(0).toLowerCase() + c.slice(1);
}

export function kebabCase(str) {
  return str
    .trim()
    .split(/[\s_]+/)
    .map((s) => s.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`))
    .join('-')
    .replace(/^-+/, '')
    .toLowerCase();
}

export function snakeCase(str) {
  return str
    .trim()
    .split(/[\s-]+/)
    .map((s) => s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`))
    .join('_')
    .replace(/^_+/, '')
    .toLowerCase();
}

export function pascalCase(str) {
  return str
    .trim()
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
