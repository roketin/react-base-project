import showAlert from '@/modules/app/components/base/show-alert';
import { collectErrorMessages } from '@/modules/app/libs/error-utils';
import { FileWarning, Info } from 'lucide-react';
import type { FieldErrors } from 'react-hook-form';

export function showAlertValidation(errors: FieldErrors) {
  const messages = collectErrorMessages(errors);

  if (messages.length === 0) return;

  showAlert({
    type: 'alert',
    title: 'Sorry, there are some errors',
    icon: <FileWarning />,
    okText: 'Close',
    description: (
      <ul className='list-none pl-0 text-sm'>
        {messages.map((msg) => (
          <li
            key={msg}
            className='text-destructive py-2 border-b border-b-slate-100 flex gap-3 items-center'
          >
            <Info size={14} className='flex-none' />
            <div className='flex-1'>{msg}</div>
          </li>
        ))}
      </ul>
    ),
  });
}
