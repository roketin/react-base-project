import type { Plugin } from 'vite';
import fs from 'fs';
import fg from 'fast-glob';

type LocaleJson = { [key: string]: string | LocaleJson };

function extractKeys(obj: LocaleJson, prefix = ''): string[] {
  return Object.keys(obj).flatMap((k) => {
    const value = obj[k];
    const newKey = prefix ? `${prefix}.${k}` : k;
    return typeof value === 'object' && value !== null
      ? extractKeys(value, newKey)
      : newKey;
  });
}

export default function i18nTypesPlugin(): Plugin {
  return {
    name: 'vite-plugin-i18n-types',
    apply: 'serve', // hanya jalan saat Vite dev
    async buildStart() {
      await generateTypes();
    },
    async handleHotUpdate(ctx) {
      if (ctx.file.includes('/locales/') && ctx.file.endsWith('.json')) {
        await generateTypes();
      }
    },
  };
}

async function generateTypes() {
  const files = await fg('src/modules/**/locales/*.json');

  const resources: Record<string, string[]> = {};

  for (const file of files) {
    const match = file.match(/modules\/.+\/locales\/(.+)\.(.+)\.json$/);
    if (!match) continue;

    const [, filenameRaw] = match;
    const namespace = filenameRaw.replace(/-([a-z])/g, (_, c) =>
      c.toUpperCase(),
    );

    const jsonContent = fs.readFileSync(file, 'utf-8');
    const json = JSON.parse(jsonContent) as LocaleJson;

    resources[namespace] = [
      ...(resources[namespace] || []),
      ...extractKeys(json),
    ];
  }

  const out = `
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'app';
    resources: {
${Object.keys(resources)
  .map(
    (ns) => `      ${ns}: {
${resources[ns].map((key) => `        "${key}": string;`).join('\n')}
      }`,
  )
  .join('\n')}
    };
  }
}
`;

  if (!fs.existsSync('./src/@types')) {
    fs.mkdirSync('./src/@types', { recursive: true });
  }

  fs.writeFileSync('./src/@types/i18next.d.ts', out);
  console.log('✅ i18n types regenerated!');
}
