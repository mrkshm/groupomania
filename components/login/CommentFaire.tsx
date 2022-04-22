import React from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Link,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  ModalFooter,
  useDisclosure,
  Text
} from "@chakra-ui/react";

function CommentFaire() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Link onClick={onOpen}>Comment ça marche ?</Link>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comment ça marche ?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Vous renseignez simplement votre adresse email et vous recevrez un
              email avec un lien magique pour vous connecter.
            </Text>
            <Text mt={3}>
              Si vous n&apos;avez pas encore de compte, vous arrivez sur une
              page de bienvenue, sinon vous arrivez directement sur la page
              principale.
            </Text>
            <Text mt={3}>
              Vous n&apos;avez jamais besoin de retenir un mot de passe !
              Facile, n&apos;est-ce pas ?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CommentFaire;
