import React from 'react';
import useDeso from '../../hooks/useDeso';
import { BitcloutDataProps } from '../../types';

export const DeSoIdentityButton: React.FC<{
  label?: string;
  cbFx?: (data: BitcloutDataProps) => void;
}> = ({ label = 'Deso Identity', cbFx, children, ...rest }) => {
  const desoWindow = React.useRef<Window | null>(null);

  const { getIdentity } = useDeso();

  return (
    <button
      title={label}
      onClick={async () => {
        await getIdentity((data) => {
          cbFx?.(data);
        }, desoWindow);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
