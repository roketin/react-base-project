import * as Yup from 'yup';
import i18n from '../i18n';

const getLabel = (labelKey?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return labelKey ? i18n.t(labelKey as any) : '';
};

Yup.setLocale({
  mixed: {
    required: ({ label }) =>
      i18n.t('validation:required', { label: getLabel(label) }),
  },
  string: {
    min: ({ min, label }) =>
      i18n.t('validation:minLength', { min, label: getLabel(label) }),

    email: ({ label }) =>
      i18n.t('validation:invalidEmail', { label: getLabel(label) }),
  },
});

export default Yup;
