import RBtn from '@/modules/app/components/base/r-btn';
import RDialog from '@/modules/app/components/base/r-dialog';
import RForm from '@/modules/app/components/base/r-form';
import { RFormDatePicker } from '@/modules/app/components/base/r-picker';
import RSelect from '@/modules/app/components/base/r-select';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import showAlert from '@/modules/app/components/base/show-alert';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import Yup from '@/plugins/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RInput } from '@/modules/app/components/base/r-input';
import { RTextarea } from '@/modules/app/components/base/r-textarea';

const genderOptions = [
  { id: 'male', name: 'Male' },
  { id: 'female', name: 'Female' },
  { id: 'other', name: 'Other' },
];

const profileDialogSchema = Yup.object({
  full_name: Yup.string().default('').required().label('Full Name'),
  email: Yup.string().default('').email().required().label('Email'),
  phone: Yup.string().default('').label('Phone Number'),
  gender: Yup.string().required().label('Gender'),
  birth_date: Yup.date().nullable().default(null).label('Birth Date'),
  address: Yup.string().default('').label('Address'),
  bio: Yup.string().default('').max(500).label('Bio'),
});

export type TProfileDialogSchema = Yup.InferType<typeof profileDialogSchema>;

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
};

const ProfileDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: ProfileDialogProps) => {
  const { user } = useAuth();

  const form = useForm<TProfileDialogSchema>({
    mode: 'onTouched',
    resolver: yupResolver(profileDialogSchema),
    defaultValues: profileDialogSchema.getDefault(),
  });

  // Populate form with user data when dialog opens
  useEffect(() => {
    if (open && user) {
      form.reset({
        full_name: user.name || '',
        email: user.email || '',
        phone: '',
        gender: undefined,
        birth_date: null,
        address: '',
        bio: '',
      });
    }
  }, [open, user, form]);

  const handleSubmit = useCallback(
    (values: TProfileDialogSchema) => {
      console.log('Profile updated:', values);

      // Show success alert
      showAlert({
        variant: 'success',
        type: 'alert',
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully!',
        okVariant: 'success',
      });

      // Close dialog
      onOpenChange(false);

      // Call callback if provided
      onSubmit?.();
    },
    [onOpenChange, onSubmit],
  );

  const handleCancel = useCallback(() => {
    onOpenChange(false);
    form.reset();
  }, [form, onOpenChange]);

  return (
    <RDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Edit Profile'
      description='Update your personal information'
      size='md'
      footer={
        <>
          <RBtn variant='outline' onClick={handleCancel}>
            Cancel
          </RBtn>
          <RBtn onClick={form.handleSubmit(handleSubmit)}>Save Changes</RBtn>
        </>
      }
    >
      <RForm form={form} onSubmit={handleSubmit} layout='vertical'>
        <RFormField control={form.control} name='full_name' label='Full Name'>
          <RInput placeholder='Enter your full name' />
        </RFormField>

        <RFormField control={form.control} name='email' label='Email'>
          <RInput type='email' placeholder='Enter your email address' />
        </RFormField>

        <RFormField control={form.control} name='phone' label='Phone Number'>
          <RInput placeholder='Enter your phone number' />
        </RFormField>

        <RFormField control={form.control} name='gender' label='Gender'>
          <RSelect
            options={genderOptions}
            fieldNames={{ label: 'name', value: 'id' }}
            placeholder='Select your gender'
          />
        </RFormField>

        <RFormField control={form.control} name='birth_date' label='Birth Date'>
          <RFormDatePicker
            placeholder='Select your birth date'
            className='w-full'
          />
        </RFormField>

        <RFormField control={form.control} name='address' label='Address'>
          <RInput placeholder='Enter your address' />
        </RFormField>

        <RFormField control={form.control} name='bio' label='Bio'>
          <RTextarea
            placeholder='Tell us about yourself (max 500 characters)'
            rows={4}
            maxLength={500}
          />
        </RFormField>
      </RForm>
    </RDialog>
  );
};

export default ProfileDialog;
