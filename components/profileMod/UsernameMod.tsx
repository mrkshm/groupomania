import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ProfileModProps } from "../../src/types";
import profileChanger from "../../src/utils/profileChanger";

function UsernameMod({
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
      username: populator
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(
          30,
          "Votre nom d'utilisateur·rice ne paut pas contenir plus de 30 caractères."
        )
        .required()
        .min(
          3,
          "Le nom d'utilisateur·rice doit contenir au moins 3 caractères."
        )
        .matches(
          /^\S+$/,
          "Le nom d'utilisateur·rice ne peut pas contenir des espaces."
        )
        .required("Un nom d'utilisateur·rice est requis.")
    }),
    onSubmit: values => {
      let modUser = new FormData();
      modUser.append("body", "");
      modUser.append("username", values.username!);
      modUser.append("email", "");
      modUser.append("userId", userId);
      modifyBody(modUser);
    }
  });

  return (
    <Box>
      <Heading my={4} size={"sm"}>
        changer votre nom d utilisateur
      </Heading>
      <form onSubmit={formik.handleSubmit}>
        <FormControl
          isInvalid={formik.touched.username && (formik.errors.username as any)}
        >
          <FormLabel htmlFor="username">
            votre nouveau nom d&apos;utilisateur
          </FormLabel>
          <Input
            ref={initialRef}
            type="text"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
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

export default UsernameMod;
