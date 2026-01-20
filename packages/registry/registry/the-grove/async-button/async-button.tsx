'use client';

import { useState } from 'react';
import { Button, buttonVariants } from '@/registry/the-grove/ui/button';
import { Loader2 } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';

export interface AsyncButtonProps
  extends Omit<React.ComponentProps<'button'>, 'onClick'>,
    VariantProps<typeof buttonVariants> {
  onClick?: () => Promise<void> | void;
  asChild?: boolean;
}
/**
 * AsyncButton is a wrapper around the standard Button component that adds support for asynchronous
 * operations. When clicked, it handles async functions gracefully, automatically displaying a spinner
 * (using Loader2) while the async operation is in progress and disabling the button to prevent additional clicks.
 *
 * Props:
 * - onClick: An async or sync function to execute when the button is clicked. Can return a promise.
 * - children: The content to display inside the button.
 * - disabled: Boolean to manually disable the button (will also be disabled while loading).
 * - variant: Visual style for the button, forwarded to the Button component.
 * - size: Size for the button, forwarded to the Button component.
 * - ...props: Any other props supported by the Button component, such as className or type.
 *
 * Usage:
 * ```tsx
 * <AsyncButton onClick={async () => await doSomethingAsync()}>
 *   Submit
 * </AsyncButton>
 * ```
 *
 * While the async operation is in progress:
 * - The button is disabled to prevent double submissions.
 * - A spinning loader icon appears to the left of the button's content.
 * - Any errors during execution will be logged to the console.
 */

export function AsyncButton({
  onClick,
  children,
  disabled,
  variant,
  size,
  ...props
}: AsyncButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;

    setLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error('AsyncButton error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || loading}
      variant={variant}
      size={size}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
