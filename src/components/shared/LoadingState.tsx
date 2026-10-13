import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando dados...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center w-full">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent mb-3" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};
