import RBtn from '@/modules/app/components/base/r-btn';
import { RDialog } from '@/modules/app/components/base/r-dialog';
import RForm from '@/modules/app/components/base/r-form';
import { RFormField } from '@/modules/app/components/base/r-form-field';
import { RInputPassword } from '@/modules/app/components/base/r-input-password';
import Yup from '@/plugins/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const formSchema = Yup.object().shape({
  password: Yup.string().required().label('Password'),
});

type TFormSchema = Yup.InferType<typeof formSchema>;

export type TAuthPasswordConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: (authenticated: boolean) => void;
  title?: string;
  description?: string;
};

const AuthPasswordConfirmDialog = ({
  open,
  onOpenChange,
  onAuthenticated,
  title = 'Konfirmasi Password',
  description = 'Masukkan password untuk melanjutkan',
}: TAuthPasswordConfirmDialogProps) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TFormSchema>({
    mode: 'onSubmit',
    resolver: yupResolver(formSchema),
    defaultValues: { password: '' },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset();
      setError('');
      setIsLoading(false);
    }
  }, [open, form]);

  const handleSubmit = useCallback(
    async (values: TFormSchema) => {
      setIsLoading(true);
      setError('');

      // Placeholder: Replace with actual API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simple password check - replace with actual validation
      if (values.password === 'admin123') {
        onAuthenticated(true);
        onOpenChange(false);
      } else {
        setError('Password salah');
        onAuthenticated(false);
      }

      setIsLoading(false);
    },
    [onAuthenticated, onOpenChange],
  );

  return (
    <RDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size='sm'
      footer={
        <>
          <RBtn
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </RBtn>
          <RBtn onClick={form.handleSubmit(handleSubmit)} loading={isLoading}>
            Konfirmasi
          </RBtn>
        </>
      }
    >
      <RForm form={form} onSubmit={handleSubmit} layout='vertical'>
        <RFormField control={form.control} name='password' label='Password'>
          <RInputPassword placeholder='Masukkan password' autoFocus />
        </RFormField>
        {error && <p className='text-sm text-destructive mt-2'>{error}</p>}
      </RForm>
    </RDialog>
  );
};

export default AuthPasswordConfirmDialog;
