import * as Yup from 'yup';
import i18n from '../i18n';

Yup.setLocale({
  mixed: {
    required: ({ label }) => i18n.t('validation:required', { label }),
  },
  string: {
    min: ({ min, label }) => i18n.t('validation:minLength', { min, label }),

    email: ({ label }) => i18n.t('validation:invalidEmail', { label }),
  },
});

export default Yup;
