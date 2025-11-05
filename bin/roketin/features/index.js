import moduleFeature from './module/index.js';
import infoFeature from './info/index.js';
import viewRoutesFeature from './view-router/index.js';
import releaseFeature from './release/index.js';

const featureDefinitions = [
  {
    name: 'module',
    description: 'Scaffold a feature module',
    handler: moduleFeature,
    aliases: ['module-child'],
  },
  {
    name: 'info',
    description: 'Show registered generators and presets',
    handler: infoFeature,
  },
  {
    name: 'view-router',
    description: 'Visualize the aggregated application routing tree',
    handler: viewRoutesFeature,
  },
  {
    name: 'release',
    description: 'Release Manager',
    handler: releaseFeature,
  },
];

const featureMap = new Map();

featureDefinitions.forEach((feature) => {
  featureMap.set(feature.name, feature);
  if (feature.aliases) {
    feature.aliases.forEach((alias) => {
      featureMap.set(alias, { ...feature, name: alias, isAlias: true });
    });
  }
});

export function getFeature(command) {
  return featureMap.get(command);
}

export function listFeatures() {
  return featureDefinitions.map(({ aliases = [], ...definition }) => ({
    ...definition,
    aliases,
  }));
}

export function registerFeature(feature) {
  if (!feature?.name || typeof feature.handler !== 'function') {
    throw new Error('Feature registration requires a name and handler');
  }
  featureDefinitions.push(feature);
  featureMap.set(feature.name, feature);
  if (feature.aliases) {
    feature.aliases.forEach((alias) => {
      featureMap.set(alias, { ...feature, name: alias, isAlias: true });
    });
  }
}
