import {
  Heading,
  FormControl,
  FormLabel,
  Box,
  Input,
  Flex,
  Checkbox,
  FormErrorMessage,
  Textarea,
  Button,
  Image,
  Select
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { PostType, SessionUserType, TagType } from "../src/types";
import { useFormik } from "formik";
import * as Yup from "yup";

interface PostEditType {
  tags: TagType[];
  post: PostType;
  sessionUser: SessionUserType;
  mutatePost: Function;
}

function PostEdit({ tags, post, sessionUser, mutatePost }: PostEditType) {
  const router = useRouter();

  const updatePost = async (modPost: any) => {
    const res = await fetch(`/api/post/${post.id}`, {
      method: "PUT",
      body: modPost
    });
    if (!res.ok) {
      console.log("il y avait un erreur");
    }

    const resJ = await res.json();
    mutatePost();
    const newTags = tags.sort((a: any, b: any) => (a.id > b.id ? -1 : 1));
    const newTagId = newTags.findIndex(tag => tag.id === resJ.tagId);
    const newTagName = newTags[newTagId].name;

    router.push(`/p/${newTagName}/${resJ.identifier}/${resJ.slug}`);
  };

  const formik = useFormik({
    initialValues: {
      file: "",
      body: post.body,
      title: post.title,
      tag: post.tagId,
      deleteImage: false
    },
    validationSchema: Yup.object({
      body: Yup.string().max(
        1000,
        "Votre message ne peut pas contenir plus de 1000 caractères."
      ),
      title: Yup.string()
        .min(1)
        .max(50, "Le titre ne peut pas contenir plus de 50 caractères.")
    }),
    onSubmit: values => {
      let modPost: any = new FormData();

      modPost.append("title", values.title);
      modPost.append("body", values.body);
      modPost.append("tag", values.tag);
      modPost.append("deleteImage", values.deleteImage);
      modPost.append("image", values.file);
      modPost.append("uId", sessionUser.id);

      updatePost(modPost);
    }
  });

  return (
    <Box w={{ base: "100%", sm: "50%" }} p={4}>
      <Heading my={8}>Modifier votre message</Heading>

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
        {formik.values.file || formik.values.deleteImage ? null : (
          <Box>
            {post.image ? (
              <Image
                src={`/api/images/${post.image}`}
                maxW="150px"
                maxH="150px"
                alt="Image du post"
              />
            ) : null}
          </Box>
        )}
        <FormControl
          visibility={
            formik.values.file || formik.values.deleteImage
              ? "hidden"
              : "visible"
          }
        >
          <Flex gap={4}>
            <FormLabel htmlFor="deleteImage">
              <Checkbox
                id="deleteImage"
                name="deleteImage"
                isChecked={formik.values.deleteImage}
                // @ts-ignore
                value={formik.values.deleteImage}
                onChange={formik.handleChange("deleteImage")}
                colorScheme={"red"}
              >
                Supprimer l&apos;image
              </Checkbox>
            </FormLabel>
          </Flex>
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
              formik.setFieldValue("deleteImage", false);
              // @ts-ignore
              document.getElementById("file").value = "";
              // @ts-ignore
              document.getElementById("deleteImage").isChecked = false;
            }}
          >
            Réinitialiser l&apos;image
          </Button>
        </FormControl>

        <FormControl mt={8}>
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

export default PostEdit;
