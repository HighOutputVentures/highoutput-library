import React, { createContext, ReactNode, useContext, useRef } from 'react';
import { DeSoIdentityButton } from '../components';
import useDeso from '../hooks/useDeso';
import { BitcloutDataProps } from '../types';

const DesoContext = createContext<{
  getSingleProfile: (input: string) => Promise<any>;
  getIdentity: (cbFx: (data: BitcloutDataProps) => void) => void;
  DeSoIdentityButton: ReactNode;
}>({
  getSingleProfile: (input: string) => new Promise(resolve => resolve(input)),
  getIdentity: cbFx => new Promise(resolve => resolve(cbFx)),
  DeSoIdentityButton,
});

const DesoProvider: React.FC = ({ children }) => {
  const desoWindow = useRef<Window | null>(null);

  const { getSingleProfile, getIdentity } = useDeso();

  return (
    <DesoContext.Provider
      value={{
        getSingleProfile,
        getIdentity: cbFx => getIdentity(cbFx, desoWindow),
        DeSoIdentityButton,
      }}
    >
      {children}
    </DesoContext.Provider>
  );
};

const useDesoContextValues = () => useContext(DesoContext);

const DesoConsumer = DesoContext.Consumer;

export {
  DesoContext as default,
  DesoProvider,
  useDesoContextValues,
  DesoConsumer,
};
