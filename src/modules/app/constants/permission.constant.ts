export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  SAMPLE_FORM_VIEW: 'sample-form.view',
  SAMPLE_FORM_CREATE: 'sample-form.create',
  SAMPLE_FORM_UPDATE: 'sample-form.update',
  ROLE_VIEW: 'role.view',
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  ROLE_EXPORT: 'role.export',
  USER_VIEW: 'user.view',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_EXPORT: 'user.export',
} as const;

export type TPermission = keyof typeof PERMISSIONS;
