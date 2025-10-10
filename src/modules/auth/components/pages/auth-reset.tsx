import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import showAlert from '@/modules/app/components/base/show-alert';
import Button from '@/modules/app/components/ui/button';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import Yup from '@/plugins/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Lock } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthReset } from '@/modules/auth/services/auth.service';
import { RInputPassword } from '@/modules/app/components/base/r-input-password';
import { useTranslation } from 'react-i18next';
import { tl } from '@/modules/app/libs/locale-utils';

const formSchema = Yup.object().shape({
  password: Yup.string()
    .default('')
    .required()
    .min(8)
    .matches(/[a-z]/, () => tl('validation:passwordLowerCase'))
    .matches(/[A-Z]/, () => tl('validation:passwordUpperCase'))
    .matches(/\d/, () => tl('validation:passwordOneNumber'))
    .matches(/[@$!%*?&]/, () => tl('validation:passwordSpecialChar'))
    .label(tl('auth:form.newPassword')),
  password_confirm: Yup.string()
    .default('')
    .required()
    .oneOf([Yup.ref('password')], () => tl('validation:passwordMatch'))
    .label(tl('auth:form.newPasswordConfirm')),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const AuthReset = () => {
  // Translation
  const { t } = useTranslation('auth');
  const { t: tApp } = useTranslation();

  // Form instance
  const form = useForm<TFormSchema>({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: formSchema.getDefault(),
  });

  const { navigate } = useNamedRoute();

  // Forgot password mutation
  const { mutate } = useAuthReset();

  /**
   * Submit form
   * @param values
   */
  const handleSubmit = useCallback(
    (values: TFormSchema) => {
      // Show confirm
      showAlert(
        {
          type: 'confirm',
          title: tApp('confirm'),
          description: t('reset.confirmDesc'),
          manualClose: true,
        },
        ({ ok, setLoading, close }) => {
          if (!ok) {
            close();
            return;
          }

          // Show loading
          setLoading(true);

          // Login mutation
          mutate(values, {
            onSuccess() {
              showAlert(
                {
                  type: 'alert',
                  title: tApp('success'),
                  description: t('reset.successDesc'),
                  icon: <Lock className='text-green-600' size={50} />,
                },
                ({ ok }) => {
                  if (ok) {
                    navigate('AuthLogin');
                  }
                },
              );
              close();
            },
            onSettled() {
              // Hide loading
              setLoading(false);
            },
          });
        },
      );
    },
    [mutate, navigate, t, tApp],
  );

  return (
    <div>
      <h1 className='text-2xl font-semibold'>{t('reset.title')}</h1>
      <p className='mb-3 text-sm text-gray-400'>{t('reset.subTitle')}</p>
      <RForm
        form={form}
        onSubmit={handleSubmit}
        showErrorPopup
        layout='vertical'
      >
        {/* New Password */}
        <RFormField
          control={form.control}
          name='password'
          label={t('form.newPassword')}
          withPlaceholder
        >
          <RInputPassword />
        </RFormField>

        {/* New Confirm Password */}
        <RFormField
          control={form.control}
          name='password_confirm'
          label={t('form.newPasswordConfirm')}
          withPlaceholder
        >
          <RInputPassword />
        </RFormField>

        <Button type='submit' className='w-full mt-3'>
          {tApp('save')}
        </Button>
      </RForm>
    </div>
  );
};
export default AuthReset;
