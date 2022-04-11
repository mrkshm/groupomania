import React from "react";
import {
  Box,
  Flex,
  Input,
  FormErrorMessage,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import useSWR from "swr";
import { MessageText } from "iconoir-react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface CreateCommentProps {
  postId: number;
  // mutate: Function;
  commentCount: number;
  setCommentCount: Function;
  setCommentAdded: Function;
  uId: string;
}

function CreateComment({
  postId,
  // mutate,
  commentCount,
  setCommentCount,
  setCommentAdded,
  uId
}: CreateCommentProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const createNewComment = async (values: any) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: values.newComment,
        postId: postId,
        sessionUserId: uId
      })
    });
    if (!res.ok) {
      console.log("Il y avait un erreur...");
      return;
    }
    const resJ = await res.json();
    console.log(resJ);
    values.newComment = "";
    setCommentAdded(true);
    setCommentCount((commentCount += 1));
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      newComment: ""
    },
    validationSchema: Yup.object({
      newComment: Yup.string()
        .max(
          1000,
          "Votre commentaire ne peut pas contenir plus de 1000 caractères."
        )
        .required(
          "Vous êtes obligé d'écrire quelque chose si vous voulez créer un commentaire..."
        )
    }),
    onSubmit: values => {
      createNewComment(values);
    }
  });

  return (
    <Flex mt={8} justifyContent="center">
      <Box maxW="2xl">
        <Flex alignItems={"center"} gap={2} onClick={onOpen}>
          <MessageText />
          <Input readOnly placeholder="Écrire un commentaire" width={"100%"} />
        </Flex>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef as any}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Écrire un commentaire</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                isInvalid={
                  formik.touched.newComment &&
                  formik.errors.newComment !== undefined
                }
              >
                <FormLabel htmlFor="newComment">Votre commentaire</FormLabel>
                <Textarea
                  ref={initialRef as any}
                  value={formik.values.newComment}
                  placeholder="Votre nouveau commentaire."
                  id="newComment"
                  name="newComment"
                  onBlur={formik.handleBlur("newComment")}
                  onChange={formik.handleChange("newComment")}
                />
                <FormErrorMessage>{formik.errors.newComment}</FormErrorMessage>
              </FormControl>
              <FormControl mt={8}>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={formik.handleSubmit as any}
                >
                  Publier
                </Button>
                <Button onClick={onClose} variant="ghost">
                  Fermer
                </Button>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default CreateComment;
