import { RCard } from '@/modules/app/components/base/r-card';
import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import FileInfo from '@/modules/app/components/base/file-info';
import showAlert from '@/modules/app/components/base/show-alert';
import Button from '@/modules/app/components/ui/button';
import { Input } from '@/modules/app/components/ui/input';
import { linkTo } from '@/modules/app/hooks/use-named-route';
import Yup from '@/plugins/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const formSchema = Yup.object().shape({
  email: Yup.string().default('').email().required().label('Email'),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

const AuthForgot = () => {
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
            name='email'
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
