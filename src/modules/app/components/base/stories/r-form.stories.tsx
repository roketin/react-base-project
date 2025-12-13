import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RForm, { type TRFormProps } from '../r-form';
import { RFormField } from '../r-form-field';
import { RInput } from '../r-input';
import RBtn from '../r-btn';
import Yup from '@/plugins/yup';

const schema = Yup.object({
  fullName: Yup.string()
    .min(3, 'Full name must be at least 3 characters.')
    .required('Full name is required.'),
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
});

type FormValues = Yup.InferType<typeof schema>;

type StoryProps = Pick<
  TRFormProps<FormValues>,
  | 'layout'
  | 'labelWidth'
  | 'spacing'
  | 'disabled'
  | 'showErrorPopup'
  | 'hideHorizontalLine'
>;

const FormStory = (props: StoryProps) => {
  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
    },
    mode: 'onBlur',
  });

  return (
    <div className='w-[420px] space-y-4 rounded-xl border bg-background p-6 shadow-sm'>
      <RForm<FormValues>
        {...props}
        form={form}
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted', values);
        }}
      >
        <RFormField
          control={form.control}
          name='fullName'
          label='Full Name'
          withPlaceholder
        >
          <RInput />
        </RFormField>
        <RFormField
          control={form.control}
          name='email'
          label='Email Address'
          withPlaceholder
        >
          <RInput type='email' />
        </RFormField>

        {!props.hideHorizontalLine && <hr className='col-span-full my-4' />}

        <div className='flex justify-end pt-2'>
          <RBtn type='submit' disabled={props.disabled}>
            Submit
          </RBtn>
        </div>
      </RForm>
    </div>
  );
};

const meta: Meta<typeof FormStory> = {
  title: 'Components/Layout/RForm',
  component: FormStory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'radio', options: ['horizontal', 'vertical'] },
    labelWidth: { control: 'text' },
    spacing: { control: 'text' },
    disabled: { control: 'boolean' },
    showErrorPopup: { control: 'boolean' },
    hideHorizontalLine: { control: 'boolean' },
  },
  args: {
    layout: 'horizontal',
    labelWidth: '140px',
    spacing: '1rem',
    disabled: false,
    showErrorPopup: false,
    hideHorizontalLine: false,
  },
};

export default meta;

type Story = StoryObj<typeof FormStory>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    layout: 'vertical',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithErrorPopup: Story = {
  args: {
    showErrorPopup: true,
  },
};

import { useState } from 'react';
import RDialog from '../r-dialog';
import RAlertDialog from '../r-alert-dialog';
import { RTextarea } from '../r-textarea';

/**
 * Form inside a dialog with smart stack confirmation flow.
 */
export const FormInDialog: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [discardOpen, setDiscardOpen] = useState(false);

    const FormContent = () => {
      const form = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: { fullName: '', email: '' },
        mode: 'onBlur',
      });

      const handleSubmit = form.handleSubmit(() => {
        setConfirmOpen(true);
      });

      return (
        <RForm form={form} onSubmit={() => {}} layout='vertical'>
          <RFormField
            control={form.control}
            name='fullName'
            label='Full Name'
            withPlaceholder
          >
            <RInput />
          </RFormField>
          <RFormField
            control={form.control}
            name='email'
            label='Email Address'
            withPlaceholder
          >
            <RInput type='email' />
          </RFormField>

          <div className='flex justify-end gap-2 pt-4'>
            <RBtn
              type='button'
              variant='outline'
              onClick={() => setDiscardOpen(true)}
            >
              Cancel
            </RBtn>
            <RBtn type='button' onClick={handleSubmit}>
              Save
            </RBtn>
          </div>
        </RForm>
      );
    };

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Form inside dialog with confirmation alerts using smart stack.
        </p>

        <RBtn onClick={() => setDialogOpen(true)}>Add New Contact</RBtn>

        <RDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title='Add Contact'
          description='Fill in the contact details below.'
          size='sm'
          preventCloseOnOverlay
          preventCloseOnEscape
          hideFooter
        >
          <FormContent />
        </RDialog>

        <RAlertDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title='Save Contact?'
          description='Are you sure you want to save this contact?'
          variant='confirm'
          okText='Save'
          cancelText='Review'
          onOk={() => {
            setConfirmOpen(false);
            setSuccessOpen(true);
          }}
          onCancel={() => setConfirmOpen(false)}
        />

        <RAlertDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title='Contact Saved!'
          description='The contact has been added successfully.'
          variant='success'
          okText='Done'
          hideCancel
          onOk={() => {
            setSuccessOpen(false);
            setDialogOpen(false);
          }}
        />

        <RAlertDialog
          open={discardOpen}
          onOpenChange={setDiscardOpen}
          title='Discard Changes?'
          description='You have unsaved changes. Are you sure you want to discard them?'
          variant='warning'
          okText='Discard'
          okVariant='destructive'
          cancelText='Keep Editing'
          onOk={() => {
            setDiscardOpen(false);
            setDialogOpen(false);
          }}
          onCancel={() => setDiscardOpen(false)}
        />
      </div>
    );
  },
};

/**
 * Multi-step form wizard with dialogs.
 */
export const MultiStepFormDialog: Story = {
  render: () => {
    const [step1Open, setStep1Open] = useState(false);
    const [step2Open, setStep2Open] = useState(false);
    const [step3Open, setStep3Open] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const Step1Form = () => {
      const form = useForm({
        defaultValues: { fullName: '', email: '' },
        mode: 'onBlur',
      });

      return (
        <RForm form={form} onSubmit={() => {}} layout='vertical'>
          <RFormField control={form.control} name='fullName' label='Full Name'>
            <RInput placeholder='John Doe' />
          </RFormField>
          <RFormField control={form.control} name='email' label='Email Address'>
            <RInput type='email' placeholder='john@example.com' />
          </RFormField>
        </RForm>
      );
    };

    const Step2Form = () => {
      const form = useForm({
        defaultValues: { company: '', role: '' },
        mode: 'onBlur',
      });

      return (
        <RForm form={form} onSubmit={() => {}} layout='vertical'>
          <RFormField control={form.control} name='company' label='Company'>
            <RInput placeholder='Acme Inc.' />
          </RFormField>
          <RFormField control={form.control} name='role' label='Role'>
            <RInput placeholder='Software Engineer' />
          </RFormField>
        </RForm>
      );
    };

    const Step3Form = () => {
      const form = useForm({
        defaultValues: { bio: '' },
        mode: 'onBlur',
      });

      return (
        <RForm form={form} onSubmit={() => {}} layout='vertical'>
          <RFormField control={form.control} name='bio' label='Bio'>
            <RTextarea rows={4} placeholder='Tell us about yourself...' />
          </RFormField>
        </RForm>
      );
    };

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Multi-step form wizard using stacked dialogs.
        </p>

        <RBtn onClick={() => setStep1Open(true)}>Start Registration</RBtn>

        {/* Step 1 */}
        <RDialog
          open={step1Open}
          onOpenChange={setStep1Open}
          title='Step 1: Basic Info'
          description='Enter your basic information.'
          size='sm'
          footer={
            <div className='flex justify-between w-full'>
              <RBtn variant='outline' onClick={() => setStep1Open(false)}>
                Cancel
              </RBtn>
              <RBtn onClick={() => setStep2Open(true)}>Next</RBtn>
            </div>
          }
        >
          <Step1Form />
        </RDialog>

        {/* Step 2 */}
        <RDialog
          open={step2Open}
          onOpenChange={setStep2Open}
          title='Step 2: Work Info'
          description='Enter your work information.'
          size='sm'
          footer={
            <div className='flex justify-between w-full'>
              <RBtn variant='outline' onClick={() => setStep2Open(false)}>
                Back
              </RBtn>
              <RBtn onClick={() => setStep3Open(true)}>Next</RBtn>
            </div>
          }
        >
          <Step2Form />
        </RDialog>

        {/* Step 3 */}
        <RDialog
          open={step3Open}
          onOpenChange={setStep3Open}
          title='Step 3: About You'
          description='Tell us more about yourself.'
          size='sm'
          footer={
            <div className='flex justify-between w-full'>
              <RBtn variant='outline' onClick={() => setStep3Open(false)}>
                Back
              </RBtn>
              <RBtn
                onClick={() => {
                  setStep3Open(false);
                  setStep2Open(false);
                  setStep1Open(false);
                  setSuccessOpen(true);
                }}
              >
                Complete
              </RBtn>
            </div>
          }
        >
          <Step3Form />
        </RDialog>

        <RAlertDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title='Registration Complete!'
          description='Your profile has been created successfully.'
          variant='success'
          okText='Get Started'
          hideCancel
          onOk={() => setSuccessOpen(false)}
        />
      </div>
    );
  },
};

/**
 * Edit form with delete confirmation.
 */
export const EditFormWithDelete: Story = {
  render: () => {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [saveOpen, setSaveOpen] = useState(false);

    const EditForm = () => {
      const form = useForm({
        defaultValues: { fullName: 'John Doe', email: 'john@example.com' },
        mode: 'onBlur',
      });

      return (
        <RForm form={form} onSubmit={() => {}} layout='vertical'>
          <RFormField control={form.control} name='fullName' label='Full Name'>
            <RInput />
          </RFormField>
          <RFormField control={form.control} name='email' label='Email Address'>
            <RInput type='email' />
          </RFormField>
        </RForm>
      );
    };

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Edit form with save and delete actions, both with confirmations.
        </p>

        <RBtn onClick={() => setEditOpen(true)}>Edit Contact</RBtn>

        <RDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          title='Edit Contact'
          description='Update contact information.'
          size='sm'
          footer={
            <div className='flex justify-between w-full'>
              <RBtn variant='destructive' onClick={() => setDeleteOpen(true)}>
                Delete
              </RBtn>
              <div className='flex gap-2'>
                <RBtn variant='outline' onClick={() => setEditOpen(false)}>
                  Cancel
                </RBtn>
                <RBtn onClick={() => setSaveOpen(true)}>Save</RBtn>
              </div>
            </div>
          }
        >
          <EditForm />
        </RDialog>

        {/* Delete confirmation */}
        <RAlertDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title='Delete Contact?'
          description='This will remove the contact from your list.'
          variant='warning'
          okText='Delete'
          okVariant='destructive'
          cancelText='Cancel'
          onOk={() => setConfirmDeleteOpen(true)}
          onCancel={() => setDeleteOpen(false)}
        />

        {/* Final delete confirmation */}
        <RAlertDialog
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
          title='Are you absolutely sure?'
          description='This action cannot be undone. The contact will be permanently deleted.'
          variant='error'
          okText='Yes, Delete Forever'
          okVariant='destructive'
          cancelText='Go Back'
          onOk={() => {
            setConfirmDeleteOpen(false);
            setDeleteOpen(false);
            setEditOpen(false);
          }}
          onCancel={() => setConfirmDeleteOpen(false)}
        />

        {/* Save confirmation */}
        <RAlertDialog
          open={saveOpen}
          onOpenChange={setSaveOpen}
          title='Changes Saved!'
          description='Contact information has been updated.'
          variant='success'
          okText='Done'
          hideCancel
          onOk={() => {
            setSaveOpen(false);
            setEditOpen(false);
          }}
        />
      </div>
    );
  },
};
