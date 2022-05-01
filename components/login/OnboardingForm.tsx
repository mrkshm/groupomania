import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Text,
  Textarea,
  SimpleGrid,
  GridItem,
  Button
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchPoster from "../../src/utils/fetchPoster";

function OnboardingForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");

  const onboard = async (payload: FormData) => {
    const url = "/api/onboarding";
    try {
      const res = await fetchPoster(url, payload);

      if (res.message !== "L'utilisateur·rice a bien été créé.") {
        setErrorMessage(res.message);
        return;
      }
      router.push("/");
    } catch (error) {
      console.log("Il y avait un erreur.");
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      body: "",
      image: ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required()
        .min(
          3,
          "Le nom d'utilisateur·rice doit contenir au moins 3 caractères."
        )
        .matches(
          /^\S+$/,
          "Le nom d'utilisateur·rice ne peut pas contenir des espaces."
        ),
      body: Yup.string().max(
        1000,
        "La description ne peut pas contenir plus de 1000 caractères."
      )
    }),
    onSubmit: values => {
      let user = new FormData();
      // user.append("uid", sessionUser.id);
      user.append("name", values.name);
      user.append("body", values.body);
      user.append("image", values.image);

      onboard(user);
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 6000);
  }, [errorMessage]);

  return (
    <VStack
      w="full"
      h="full"
      p={10}
      pt={{ base: 0, sm: 10 }}
      spacing={10}
      alignItems="flex-start"
    >
      <VStack spacing={3} alignItems="flex-start">
        <Text fontSize={"xl"} mb={2}>
          Encore quelques petits pas avant que vous puissiez participer...
        </Text>
        <form onSubmit={formik.handleSubmit}>
          <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
            <GridItem colSpan={2}>
              <FormControl
                isRequired
                // @ts-ignore
                isInvalid={formik.touched.name && formik.errors.name}
              >
                <FormLabel htmlFor="name">
                  Veuillez choisir un nom d&apos;utilisateur·rice
                </FormLabel>
                <Input
                  id={"name"}
                  name={"name"}
                  type={"text"}
                  placeholder="Jeanne d'Arc"
                  value={formik.values.name}
                  onBlur={formik.handleBlur("name")}
                  onChange={formik.handleChange("name")}
                />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                <Text color={"red.400"}>{errorMessage}</Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl
                // @ts-ignore
                isInvalid={formik.touched.body && formik.errors.body}
              >
                <FormLabel htmlFor="body">
                  Si vous voulez, vous pouvez écrire quelques mots sur vous.
                </FormLabel>
                <Textarea
                  minH={32}
                  name="body"
                  id="body"
                  placeholder="Comment j'ai liberé la France des Anglais."
                  value={formik.values.body}
                  onBlur={formik.handleBlur("body")}
                  onChange={formik.handleChange("body")}
                />
                <FormErrorMessage>{formik.errors.body}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel htmlFor="image">Télécharger une image</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  name="image"
                  onChange={event =>
                    // @ts-ignore
                    formik.setFieldValue("image", event.target.files[0])
                  }
                />
              </FormControl>
              <Button
                mt={2}
                size={"sm"}
                onClick={() => {
                  formik.setFieldValue("file", null);
                  // @ts-ignore
                  document.getElementById("image").value = "";
                }}
              >
                Réinitialiser l&apos;image
              </Button>
            </GridItem>
            <GridItem>
              <Button colorScheme={"blue"} type="submit">
                Envoyer
              </Button>
            </GridItem>
          </SimpleGrid>
        </form>
      </VStack>
    </VStack>
  );
}

export default OnboardingForm;
