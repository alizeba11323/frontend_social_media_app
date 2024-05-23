import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

function CustomModel({
  initialRef,
  finalRef,
  isOpen,
  onClose,
  title,
  handleSave,
  handleEdit,
  children,
  loading,
  clearFields,
  isEdit,
}) {
  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} display={"flex"} gap="2" flexDir={"column"}>
          {children}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="purple_solid"
            onClick={async () => {
              if (isEdit) {
                await handleEdit();
              } else {
                await handleSave();
              }
              if (clearFields) clearFields();
              onClose();
            }}
            isLoading={loading}
            spinner={<BeatLoader size={8} color="white" />}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CustomModel;
