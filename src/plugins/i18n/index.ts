import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import roketinConfig from '@config';

type Resource = Record<string, Record<string, string>>;

// Autoload semua json dalam folder modules/**/locales/*.json
const modulesLocales = import.meta.glob('@/modules/**/locales/*.json', {
  eager: true,
});

const resources: Resource = {};

for (const path in modulesLocales) {
  // path contoh: ../modules/auth/locales/en.json
  const match = path.match(
    /modules\/([^/]+)\/locales\/([^.]+)\.([^.]+)\.json$/,
  );
  if (match) {
    const [, , namespace, lng] = match;
    const camelNamespace = namespace.replace(/-([a-z])/g, (_, c) =>
      c.toUpperCase(),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = (modulesLocales[path] as any).default;
    resources[lng] = resources[lng] || {};
    resources[lng][camelNamespace] = json;
  }
}

const defaultLang =
  roketinConfig.languages.supported.find((l) => l.isDefault)?.code ?? 'id';

i18n
  .use(initReactI18next) // bind react-i18next
  .init({
    resources,
    fallbackLng: defaultLang,
    debug: roketinConfig.languages.debug,
    ns: ['app'], // default namespace
    defaultNS: 'app',
    interpolation: {
      escapeValue: false, // react sudah auto escape
    },
    lng:
      localStorage.getItem(roketinConfig.app.shortName + '-lang') ||
      defaultLang,
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(roketinConfig.app.shortName + '-lang', lng);
});

export default i18n;
