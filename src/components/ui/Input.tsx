import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`elx-input-group ${error ? 'has-error' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="elx-label">
            {label}
            {props.required && <span className="elx-required">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`elx-input ${className}`}
          aria-invalid={!!error}
          {...props}
        />
        {hint && !error && <span className="elx-hint">{hint}</span>}
        {error && <span className="elx-error-msg">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`elx-input-group ${error ? 'has-error' : ''}`}>
        {label && (
          <label htmlFor={selectId} className="elx-label">
            {label}
            {props.required && <span className="elx-required">*</span>}
          </label>
        )}
        <div className="elx-select-wrapper">
          <select id={selectId} ref={ref} className={`elx-select ${className}`} {...props}>
            {options
              ? options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
        </div>
        {error && <span className="elx-error-msg">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
