import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  ModalFooter
} from "@chakra-ui/react";

import * as Yup from "yup";
import { useFormik } from "formik";

function InitialModal(props: any) {
  const pwFormik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("l'adresse email n'est pas valide")
        .required("une adresse email est requise")
    }),
    onSubmit: values => {
      pwForm(values);
    }
  });

  const pwForm = (values: any) => {
    const url = "http://localhost:5500/api/auth/reset-password";

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({
        email: values.email
      })
    })
      .then(response => {
        if (response.ok === false) {
          props.setPwError(
            "Cette adresse email n'est pas associée avec un compte utilisateur Groupomania."
          );

          confirmModal();
        }

        confirmModal();
      })
      .catch(error => {
        console.log(error);
      });
  };
  const confirmModal = () => {
    props.setSentModal(true);
  };
  return (
    <ModalContent>
      <ModalHeader>Mot de passe oublié ?</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        Ce n&apos;est pas grave. Veuillez renseigner votre adresse email et vous
        recevrez un email avec des instructions comment réinitialiser votre mot
        de passe.
        <form onSubmit={pwFormik.handleSubmit}>
          <SimpleGrid rowGap={6}>
            <GridItem mt={4}>
              <FormControl
                // @ts-ignore
                isInvalid={pwFormik.touched.email && pwFormik.errors.email}
              >
                <FormLabel>Email</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jean@gabin.com"
                  value={pwFormik.values.email}
                  onBlur={pwFormik.handleBlur}
                  onChange={pwFormik.handleChange}
                />
                {pwFormik.touched.email && pwFormik.errors.email ? (
                  <FormErrorMessage>{pwFormik.errors.email}</FormErrorMessage>
                ) : null}
              </FormControl>
            </GridItem>
            <GridItem>
              <Button colorScheme="blue" type="submit">
                Envoyer
              </Button>
            </GridItem>
          </SimpleGrid>
        </form>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </ModalContent>
  );
}

export default InitialModal;
