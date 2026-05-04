import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="mb-1 text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors
            placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-rose-500' : 'border-slate-300'}
            ${className}
          `}
          {...props}
        />
        {error && <span className="mt-1 text-sm text-rose-600">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
