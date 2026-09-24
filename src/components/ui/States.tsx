import React from 'react';
import { ShoppingBag, Heart, Search, AlertCircle, RefreshCw, Tag } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: 'bag' | 'heart' | 'search' | 'tag' | 'generic';
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'generic',
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`elx-empty-state ${className}`}>
      <div className="elx-empty-icon">
        {icon === 'bag' && <ShoppingBag size={36} strokeWidth={1.2} />}
        {icon === 'heart' && <Heart size={36} strokeWidth={1.2} />}
        {icon === 'search' && <Search size={36} strokeWidth={1.2} />}
        {icon === 'tag' && <Tag size={36} strokeWidth={1.2} />}
        {icon === 'generic' && <AlertCircle size={36} strokeWidth={1.2} />}
      </div>
      <h3 className="elx-empty-title">{title}</h3>
      {description && <p className="elx-empty-desc">{description}</p>}
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = 'Curating items...',
  className = ''
}) => {
  return (
    <div className={`elx-loading-state ${className}`}>
      <div className="elx-spinner" />
      <p className="elx-loading-text">{message}</p>
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while retrieving this information.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`elx-error-state ${className}`}>
      <AlertCircle size={36} className="elx-error-icon" strokeWidth={1.5} />
      <h3 className="elx-error-title">{title}</h3>
      <p className="elx-error-desc">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw size={14} className="mr-2" /> Try Again
        </Button>
      )}
    </div>
  );
};
