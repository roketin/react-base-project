import { generatorConfig } from './generator-config.js';

const restrictedModulesSet = new Set(generatorConfig.restrictedModules);

export function getGeneratorConfig() {
  return generatorConfig;
}

export function getRestrictedModules() {
  return restrictedModulesSet;
}

export function getGeneratorPresets() {
  return generatorConfig.presets;
}

export function getGeneratorChoices() {
  return generatorConfig.prompts.generationChoices;
}

export function getGeneratorTypes() {
  return generatorConfig.generators;
}

export function registerRestrictedModule(moduleName) {
  if (!moduleName) return;
  restrictedModulesSet.add(moduleName);
  if (!generatorConfig.restrictedModules.includes(moduleName)) {
    generatorConfig.restrictedModules.push(moduleName);
  }
}

export function registerPreset(name, generatorKeys) {
  if (!name || !Array.isArray(generatorKeys)) {
    throw new Error(
      'registerPreset requires a name and an array of generator keys',
    );
  }

  generatorConfig.presets[name] = generatorKeys;
}

export function registerPromptChoice(choice) {
  if (!choice?.name || !choice?.value) {
    throw new Error(
      'registerPromptChoice requires an object with name and value',
    );
  }

  generatorConfig.prompts.generationChoices.push(choice);
}

export function registerGenerator(name, generator) {
  if (!name || typeof generator?.getContent !== 'function') {
    throw new Error(
      'registerGenerator requires a name and generator definition',
    );
  }

  generatorConfig.generators[name] = generator;
}
