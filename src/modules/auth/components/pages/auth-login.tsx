import Yup from '@/plugins/yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@/modules/app/components/ui/form';
import { useCallback } from 'react';
import { Input } from '@/modules/app/components/ui/input';
import Button from '@/modules/app/components/ui/button';
import { BaseFormField } from '@/modules/app/components/base/base-form-field';
import { BaseInputPassword } from '@/modules/app/components/base/base-input-password';
import showAlert from '@/modules/app/components/base/show-alert';
import { Badge } from '@/modules/app/components/ui/badge';
import { showAlertValidation } from '@/modules/app/components/base/show-alert-validation';

const formSchema = Yup.object().shape({
  username: Yup.string().default('').email().required().label('Email'),
  password: Yup.string().default('').required().label('Password'),
  // parent: Yup.object().shape({
  //   childA: Yup.object().shape({
  //     subChild: Yup.string().default('').label('Sub Child'),
  //   }),
  //   childB: Yup.string().default('').required().label('Child B'),
  // }),
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
  const onSubmit = useCallback(async (values: TFormSchema) => {
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, showAlertValidation)}
          className='space-y-3'
        >
          <div className='text-center'>
            <h1 className='text-2xl mb-3'>Auth Login</h1>
            <i className='block text-sm leading-relaxed'>
              File Location:
              <Badge variant='success' className='inline-block'>
                src/modules/auth/components/pages/auth-login.tsx
              </Badge>
            </i>
          </div>

          {/* Username */}
          <BaseFormField
            control={form.control}
            name='username'
            label='Email'
            withPlaceholder
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

          <Button type='submit' className='w-full mt-6'>
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuthLogin;
