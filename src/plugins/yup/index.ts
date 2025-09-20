import * as Yup from 'yup';

Yup.setLocale({
  mixed: {
    required: ({ label }) => `${label || 'This field'} is required`,
  },
});

export default Yup;
