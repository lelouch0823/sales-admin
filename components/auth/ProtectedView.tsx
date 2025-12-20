import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { Role } from '../../types';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';

interface ProtectedViewProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  fallback?: React.ReactNode;
  onBack?: () => void;
}

export const ProtectedView: React.FC<ProtectedViewProps> = ({
  children,
  allowedRoles,
  fallback,
  onBack
}) => {
  const { hasRole } = useAuth();
  const { t: _t } = useTranslation();

  // If no roles defined, assume it's open to authenticated users (who are already checked by App.tsx)
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  if (hasRole(allowedRoles)) {
    return <>{children}</>;
  }

  // --- Render 403 Forbidden UI ---
  if (fallback) return <>{fallback}</>;

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in zoom-in-95">
      <div className="w-16 h-16 bg-danger-light rounded-full flex items-center justify-center mb-6">
        <ShieldAlert size={32} className="text-danger" />
      </div>
      <h2 className="text-xl font-bold text-primary mb-2">Access Denied</h2>
      <p className="text-muted max-w-md mb-8">
        You do not have the required permissions ({allowedRoles.join(', ')}) to view this resource.
        Please contact your administrator if you believe this is an error.
      </p>
      {onBack && (
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Go Back
        </Button>
      )}
    </div>
  );
};