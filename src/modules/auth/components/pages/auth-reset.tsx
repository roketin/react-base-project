import { RCard } from '@/modules/app/components/base/r-card';
import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import FileInfo from '@/modules/app/components/base/file-info';
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

const formSchema = Yup.object().shape({
  password: Yup.string()
    .default('')
    .required()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[@$!%*?&]/,
      'Password must contain at least one special character (@, $, !, %, *, ?, &)',
    )
    .label('Password'),
  password_confirm: Yup.string()
    .default('')
    .required()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .label('Confirm Password'),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const AuthReset = () => {
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
          title: 'Confirm',
          description: 'Are you sure you want to change your password?',
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
                  title: 'Success',
                  description: 'Reset password successfully.',
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
    [mutate, navigate],
  );

  return (
    <div className='md:w-[400px]'>
      <RCard
        title='Reset Password'
        description='Make sure to remember the new password after saving it.'
      >
        <RForm
          form={form}
          onSubmit={handleSubmit}
          showErrorPopup
          layout='vertical'
        >
          <FileInfo src='src/modules/auth/components/pages/auth-reset.tsx' />

          {/* New Password */}
          <RFormField
            control={form.control}
            name='password'
            label='New Password'
            withPlaceholder
          >
            <RInputPassword />
          </RFormField>

          {/* New Confirm Password */}
          <RFormField
            control={form.control}
            name='password_confirm'
            label='New Confirm Password'
            withPlaceholder
          >
            <RInputPassword />
          </RFormField>

          <Button type='submit' className='w-full mt-3'>
            Save
          </Button>
        </RForm>
      </RCard>
    </div>
  );
};
export default AuthReset;
