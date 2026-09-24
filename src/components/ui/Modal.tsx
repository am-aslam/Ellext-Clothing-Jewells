'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="elx-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`elx-modal-container elx-modal-${maxWidth} ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="elx-modal-header">
          {title && <h3 className="elx-modal-title">{title}</h3>}
          <button
            onClick={onClose}
            className="elx-modal-close"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        <div className="elx-modal-body">{children}</div>
      </div>
    </div>
  );
};

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  placement?: 'right' | 'left';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  placement = 'right',
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="elx-drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`elx-drawer-container elx-drawer-${placement} ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="elx-drawer-header">
          {title && <h3 className="elx-drawer-title">{title}</h3>}
          <button
            onClick={onClose}
            className="elx-drawer-close"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="elx-drawer-body">{children}</div>
      </div>
    </div>
  );
};
