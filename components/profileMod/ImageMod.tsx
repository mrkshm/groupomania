import { Box, Button, FormControl, FormLabel, Heading } from "@chakra-ui/react";
import React from "react";
import { ProfileModProps } from "../../src/types";
import { useFormik } from "formik";
import profileChanger from "../../src/utils/profileChanger";

function ImageMod({
  onClose,
  userId,
  mutateUser,
  initialRef
}: ProfileModProps) {
  const modifyBody = async (modUser: FormData) => {
    const url = `/api/user/${userId}`;
    const res = await profileChanger(url, modUser);
    mutateUser();
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      newImage: ""
    },
    onSubmit: values => {
      console.log(values);
      let modUser = new FormData();
      modUser.append("image", values.newImage);
      modUser.append("body", "");
      modUser.append("username", "");
      modUser.append("email", "");
      modUser.append("userId", userId);
      modifyBody(modUser);
    }
  });
  return (
    <Box>
      <Heading my={4} size={"sm"}>
        changer votre photo de profil
      </Heading>
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="newImage">votre nouveau photo</FormLabel>

          <input
            ref={initialRef}
            type="file"
            accept="image/*"
            id="newImage"
            name="newImage"
            onChange={event =>
              // @ts-ignore
              formik.setFieldValue("newImage", event.target.files[0])
            }
          ></input>
          <Button
            size={"xs"}
            mt={2}
            onClick={() => {
              formik.setFieldValue("file", null);
              // @ts-ignore
              document.getElementById("newImage").value = "";
            }}
          >
            Réinitialiser photo
          </Button>
        </FormControl>
        <FormControl>
          <Button type="submit" colorScheme={"blue"} mr={4} my={8}>
            Envoyer
          </Button>
          <Button variant={"ghost"} onClick={onClose as any}>
            Fermer
          </Button>
        </FormControl>
      </form>
    </Box>
  );
}

export default ImageMod;
