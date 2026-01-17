'use client';

import { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface AsyncButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick?: () => Promise<void> | void;
}

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
