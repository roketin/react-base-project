import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import showAlert from '@/modules/app/components/base/show-alert';
import RBtn from '@/modules/app/components/base/r-btn';
import { RInput } from '@/modules/app/components/base/r-input';
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
   * Handle success alert callback
   */
  const handleSuccessAlertCallback = useCallback(
    ({ ok }: { ok: boolean }) => {
      if (ok) {
        navigate('AuthLogin');
      }
    },
    [navigate],
  );

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
                handleSuccessAlertCallback,
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
    [handleSuccessAlertCallback, mutate, t, tApp],
  );

  return (
    <div>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          {t('forgot.title')}
        </h1>
        <p className='text-muted-foreground'>{t('forgot.subTitle')}</p>
      </div>

      {/* Form */}
      <RForm
        form={form}
        onSubmit={handleSubmit}
        showErrorPopup
        layout='vertical'
      >
        <div className='space-y-4'>
          {/* Email */}
          <RFormField
            control={form.control}
            name='username'
            label={t('form.email')}
            withPlaceholder
          >
            <RInput autoComplete='username' className='h-11' />
          </RFormField>

          {/* Submit button */}
          <RBtn type='submit' className='w-full h-11 text-base font-medium'>
            {tApp('send')}
          </RBtn>

          {/* Back to login */}
          <Link
            to={linkTo('AuthLogin')}
            className='text-sm text-primary hover:underline flex items-center justify-center gap-1 mt-4'
          >
            <ChevronLeft size={16} /> {tApp('back')}
          </Link>
        </div>
      </RForm>
    </div>
  );
};
export default AuthForgot;
