export function buildFeatureFlagKey(moduleParts) {
  return moduleParts
    .map((part) => part.replace(/-/g, '_').toUpperCase())
    .join('_');
}

export function buildModuleId(moduleParts) {
  return moduleParts.join('-');
}
