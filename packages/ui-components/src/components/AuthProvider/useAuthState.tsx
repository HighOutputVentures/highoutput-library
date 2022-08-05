import * as React from 'react';
import getAuthState from './getAuthState';
import type { AuthState } from './types';

type Config = {
  onauthenticated: () => void;
  onunauthenticated: () => void;
};

export default function useAuthState({onauthenticated, onunauthenticated}: Partial<Config> = {}) {
  const [state, setState] = React.useState<AuthState>({
    status: 'loading',
  });

  const handleState = React.useCallback(() => {
    const newState = getAuthState();
    if (newState.status === 'authenticated') onauthenticated?.();
    if (newState.status === 'unauthenticated') onunauthenticated?.();
    setState(newState);
  }, [onauthenticated, onunauthenticated]);

  React.useEffect(() => {
    handleState();
    return () => setState({status: 'loading'});
  }, [handleState]);

  React.useEffect(() => {
    document.addEventListener('visibilitychange', handleState);
    return () => document.removeEventListener('visibilitychange', handleState);
  }, [handleState, onunauthenticated]);

  return state;
}