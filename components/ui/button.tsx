import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonStyles = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-900',
  {
    variants: {
      variant: {
        solid: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-slate-200',
        outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700',
        ghost: 'text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-zinc-800'
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-10 px-5',
        lg: 'h-11 px-6'
      }
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonStyles({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
