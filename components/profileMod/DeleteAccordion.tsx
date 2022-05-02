import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  useDisclosure,
  Spinner
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useRef, useState } from "react";

interface AccordionProps {
  userId: string;
}

function DeleteAccordion({ userId }: AccordionProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const [action, setAction] = useState("deactivate");

  function accountAlert(action: string) {
    setAction(action);
    onOpen();
  }

  const closeAccount = async () => {
    const url = `/api/admin/deactivate/${userId}`;
    const res = await fetch(url, { method: "DELETE" });
    const resJ = await res.json();
    signOut();
  };

  const annihilateAccount = async () => {
    const url = `/api/user/${userId}`;

    const res = await fetch(url, { method: "POST" });
    const resJ = await res.json();

    // if (!res.ok) {
    //   console.log(resJ);
    //   return;
    // }

    signOut();
  };

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton mb={4} mt={8}>
          <Box mr={4}>Autres actions</Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Button
            colorScheme={"blue"}
            onClick={() => accountAlert("deactivate")}
          >
            Désactiver le compte
          </Button>
        </AccordionPanel>
        <AccordionPanel>
          <Button
            colorScheme={"red"}
            onClick={() => accountAlert("annihilate")}
          >
            Supprimer le compte
          </Button>
        </AccordionPanel>
      </AccordionItem>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef as any}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {action === "deactivate"
                ? "Dèsactiver le compte"
                : "Supprimer le compte"}
            </AlertDialogHeader>

            <AlertDialogBody>Êtes-vous sûr(e)s ?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef as any} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={
                  action === "deactivate" ? closeAccount : annihilateAccount
                }
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Accordion>
  );
}

export default DeleteAccordion;
