import Yup from '@/plugins/yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { Input } from '@/modules/app/components/ui/input';
import Button from '@/modules/app/components/ui/button';
import { BaseFormField } from '@/modules/app/components/base/base-form-field';
import { BaseInputPassword } from '@/modules/app/components/base/base-input-password';
import showAlert from '@/modules/app/components/base/show-alert';
import BaseForm from '@/modules/app/components/base/base-form';
import { Link } from 'react-router-dom';
import { linkTo } from '@/modules/app/hooks/use-named-route';
import FileInfo from '@/modules/app/components/base/file-info';

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
        title: 'Alert',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
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
            description: 'Success Set Data',
          });
        }, 1000);
      },
    );
  }, []);

  return (
    <div className='md:w-[400px]'>
      <BaseForm
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
        <BaseFormField
          control={form.control}
          name='username'
          label='Email'
          withPlaceholder
          description='Email ya bukan username 🔥'
        >
          <Input autoComplete='username' />
        </BaseFormField>

        {/* Type 1: Simple input */}
        <BaseFormField
          control={form.control}
          name='password'
          label='Password'
          withPlaceholder
        >
          <BaseInputPassword />
        </BaseFormField>

        {/* Type 2: Input with render */}
        {/* <BaseFormField
            control={form.control}
            name='password'
            label='Password'
            render={({ field }) => (
              <BaseInputPassword
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
      </BaseForm>
    </div>
  );
};

export default AuthLogin;
