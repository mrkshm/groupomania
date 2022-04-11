import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Textarea
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { ProfileModProps } from "../../src/types";
import profileChanger from "../../src/utils/profileChanger";
import FocusLock from "react-focus-lock";

function BodyMod({
  onClose,
  populator,
  userId,
  mutateUser,
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
      body: populator
    },
    validationSchema: Yup.object({
      body: Yup.string().max(
        1000,
        "Votre description ne paut pas contenir plus de 1000 caractères."
      )
    }),
    onSubmit: values => {
      let modUser = new FormData();
      modUser.append("body", values.body!);
      modUser.append("username", "");
      modUser.append("email", "");
      modUser.append("userId", userId);
      modifyBody(modUser);
    }
  });

  return (
    <Box>
      <Heading my={4} size={"sm"}>
        changer votre description
      </Heading>
      <form onSubmit={formik.handleSubmit}>
        <FormControl
          isInvalid={formik.touched.body && (formik.errors.body as any)}
        >
          <FormLabel htmlFor="body">votre nouvelle description</FormLabel>

          <Textarea
            ref={initialRef}
            id="body"
            name="body"
            value={formik.values.body}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            minH={60}
          />

          <FormErrorMessage>{formik.errors.body}</FormErrorMessage>
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

export default BodyMod;
