import { Textarea, TextareaProps } from '@chakra-ui/react';
import * as React from 'react';
import { useId } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';

export type TextareaAutosizeProps = TextareaProps & {
  minRows?: number;
  maxRows?: number;
};

const TextareaAutosize = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(({ minRows, maxRows, ...props }, ref) => {
  const uid = useId();
  return (
    <Textarea
      as={ReactTextareaAutosize}
      ref={ref}
      width="full"
      resize="none"
      minHeight="unset"
      overflowX="hidden"
      overflowY="auto"
      transition="height none"
      minRows={minRows ?? 2}
      maxRows={maxRows ?? 4}
      data-testid={`${uid}-textarea-autosize`}
      {...props}
    />
  );
});

export default TextareaAutosize;
