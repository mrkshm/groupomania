import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button
} from "@chakra-ui/react";
import React from "react";

function ConfirmationModal(props: any) {
  const closeModal = () => {
    props.setPwError("");
    props.onClose();
    props.setSentModal(false);
  };

  const successMsg =
    "Un email avec un lien pour réinitialiser le mot de passe était envoyé à l'adresse email renseignée.";
  return (
    <ModalContent>
      <ModalHeader>Message envoyé</ModalHeader>
      <ModalCloseButton />
      <ModalBody>{props.pwError ? props.pwError : successMsg}</ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" type="submit" onClick={closeModal}>
          Fermer
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default ConfirmationModal;
