import {
  Heading,
  FormControl,
  FormLabel,
  Box,
  Input,
  FormErrorMessage,
  Textarea,
  Button,
  Select
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { TagType } from "../src/types";
import { useFormik } from "formik";
import * as Yup from "yup";

function PostCreate({ tags }: any) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      file: "",
      body: "",
      title: "",
      tag: ""
    },
    validationSchema: Yup.object({
      body: Yup.string().max(
        1000,
        "Votre message ne peut pas contenir plus de 1000 caractères."
      ),
      title: Yup.string()
        .min(1)
        .max(50, "Le titre ne peut pas contenir plus de 50 caractères.")
        .required(),
      tag: Yup.string().required()
    }),
    onSubmit: values => {
      let post = new FormData();

      post.append("title", values.title);
      post.append("body", values.body);
      post.append("tag", values.tag);
      post.append("image", values.file);

      fetch("../api/posts", {
        method: "POST",
        body: post
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          router.push("/");
        })
        .catch(err => console.log(err));
    }
  });

  return (
    <Box w={{ base: "100%", sm: "50%" }} p={4}>
      <Heading my={8}>Publier un nouveau message</Heading>

      <form onSubmit={formik.handleSubmit}>
        <FormControl
          isInvalid={formik.touched.title && formik.errors.title !== undefined}
        >
          <FormLabel htmlFor="title">Titre</FormLabel>
          <Input
            type="text"
            id="title"
            name="title"
            value={formik.values.title}
            placeholder="le titre de votre message"
            onBlur={formik.handleBlur("title")}
            onChange={formik.handleChange("title")}
          />
          {formik.touched.title && formik.errors.title ? (
            <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
          ) : null}
        </FormControl>

        <FormControl
          isInvalid={formik.touched.body && formik.errors.body !== undefined}
          my={8}
        >
          <FormLabel htmlFor="body">Message</FormLabel>

          <Textarea
            id="body"
            value={formik.values.body}
            onBlur={formik.handleBlur("body")}
            onChange={formik.handleChange("body")}
            name="body"
            minH={64}
            placeholder="votre message"
          />
          {formik.touched.body && formik.errors.body ? (
            <FormErrorMessage>{formik.errors.body}</FormErrorMessage>
          ) : null}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="file">Télécharger une image</FormLabel>
          <input
            type="file"
            accept="image/*"
            id="file"
            name="file"
            onChange={event =>
              // @ts-ignore
              formik.setFieldValue("file", event.target.files[0])
            }
          ></input>
          <Button
            onClick={() => {
              formik.setFieldValue("file", null);
              // @ts-ignore
              document.getElementById("file").value = "";
            }}
          >
            Supprimer l&apos;image
          </Button>
        </FormControl>

        <FormControl mt={8} isInvalid={formik.errors.tag !== undefined}>
          <FormLabel htmlFor="tag">Choisir un tag</FormLabel>
          <Select
            maxW={64}
            value={formik.values.tag}
            onBlur={formik.handleBlur("tag")}
            onChange={formik.handleChange("tag")}
            id="tag"
            name="tag"
            placeholder="Choisir un tag"
          >
            {!tags
              ? "Loading"
              : tags
                  .sort((a: TagType, b: TagType) => (a.name > b.name ? 1 : -1))
                  .map((tag: TagType) => (
                    <option key={tag.name} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
          </Select>
          {formik.touched.tag && formik.errors.tag ? (
            <FormErrorMessage>{formik.errors.tag}</FormErrorMessage>
          ) : null}
        </FormControl>

        <FormControl>
          <Button colorScheme={"blue"} my={8} type="submit">
            Publier
          </Button>
        </FormControl>
      </form>
    </Box>
  );
}

export default PostCreate;
