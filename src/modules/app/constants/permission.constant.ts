export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  SAMPLE_FORM_VIEW: 'sample-form.view',
  SAMPLE_FORM_CREATE: 'sample-form.create',
  SAMPLE_FORM_UPDATE: 'sample-form.update',
} as const;

export type TPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
