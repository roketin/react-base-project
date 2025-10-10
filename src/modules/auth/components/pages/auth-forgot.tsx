import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import showAlert from '@/modules/app/components/base/show-alert';
import Button from '@/modules/app/components/ui/button';
import { Input } from '@/modules/app/components/ui/input';
import { linkTo, useNamedRoute } from '@/modules/app/hooks/use-named-route';
import Yup from '@/plugins/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft, CircleCheck } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuthForgot } from '@/modules/auth/services/auth.service';
import { tl } from '@/modules/app/libs/locale-utils';
import { useTranslation } from 'react-i18next';

const formSchema = Yup.object().shape({
  username: Yup.string()
    .default('')
    .email()
    .required()
    .label(tl('auth:form.email')),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const AuthForgot = () => {
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
  const { mutate } = useAuthForgot();

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
          description: t('forgot.confirmDesc'),
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
                  description: t('forgot.successDesc'),
                  icon: <CircleCheck className='text-green-600' size={50} />,
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
      <h1 className='text-2xl font-semibold mb-1'>{t('forgot.title')}</h1>
      <p className='mb-3 text-sm text-gray-400'>{t('forgot.subTitle')}</p>
      <RForm
        form={form}
        onSubmit={handleSubmit}
        showErrorPopup
        layout='vertical'
      >
        {/* Email */}
        <RFormField
          control={form.control}
          name='username'
          label={t('form.email')}
          withPlaceholder
        >
          <Input autoComplete='username' />
        </RFormField>

        <Button type='submit' className='w-full mt-3'>
          {tApp('send')}
        </Button>

        <Link
          to={linkTo('AuthLogin')}
          className='text-sm text-primary hover:underline flex items-center'
        >
          <ChevronLeft /> {tApp('back')}
        </Link>
      </RForm>
    </div>
  );
};
export default AuthForgot;
