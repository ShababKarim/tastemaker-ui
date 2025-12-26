'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  timeout?: number;
  type: 'success' | 'error';
  onClose: () => void;
}

const DEFAULT_TIMEOUT = 3000;

export default function Toast({ message, timeout, type, onClose }: ToastProps) {
  const visibilityTimeout = timeout ?? DEFAULT_TIMEOUT;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, visibilityTimeout);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast toast-end toast-bottom z-50">
      <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg text-white`}>
        <span>{message}</span>
      </div>
    </div>
  );
}
