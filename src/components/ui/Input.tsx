import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors
            placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-rose-500' : 'border-slate-300'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-600 mt-1">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
