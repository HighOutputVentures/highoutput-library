import React, { FC, ReactNode } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Divider,
} from '@chakra-ui/react';

interface ModalContainerProps {
  modalTrigger: ReactNode;
  headerComponent: ReactNode;
}

const ModalContainer: FC<ModalContainerProps> = ({
  children,
  modalTrigger,
  headerComponent,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Box w="100%" onClick={() => onOpen()}>
        {modalTrigger}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent p="4">
          <Box>
            {headerComponent}
            <ModalCloseButton top="5" right="4" />
          </Box>
          <Divider colorScheme="blue" pt="4" mb="4" />
          <ModalBody p="0">{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalContainer;
