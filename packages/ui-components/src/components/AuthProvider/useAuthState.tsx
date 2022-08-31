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
    setState(newState);
  }, []);

  React.useEffect(() => {
    handleState();
    return () => setState({status: 'loading'});
  }, [handleState]);

  React.useEffect(() => {
    document.addEventListener('visibilitychange', handleState);
    return () => document.removeEventListener('visibilitychange', handleState);
  }, [handleState]);

  React.useEffect(() => {
    if (state.status === 'authenticated') onauthenticated?.();
    if (state.status === 'unauthenticated') onunauthenticated?.();
  }, [onauthenticated, onunauthenticated, state.status]);

  return state;
}
