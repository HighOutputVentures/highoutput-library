import { useState } from 'react';
import { ContactFormInputProps } from '../layouts/Contact/validation';

const useSupport = () => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const postSupport = async (url: string, data: ContactFormInputProps) => {
    try {
      setHasError(false);
      setSuccess(false);
      setLoading(true);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const { status } = response;

      if (status !== 201) {
        setHasError(true);
      } else {
        setSuccess(true);
      }

      setLoading(false);
    } catch (error) {
      setHasError(true);
      setLoading(false);
    }
  };

  return { postSupport, isLoading, hasError, isSuccess };
};

export default useSupport;
