import React, { FC, ReactNode } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  Box,
  UseDisclosureReturn,
} from '@chakra-ui/react';

interface ModalContainerProps {
  modalTrigger: ReactNode;
  title: string;
  disclosure: UseDisclosureReturn;
}

const ModalContainer: FC<ModalContainerProps> = ({
  children,
  modalTrigger,
  title,
  disclosure,
}) => {
  const { isOpen, onClose, onOpen } = disclosure;
  return (
    <>
      <Box w="100%" onClick={() => onOpen()}>
        {modalTrigger}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            px="8"
            py="6"
            fontSize="2xl"
            color="#A8A29E"
            fontWeight="normal"
            borderBottom="1px solid #E7E5E4"
          >
            {title}
          </ModalHeader>
          <ModalCloseButton right="22px" top="6" color="#A8A29E" />
          <ModalBody p="0">{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalContainer;
