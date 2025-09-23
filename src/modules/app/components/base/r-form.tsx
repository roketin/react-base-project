import { showAlertValidation } from '@/modules/app/components/base/show-alert-validation';
import { Form } from '@/modules/app/components/ui/form';
import { FormConfigContext } from '@/modules/app/contexts/form-config-context';
import { cn } from '@/modules/app/libs/utils';
import type { ReactNode } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

export type TRFormProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  onSubmit: (values: TFormValues) => void | Promise<void>;
  layout?: 'vertical' | 'horizontal';
  labelWidth?: string;
  children: ReactNode;
  className?: string;
  showErrorPopup?: boolean;
  spacing?: string;
};

const RForm = <TFormValues extends FieldValues>({
  form,
  onSubmit,
  showErrorPopup,
  children,
  labelWidth = '120px',
  layout = 'horizontal',
  className = '',
  spacing = '',
}: TRFormProps<TFormValues>) => {
  return (
    <Form {...form}>
      <FormConfigContext.Provider value={{ labelWidth, layout }}>
        <form
          data-testid='form'
          className={cn(
            'grid',
            spacing ? `gap-[${spacing}]` : 'gap-4',
            className,
          )}
          onSubmit={form.handleSubmit(onSubmit, (err) =>
            showErrorPopup ? showAlertValidation(err) : undefined,
          )}
        >
          {children}
        </form>
      </FormConfigContext.Provider>
    </Form>
  );
};
export default RForm;
