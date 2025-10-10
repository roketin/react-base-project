import Yup from '@/plugins/yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { Input } from '@/modules/app/components/ui/input';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import { RInputPassword } from '@/modules/app/components/base/r-input-password';
import RForm from '@/modules/app/components/base/r-form';
import { Link } from 'react-router-dom';
import { linkTo, useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { ArrowRightIcon, AtSign, FileLock2 } from 'lucide-react';
import { useAuthLogin } from '@/modules/auth/services/auth.service';
import { useTranslation } from 'react-i18next';
import { tl } from '@/modules/app/libs/locale-utils';
import RBtn from '@/modules/app/components/base/r-btn';

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
      <h1 className='text-2xl font-semibold mb-1'>{t('login.title')}</h1>
      <p className='mb-3 text-sm text-gray-400'>{t('login.subTitle')}</p>
      <RForm
        form={form}
        onSubmit={handleSubmit}
        showErrorPopup
        layout='vertical'
        disabled={loading}
      >
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

        <RBtn
          type='submit'
          className='w-full mt-3'
          loading={loading}
          iconEnd={<ArrowRightIcon />}
        >
          {t('form.submit')}
        </RBtn>

        <div className='text-center'>
          <Link
            to={linkTo('AuthForgot')}
            className='text-sm text-primary hover:underline inline-block'
          >
            {t('form.forgotPassword')}
          </Link>
        </div>
      </RForm>
    </div>
  );
};

export default AuthLogin;
