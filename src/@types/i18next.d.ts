
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'app';
    resources: {
      auth: {
        "login.title": string;
        "login.subTitle": string;
        "form.email": string;
        "form.emailDesc": string;
        "form.password": string;
        "form.submit": string;
        "form.forgotPassword": string;
        "login.title": string;
        "login.subTitle": string;
        "form.email": string;
        "form.emailDesc": string;
        "form.password": string;
        "form.submit": string;
        "form.forgotPassword": string;
      }
      app: {
        "title": string;
        "subTitle": string;
        "title": string;
        "subTitle": string;
      }
      validation: {
        "required": string;
        "minLength": string;
        "invalidEmail": string;
        "required": string;
        "minLength": string;
        "invalidEmail": string;
      }
      sampleForm: {
        "title": string;
      }
      dashboard: {
        "title": string;
        "increment": string;
        "decrement": string;
      }
      testing: {
        "title": string;
        "subTitle": string;
      }
      makan: {
        "title": string;
        "subTitle": string;
      }
    };
  }
}
