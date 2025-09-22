import { RCard } from '@/modules/app/components/base/r-card';
import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import FileInfo from '@/modules/app/components/base/file-info';
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

const formSchema = Yup.object().shape({
  username: Yup.string().default('').email().required().label('Email'),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const AuthForgot = () => {
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
    async (values: TFormSchema) => {
      // Show confirm
      showAlert(
        {
          type: 'confirm',
          title: 'Confirm',
          description: 'Are you sure you want to reset password?',
          manualClose: true,
        },
        async ({ ok, setLoading, close }) => {
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
                  description: 'The reset link has been sent to your email.',
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
    [mutate, navigate],
  );

  return (
    <div className='md:w-[400px]'>
      <RCard
        title='Forgot Password'
        description='Make sure you enter the email address that is registered in the system.'
      >
        <RForm
          form={form}
          onSubmit={handleSubmit}
          showErrorPopup
          layout='vertical'
        >
          <FileInfo src='src/modules/auth/components/pages/auth-forgot.tsx' />

          {/* Email */}
          <RFormField
            control={form.control}
            name='username'
            label='Email'
            withPlaceholder
          >
            <Input autoComplete='username' />
          </RFormField>

          <Link
            to={linkTo('AuthLogin')}
            className='text-sm text-blue-700 hover:underline flex items-center'
          >
            <ChevronLeft /> Back
          </Link>

          <Button type='submit' className='w-full mt-3'>
            Send
          </Button>
        </RForm>
      </RCard>
    </div>
  );
};
export default AuthForgot;
