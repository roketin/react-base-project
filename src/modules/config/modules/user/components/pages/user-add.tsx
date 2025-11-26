import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import { RFormFieldSet } from '@/modules/app/components/base/r-form-fieldset';
import { Input } from '@/modules/app/components/ui/input';
import { RPanelHeader } from '@/modules/app/components/base/r-panel-header';
import Yup from '@/plugins/yup';

const schema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  bio: Yup.string(),
});

type FormValues = Yup.InferType<typeof schema>;

export default function UserAdd() {
  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const onSubmit = (data: FormValues) => {
    // eslint-disable-next-line no-console
    console.log('Form submitted:', data);
  };

  return (
    <div>
      <RPanelHeader
        title='Add New User'
        okButton={{ label: 'Save' }}
        showClose
        showOk
        className='mb-0 pt-0'
      />

      <RForm<FormValues>
        form={form}
        onSubmit={onSubmit}
        layout='vertical'
        spacing='0px'
      >
        <RFormFieldSet
          title='Personal Information'
          subtitle='Basic details about the user.'
        >
          <div className='grid grid-cols-1 gap-3'>
            <RFormField
              control={form.control}
              name='fullName'
              label='Full Name'
              withPlaceholder
            >
              <Input />
            </RFormField>
            <RFormField
              control={form.control}
              name='email'
              label='Email Address'
              withPlaceholder
            >
              <Input type='email' />
            </RFormField>
          </div>
        </RFormFieldSet>

        <hr className='border-gray-100' />

        <RFormFieldSet
          title='Account Details'
          subtitle='Login credentials and profile settings.'
        >
          <div className='grid grid-cols-1 gap-3'>
            <RFormField
              control={form.control}
              name='username'
              label='Username'
              withPlaceholder
            >
              <Input />
            </RFormField>
            <RFormField
              control={form.control}
              name='password'
              label='Password'
              withPlaceholder
            >
              <Input type='password' />
            </RFormField>
            <RFormField
              control={form.control}
              name='bio'
              label='Bio'
              withPlaceholder
            >
              <Input />
            </RFormField>
          </div>
        </RFormFieldSet>
      </RForm>
    </div>
  );
}
