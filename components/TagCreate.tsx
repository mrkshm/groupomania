import React, { useState } from "react";
import {
  Container,
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Tooltip,
  UnorderedList,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormHelperText,
  Textarea,
  Text,
  Input,
  Heading,
  Select,
  useDisclosure,
  Image as ChakraImage
} from "@chakra-ui/react";
import fetchPoster from "../src/utils/fetchPoster";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TagType } from "../src/types";

function TagCreate({ sessionUser, tags, mutateTags }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState("");

  const cleanTags = async () => {
    const url = "/api/tags";
    const res = await fetch(url, { method: "DELETE" });
    const result = res.json();
    mutateTags();
  };

  const formik = useFormik({
    initialValues: {
      tagname: ""
    },
    validationSchema: Yup.object({
      tagname: Yup.string()
        .min(3, "Un tag doit contenir au moins 3 caractères.")
        .max(20, "Un tag ne peut pas contenir plus de 30 caractères.")
        .matches(/^\S+$/, "Le tag ne peut pas contenir des espaces.")
        .required("Ce champ doit être remplis.")
    }),
    onSubmit: async values => {
      setErrorMessage("");
      const tagCreateUrl = "/api/tags";
      const body = JSON.stringify({
        name: values.tagname
      });

      const fetch = await fetchPoster(tagCreateUrl, body);
      if (fetch.message === "Ce tag existe déjà.") {
        setErrorMessage(fetch.message);
        return;
      }
      values.tagname = "";
      onClose();
      mutateTags();
    }
  });

  return (
    <Box maxH={16} mx={16} mb={16}>
      <Heading mt={8} mb={4}>
        Tags - Top 10
      </Heading>
      <Flex flexDir={"column"} gap={2}>
        <UnorderedList>
          {!tags
            ? "Loading..."
            : tags
                .sort((a: TagType, b: TagType) =>
                  a._count.posts > b._count.posts ? -1 : 1
                )
                .map((tag: TagType) => (
                  <ListItem mb={1} key={tag.name}>
                    {tag.name}
                  </ListItem>
                ))}
        </UnorderedList>
        <Button onClick={onOpen}>Créer un nouveau Tag</Button>
        {sessionUser && sessionUser.isAdmin ? (
          <Tooltip label="Supprimer tous les tags qui ne sont pas associé à un post.">
            <Button colorScheme={"red"} onClick={cleanTags}>
              Nettoyer tags
            </Button>
          </Tooltip>
        ) : null}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer un nouveau tag</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                isInvalid={
                  formik.touched.tagname && (formik.errors.tagname as any)
                }
              >
                <FormLabel htmlFor="tagname">
                  Le nom pour votre tag (20 caractères max)
                </FormLabel>
                <Input
                  id="tagname"
                  name="tagname"
                  value={formik.values.tagname}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="nouveau_tag"
                  type="text"
                  required
                />
                <FormErrorMessage>{formik.errors.tagname}</FormErrorMessage>
                <Text color={"red.400"}>{errorMessage}</Text>
              </FormControl>
              <FormControl mt={8}>
                <Button type="submit" colorScheme="blue">
                  Créer le tag
                </Button>
                <Button mx={4} variant="ghost" onClick={onClose}>
                  Fermer
                </Button>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TagCreate;
