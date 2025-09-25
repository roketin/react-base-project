import { Input } from '@/modules/app/components/ui/input';
import { omit, safeRound } from '@/modules/app/libs/utils';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';

export type RInputNumberProps = Omit<ComponentProps<'input'>, 'onChange'> & {
  decimalLimit?: number;
  isOnBlurFormat?: boolean;
  onChange?: (value: number) => void;
  negative?: boolean;
  isFormatOnChange?: boolean;
  allowExtraDecimal?: boolean;
  hasPercentRestriction?: boolean;
  allowDecimal?: boolean;
};

const RInputNumber = ({
  decimalLimit = 2,
  onChange,
  isOnBlurFormat = false,
  negative = false,
  value,
  isFormatOnChange = true,
  allowExtraDecimal = false,
  hasPercentRestriction = false,
  allowDecimal = true,
  ...props
}: RInputNumberProps) => {
  const [displayValue, setDisplayValue] = useState<string>(String(value || ''));
  const isChangedByOnChange = useRef(false);
  const rawValueRef = useRef<string>(String(value || ''));

  const handleFormat = useCallback(
    (originalValue: string | number | readonly string[] | undefined) => {
      if (
        originalValue === '' ||
        originalValue === null ||
        originalValue === undefined
      ) {
        setDisplayValue('');
        return;
      }

      if (decimalLimit === 0) {
        setDisplayValue(`${originalValue}`);
        return;
      }

      if (hasPercentRestriction && Number(originalValue) > 100) {
        setDisplayValue(`OVER`);
        return;
      }

      const val =
        typeof originalValue === 'number'
          ? safeRound(originalValue, decimalLimit)
          : originalValue;

      let [integerPart, decimalPart = ''] = String(val || '')
        .replace(/,/g, '')
        .split('.');

      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      decimalPart = decimalPart
        .padEnd(decimalLimit, '0')
        .slice(0, decimalLimit);

      const formattedValue =
        decimalLimit > 0 && integerPart !== ''
          ? `${integerPart}.${decimalPart}`
          : '';

      setDisplayValue(formattedValue);
    },
    [decimalLimit, hasPercentRestriction],
  );

  useEffect(() => {
    if (!isChangedByOnChange.current && isFormatOnChange) {
      if (value !== null && value !== undefined && value !== '') {
        rawValueRef.current = String(value);
        handleFormat(value);
      } else {
        rawValueRef.current = '';
        setDisplayValue('');
      }
    }
    isChangedByOnChange.current = false;
  }, [value, handleFormat, isFormatOnChange]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const invalidKeys = ['e', 'E', '+', '-'];

    if (!allowDecimal) {
      invalidKeys.push('.');
    }

    if (negative && event.key === '-') {
      const currentValue = (event.target as HTMLInputElement).value;
      if (currentValue.length === 0 || currentValue === '0') return;
      event.preventDefault();
      return;
    }

    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }

    props.onKeyDown?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;

    if (/^0\d+/.test(value)) {
      value = value.replace(/^0+/, '');
    }

    let regexPattern: RegExp;
    if (negative) {
      if (allowExtraDecimal) {
        regexPattern = /^-?\d*(\.?\d*)?$/;
      } else {
        regexPattern = new RegExp(`^-?\\d*(\\.\\d{0,${decimalLimit}})?$`);
      }
    } else {
      if (allowExtraDecimal) {
        regexPattern = /^\d*(\.?\d*)?$/;
      } else {
        regexPattern = new RegExp(`^\\d*(\\.\\d{0,${decimalLimit}})?$`);
      }
    }
    const regex = regexPattern;

    if (regex.test(value)) {
      rawValueRef.current = value;
      setDisplayValue(value);
      isChangedByOnChange.current = true;
      onChange?.(+value);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (isOnBlurFormat && !event.target.matches(':focus')) {
      const rawValue = rawValueRef.current.replace(/,/g, '');

      if (rawValue === '') {
        setDisplayValue('');
        return;
      }

      if (Number(rawValue) > 100 && hasPercentRestriction) {
        setDisplayValue('OVER');
        return;
      }

      handleFormat(rawValue);
      onChange?.(+rawValue);
    }

    props.onBlur?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    const raw = rawValueRef.current;

    if (
      raw === '0' ||
      raw === '0.0' ||
      raw === '0.00' ||
      parseFloat(raw) === 0
    ) {
      setDisplayValue('');
      rawValueRef.current = '';
    } else if (raw) {
      setDisplayValue(raw.replace(/,/g, ''));
    }

    props.onFocus?.(event);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    let pastedData = event.clipboardData.getData('Text').replace(/,/g, '');

    pastedData = negative
      ? pastedData.replace(/[^0-9.-]/g, '')
      : pastedData.replace(/[^0-9.]/g, '');

    let regexPatternPaste: RegExp | string;
    if (negative) {
      if (allowExtraDecimal) {
        regexPatternPaste = /^-?\d*(\.?\d*)?$/;
      } else {
        regexPatternPaste = `^-?\\d*(\\.\\d{0,${decimalLimit}})?$`;
      }
    } else {
      if (allowExtraDecimal) {
        regexPatternPaste = /^\d*(\.?\d*)?$/;
      } else {
        regexPatternPaste = `^\\d*(\\.\\d{0,${decimalLimit}})?$`;
      }
    }
    const regex = new RegExp(regexPatternPaste);

    if (regex.test(pastedData)) {
      rawValueRef.current = pastedData;
      setDisplayValue(pastedData);

      isChangedByOnChange.current = true;
      onChange?.(+pastedData);
    }
  };

  return (
    <Input
      value={displayValue}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPaste={handlePaste}
      {...omit(props, ['onKeyDown', 'onBlur', 'onFocus', 'onPaste'])}
    />
  );
};

export { RInputNumber };
