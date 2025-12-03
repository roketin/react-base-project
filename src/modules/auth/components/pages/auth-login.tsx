import Yup from '@/plugins/yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { RInput } from '@/modules/app/components/base/r-input';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import { RInputPassword } from '@/modules/app/components/base/r-input-password';
import RForm from '@/modules/app/components/base/r-form';
import { Link } from 'react-router-dom';
import { linkTo, useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { ArrowRightIcon, Key, User } from 'lucide-react';
import { useAuthLogin } from '@/modules/auth/services/auth.service';
import { useTranslation } from 'react-i18next';
import { tl } from '@/modules/app/libs/locale-utils';
import RBtn from '@/modules/app/components/base/r-btn';

const formSchema = Yup.object().shape({
  login: Yup.string().default('').required().label(tl('auth:form.email')),
  password: Yup.string().default('').required().label(tl('auth:form.password')),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const AuthLogin = () => {
  // Translation
  const { t } = useTranslation('auth');

  // Form instance
  const form = useForm<TFormSchema>({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: formSchema.getDefault(),
  });

  // Login mutation
  const { mutate, isPending: loading } = useAuthLogin();

  // Navigate
  const { navigate } = useNamedRoute();

  /**
   * Submit form
   * @param values
   */
  const handleSubmit = useCallback(
    (values: TFormSchema) => {
      mutate(values, {
        onSuccess() {
          navigate('DashboardIndex');
        },
      });
    },
    [mutate, navigate],
  );

  return (
    <div>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          {t('login.title')}
        </h1>
        <p className='text-muted-foreground'>{t('login.subTitle')}</p>
      </div>

      {/* Form */}
      <RForm
        form={form}
        onSubmit={handleSubmit}
        showErrorPopup
        layout='vertical'
        disabled={loading}
      >
        <div className='space-y-4'>
          {/* Email */}
          <RFormField
            control={form.control}
            name='login'
            label={t('form.email')}
            withPlaceholder
          >
            <RInput
              autoComplete='username'
              leftIcon={<User size={18} />}
              className='h-11'
            />
          </RFormField>

          {/* Password */}
          <RFormField
            control={form.control}
            name='password'
            label={t('form.password')}
            withPlaceholder
          >
            <RInputPassword leftIcon={<Key size={18} />} className='h-11' />
          </RFormField>

          {/* Forgot password link */}
          <div className='flex justify-end'>
            <Link
              to={linkTo('AuthForgot')}
              className='text-sm text-primary hover:underline'
            >
              {t('form.forgotPassword')}
            </Link>
          </div>

          {/* Submit button */}
          <RBtn
            type='submit'
            className='w-full h-11 text-base font-medium'
            loading={loading}
            iconEnd={<ArrowRightIcon size={18} />}
          >
            {t('form.submit')}
          </RBtn>
        </div>
      </RForm>
    </div>
  );
};

export default AuthLogin;
