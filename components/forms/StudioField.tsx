'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

/** Enquiry form fields, built on the shared ui primitives (components/ui/*). */
const FIELD_ERROR = 'mt-2 text-sm text-destructive';
const FIELD_STACK = 'space-y-2';
const LEGEND = 'mb-3 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-muted-foreground';
const FIELD_TEXT = 'text-base sm:text-[15px]';
/** Above the enquiry sheet (z-[100]) so dropdowns opened inside it stay visible. */
const SELECT_LAYER = 'z-[110]';

interface BaseProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  /** Keep the label for screen readers only (the placeholder carries it visually). */
  hideLabel?: boolean;
}

function LabelText({ label, required, optional }: Pick<BaseProps, 'label' | 'required' | 'optional'>) {
  return (
    <>
      {label}
      {required && <span aria-hidden="true"> *</span>}
      {optional && <span className="normal-case tracking-normal"> (optional)</span>}
    </>
  );
}

export const TextField = forwardRef<HTMLInputElement, BaseProps & InputHTMLAttributes<HTMLInputElement>>(function TextField(
  { id, label, required, optional, error, hideLabel, ...rest },
  ref,
) {
  const errId = `${id}-error`;
  return (
    <div className={FIELD_STACK}>
      <Label htmlFor={id} className={hideLabel ? 'sr-only' : 'block'}><LabelText label={label} required={required} optional={optional} /></Label>
      <Input
        ref={ref}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={FIELD_TEXT}
        {...rest}
      />
      {error && <p id={errId} className={FIELD_ERROR}>{error}</p>}
    </div>
  );
});

type TextAreaFieldProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Grow to fill the remaining height of a flex column (keeps the 96px minimum). */
  grow?: boolean;
};

export function TextAreaField({ id, label, optional, error, hideLabel, grow, ...rest }: TextAreaFieldProps) {
  const errId = `${id}-error`;
  return (
    <div className={cn(FIELD_STACK, grow && 'flex flex-1 flex-col')}>
      <Label htmlFor={id} className={hideLabel ? 'sr-only' : 'block'}><LabelText label={label} optional={optional} /></Label>
      <Textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={cn('resize-none min-h-[96px]', FIELD_TEXT, grow && 'flex-1')}
        {...rest}
      />
      {error && <p id={errId} className={FIELD_ERROR}>{error}</p>}
    </div>
  );
}

interface SelectFieldProps extends BaseProps {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}

/** Single-choice dropdown on the shared Select primitive. */
export function SelectField({ id, name, label, optional, options, value, onChange, placeholder }: SelectFieldProps) {
  return (
    <div className={FIELD_STACK}>
      <Label htmlFor={id} className="block"><LabelText label={label} optional={optional} /></Label>
      <Select name={name} value={value || undefined} onValueChange={onChange}>
        <SelectTrigger id={id} className={cn(FIELD_TEXT, !value && 'text-muted-foreground')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={SELECT_LAYER}>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface ChipGroupProps {
  /** Used for the input name and ids. */
  name: string;
  legend: string;
  options: readonly string[];
  /** 'checkbox' = multi-select, 'radio' = single choice (click again to clear). */
  type: 'checkbox' | 'radio';
  value: string[];
  onChange: (next: string[]) => void;
  required?: boolean;
  optional?: boolean;
  error?: string;
  /** Short hint shown on the legend line. */
  hint?: ReactNode;
}

/** Pill chips backed by native radios/checkboxes, so keyboard and screen readers work as expected. */
export function ChipGroup({ name, legend, options, type, value, onChange, required, optional, error, hint }: ChipGroupProps) {
  const errId = `${name}-error`;
  const toggle = (opt: string) => {
    if (type === 'radio') onChange([opt]);
    else onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className={LEGEND}>
        <LabelText label={legend} required={required} optional={optional} />
        {hint && <span className="ml-2 font-sans text-xs normal-case tracking-normal">{hint}</span>}
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt, i) => {
          const checked = value.includes(opt);
          const inputId = `${name}-${i}`;
          return (
            <label key={opt} htmlFor={inputId} className="relative cursor-pointer">
              <input
                id={inputId}
                type={type}
                name={name}
                value={opt}
                checked={checked}
                onChange={() => toggle(opt)}
                onClick={type === 'radio' && checked ? () => onChange([]) : undefined}
                className="peer sr-only"
              />
              <span
                className={`inline-flex h-11 items-center rounded-full border px-5 text-sm font-medium transition-colors duration-300 select-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
                  checked
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-foreground/20 text-foreground hover:border-foreground/50'
                }`}
              >
                {opt}
              </span>
            </label>
          );
        })}
      </div>
      {error && <p id={errId} className={FIELD_ERROR}>{error}</p>}
    </fieldset>
  );
}
