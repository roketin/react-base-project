import { camelCase, pascalCase } from '../../../lib/utils.js';

export function moduleConfigTemplate({
  moduleId,
  featureFlagKey,
  moduleParts,
  isChild,
}) {
  const lastSegment = moduleParts[moduleParts.length - 1] ?? 'feature';
  const exportName = `${pascalCase(lastSegment)}ModuleConfig`;
  const translationNamespace = camelCase(lastSegment);
  const parentModuleId = isChild
    ? moduleParts.slice(0, -1).join('-')
    : undefined;
  const parentModuleLine = parentModuleId
    ? `  parentModuleId: '${parentModuleId}',\n`
    : '';
  const todoComment = isChild
    ? ''
    : '  // TODO: Update translations, icon, permissions, and route names to fit your module.\n';
  const menuBlock = isChild
    ? `  menu: {
    title: '${translationNamespace}:title',
    name: '${pascalCase(lastSegment)}Index',
    order: 10,
    // icon: SomeIcon,
    // permission: 'PERMISSION_KEY',
  },`
    : `  // Set menu to false if this module should stay hidden in the sidebar.
  menu: {
    title: '${translationNamespace}:title',
    name: '${pascalCase(lastSegment)}Index',
    order: 10,
    // icon: SomeIcon,
    // permission: 'PERMISSION_KEY',
  },`;

  return `import { defineModuleConfig } from '@/modules/app/types/module-config.type';

export const ${exportName} = defineModuleConfig({
  moduleId: '${moduleId}',
${parentModuleLine}  featureFlag: '${featureFlagKey}',
${todoComment}${menuBlock}
});

export default ${exportName};
`;
}
