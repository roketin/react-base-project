import Yup from '@/plugins/yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@/modules/app/components/ui/form';
import { useCallback, useState } from 'react';
import { Input } from '@/modules/app/components/ui/input';
import Button from '@/modules/app/components/ui/button';
import { BaseFormField } from '@/modules/app/components/base/base-form-field';
import { BaseInputPassword } from '@/modules/app/components/base/base-input-password';
import BaseAlertDialog from '@/modules/app/components/base/base-alert-dialog';

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

  const [open, setOpen] = useState<boolean>(false);

  /**
   * Submit form
   * @param values
   */
  const onSubmit = useCallback((values: TFormSchema) => {
    console.log('Form Values', values);
    setOpen(true);
  }, []);

  console.log(form.formState.errors);

  return (
    <div className='md:w-[400px]'>
      <BaseAlertDialog
        open={open}
        onOpenChange={setOpen}
        title='Are you absolutely sure?'
        description='        This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.'
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <div className='text-center'>
            <h1 className='text-2xl mb-3'>Auth Login</h1>
            <i className='block text-sm'>
              File Location: src/modules/auth/components/pages/auth-login.tsx
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
