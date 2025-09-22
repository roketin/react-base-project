import Yup from '@/plugins/yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { Input } from '@/modules/app/components/ui/input';
import Button from '@/modules/app/components/ui/button';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import { RInputPassword } from '@/modules/app/components/base/r-input-password';
import showAlert from '@/modules/app/components/base/show-alert';
import RForm from '@/modules/app/components/base/r-form';
import { Link } from 'react-router-dom';
import { linkTo } from '@/modules/app/hooks/use-named-route';
import FileInfo from '@/modules/app/components/base/file-info';
import { AtSign, FileLock2 } from 'lucide-react';

const formSchema = Yup.object().shape({
  username: Yup.string().default('').email().required().label('Email'),
  password: Yup.string().default('').required().label('Password'),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const AuthLogin = () => {
  // Form instance
  const form = useForm<TFormSchema>({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: formSchema.getDefault(),
  });

  /**
   * Submit form
   * @param values
   */
  const handleSubmit = useCallback(async (values: TFormSchema) => {
    console.log('Form Values', values);

    // Show confirm
    showAlert(
      {
        type: 'confirm',
        title: 'Confirm',
        description: 'Are you sure you want to try logging in?',
        manualClose: true,
      },
      async ({ ok, setLoading, close }) => {
        if (!ok) {
          close();
          return;
        }

        setLoading(true);

        await setTimeout(() => {
          setLoading(false);
          close();

          // Show confirmed
          showAlert({
            type: 'alert',
            title: 'Success',
            description: 'Login successful',
          });
        }, 1000);
      },
    );
  }, []);

  return (
    <div className='md:w-[400px]'>
      <RForm
        form={form}
        onSubmit={handleSubmit}
        showErrorPopup
        layout='vertical'
      >
        <div>
          <h1 className='font-bold text-2xl mb-0'>App Skeleton</h1>
          <small>Sample page</small>
        </div>

        <FileInfo src='src/modules/auth/components/pages/auth-login.tsx' />

        {/* Username */}
        <RFormField
          control={form.control}
          name='username'
          label='Email'
          withPlaceholder
          description='Enter the email that is registered in the system.'
        >
          <Input autoComplete='username' prepend={<AtSign size={16} />} />
        </RFormField>

        {/* Type 1: Simple input */}
        <RFormField
          control={form.control}
          name='password'
          label='Password'
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
          Forgot Password?
        </Link>

        <Button type='submit' className='w-full mt-3'>
          Login
        </Button>
      </RForm>
    </div>
  );
};

export default AuthLogin;
