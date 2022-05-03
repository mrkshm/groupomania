import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  useDisclosure
} from "@chakra-ui/react";
import { useRef } from "react";
import { useRouter } from "next/router";

interface DeleteButtonProps {
  postId: number;
}

export default function DeleteButton({ postId }: DeleteButtonProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const deletePost = async () => {
    console.log("deleting", postId);
    const res = await fetch(`/api/post/${postId}`, { method: "DELETE" }).then(
      res => res.json()
    );
    if (res.message !== "Le message a bien été supprimé.") {
      console.log("Le post n'a pas été supprimé.");
      return;
    }
    router.push("/");
  };

  return (
    <Box>
      <Button
        mr={4}
        mt={{ base: 2, sm: 0 }}
        onClick={onOpen}
        colorScheme={"red"}
      >
        Supprimer
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef as any}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer le post
            </AlertDialogHeader>

            <AlertDialogBody>
              Voulez-vous vraiment supprimer ce post ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef as any} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deletePost as any} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
