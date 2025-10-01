import Yup from '@/plugins/yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { Input } from '@/modules/app/components/ui/input';
import Button from '@/modules/app/components/ui/button';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import { RInputPassword } from '@/modules/app/components/base/r-input-password';
import RForm from '@/modules/app/components/base/r-form';
import { Link } from 'react-router-dom';
import { linkTo, useNamedRoute } from '@/modules/app/hooks/use-named-route';
import FileInfo from '@/modules/app/components/base/file-info';
import { AtSign, FileLock2 } from 'lucide-react';
import { useAuthLogin } from '@/modules/auth/services/auth.service';
import useAuthStore from '@/modules/auth/stores/auth.store';
import { useTranslation } from 'react-i18next';
import { tl } from '@/modules/app/libs/locale-utils';

const formSchema = Yup.object().shape({
  username: Yup.string()
    .default('')
    .email()
    .required()
    .label(tl('auth:form.email')),
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

  // Set credential to store
  const setCredential = useAuthStore((state) => state.setCredential);

  // Navigate
  const { navigate } = useNamedRoute();

  /**
   * Submit form
   * @param values
   */
  const handleSubmit = useCallback(
    (values: TFormSchema) => {
      mutate(values, {
        onSuccess(response) {
          setCredential(response.data.access_token);
          navigate('DashboardIndex');
        },
      });
    },
    [mutate, navigate, setCredential],
  );

  return (
    <div className='md:w-[400px]'>
      <RForm
        form={form}
        onSubmit={handleSubmit}
        showErrorPopup
        layout='vertical'
      >
        <div>
          <h1 className='font-bold text-2xl mb-0'>{t('login.title')}</h1>
          <div>{t('login.subTitle')}</div>
        </div>

        <FileInfo src='src/modules/auth/components/pages/auth-login.tsx' />

        {/* Username */}
        <RFormField
          control={form.control}
          name='username'
          label={t('form.email')}
          withPlaceholder
          description={t('form.emailDesc')}
        >
          <Input autoComplete='username' prepend={<AtSign size={16} />} />
        </RFormField>

        {/* Type 1: Simple input */}
        <RFormField
          control={form.control}
          name='password'
          label={t('form.password')}
          withPlaceholder
        >
          <RInputPassword prepend={<FileLock2 size={16} />} />
        </RFormField>

        {/* Type 2: Input with render */}
        {/* <RFormField
            control={form.control}
            name='password'
            label='Password'
            render={({ field }) => (
              <RInputPassword
                value={field.value}
                onChange={field.onChange}
                placeholder='Enter your password'
              />
            )}
          /> */}

        <Link
          to={linkTo('AuthForgot')}
          className='text-sm text-blue-700 text-right hover:underline'
        >
          {t('form.forgotPassword')}
        </Link>

        <Button type='submit' className='w-full mt-3' loading={loading}>
          {t('form.submit')}
        </Button>
      </RForm>
    </div>
  );
};

export default AuthLogin;
