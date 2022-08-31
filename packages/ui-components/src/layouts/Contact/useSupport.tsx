import { useState } from 'react';
import { postJson } from '../../utils/http.utils';
import { ContactFormInputProps } from './validation';

const useSupport = () => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const postSupport = async (url: string, data: ContactFormInputProps) => {
    setHasError(false);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await postJson<{ ok: true }>(url, { ...data });

      if (response) {
        setSuccess(true);
      }
    } catch (error) {
      setHasError(true);
    }

    setLoading(false);
  };

  return { postSupport, isLoading, hasError, isSuccess };
};

export default useSupport;
