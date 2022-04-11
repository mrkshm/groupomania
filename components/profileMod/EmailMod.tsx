import React from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  FormErrorMessage
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ProfileModProps } from "../../src/types";
import profileChanger from "../../src/utils/profileChanger";

function EmailMod({
  onClose,
  populator,
  mutateUser,
  userId,
  initialRef
}: ProfileModProps) {
  const modifyBody = async (modUser: FormData) => {
    const url = `/api/user/${userId}`;
    const resJ = await profileChanger(url, modUser);
    mutateUser();
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      email: populator
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Veuillez saisir une adresse valable.")
    }),
    onSubmit: values => {
      let modUser = new FormData();
      modUser.append("body", "");
      modUser.append("username", "");
      modUser.append("email", values.email!);
      modUser.append("userId", userId);
      modifyBody(modUser);
    }
  });

  return (
    <Box>
      <Heading my={4} size={"sm"}>
        changer votre adresse email
      </Heading>
      <Text mb={4}>
        Après avoir changé votre adresse email, vous allez être obligé de vous
        connecter à nouveau.
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <FormControl
          isInvalid={formik.touched.email && (formik.errors.email as any)}
        >
          <FormLabel htmlFor="email">votre nouvelle adresse email</FormLabel>
          <Input
            ref={initialRef}
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <Button type="submit" colorScheme={"blue"} mr={4} my={8}>
            Modifier
          </Button>
          <Button variant={"ghost"} onClick={onClose as any}>
            Fermer
          </Button>
        </FormControl>
      </form>
    </Box>
  );
}

export default EmailMod;
