import { showAlertValidation } from '@/modules/app/components/base/show-alert-validation';
import { Form } from '@/modules/app/components/ui/form';
import { FormConfigContext } from '@/modules/app/contexts/form-config-context';
import type {
  TDisableable,
  TLayoutOrientation,
} from '@/modules/app/types/component.type';
import { cn } from '@/modules/app/libs/utils';
import { useEffect, useMemo, type ReactNode } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type TRFormProps<TFormValues extends FieldValues> = TDisableable & {
  id?: string;
  form: UseFormReturn<TFormValues>;
  onSubmit: (values: TFormValues) => void | Promise<void>;
  layout?: TLayoutOrientation;
  labelWidth?: string;
  children: ReactNode;
  className?: string;
  showErrorPopup?: boolean;
  spacing?: string;
  hideHorizontalLine?: boolean;
};

const RForm = <TFormValues extends FieldValues>({
  id,
  form,
  onSubmit,
  showErrorPopup,
  children,
  labelWidth = '120px',
  layout = 'horizontal',
  className = '',
  spacing = '',
  disabled = false,
  hideHorizontalLine = false,
}: TRFormProps<TFormValues>) => {
  const { trigger } = form;
  const { i18n } = useTranslation();

  const providerValue = useMemo(
    () => ({ labelWidth, layout, disabled, hideHorizontalLine }),
    [labelWidth, layout, disabled, hideHorizontalLine],
  );

  // listener: re-validate hanya field yang sudah disentuh saat bahasa berubah
  useEffect(() => {
    const onLanguageChanged = () => {
      const touchedFields = form.formState.touchedFields;
      const errorFields = form.formState.errors;

      const fieldsToTrigger = [
        ...Object.keys(touchedFields ?? {}),
        ...Object.keys(errorFields ?? {}),
      ];

      // hapus duplikat
      const uniqueFields = Array.from(new Set(fieldsToTrigger));

      if (uniqueFields.length > 0) {
        // Cast uniqueFields to Array<keyof TFormValues & string>, then to Path<TFormValues>[]
        trigger(
          (uniqueFields as Array<keyof TFormValues & string>).map(
            (field) => field as import('react-hook-form').Path<TFormValues>,
          ),
        );
      }
    };

    i18n.on('languageChanged', onLanguageChanged);
    return () => i18n.off('languageChanged', onLanguageChanged);
  }, [i18n, trigger, form.formState.touchedFields, form.formState.errors]);

  return (
    <Form {...form}>
      <FormConfigContext.Provider value={providerValue}>
        <form
          id={id}
          data-testid={id}
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
