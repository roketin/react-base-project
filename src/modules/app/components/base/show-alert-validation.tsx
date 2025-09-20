import showAlert from '@/modules/app/components/base/show-alert';
import { collectErrorMessages } from '@/modules/app/libs/error-utils';
import type { FieldErrors } from 'react-hook-form';

export function showAlertValidation(errors: FieldErrors) {
  const messages = collectErrorMessages(errors);

  if (messages.length === 0) return;

  showAlert({
    type: 'alert',
    title: 'Error!',
    description: (
      <ul className='list-disc list-inside pl-0'>
        {messages.map((msg) => (
          <li key={msg} className='text-destructive'>
            {msg}
          </li>
        ))}
      </ul>
    ),
  });
}
