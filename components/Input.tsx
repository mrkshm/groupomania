import React, { useState } from "react";
import {
  Avatar,
  Box,
  Input as ChakraInput,
  Flex,
  Spinner
} from "@chakra-ui/react";
import { AddMediaImage } from "iconoir-react";
import { useRouter } from "next/router";

function Input({ sessionUser }: any) {
  const router = useRouter();

  const [userImage, setUserImage] = useState(sessionUser.image);

  const localUser = fetch(`/api/user/${sessionUser.id}`, { method: "GET" })
    .then(res => res.json())
    .then(res => {
      if (res.image !== sessionUser.image) {
        setUserImage(res.image);
      }
    })
    .catch();

  const createPost = () => {
    router.push("/create");
  };

  return (
    <Box width={{ base: "100%", sm: "90%" }}>
      {sessionUser ? (
        <Flex onClick={createPost} gap={4} alignItems={"center"}>
          <Avatar
            name={sessionUser.name ? sessionUser.name : sessionUser.email}
            src={`/api/images/${userImage}`}
          />
          <ChakraInput placeholder="Créer une publication" size="lg" />
          <AddMediaImage fontSize={"28"} />
        </Flex>
      ) : (
        <Spinner />
      )}
    </Box>
  );
}

export default Input;
