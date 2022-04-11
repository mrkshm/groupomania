import React from "react";

import { Avatar, Box, Input as ChakraInput, Flex } from "@chakra-ui/react";
import { AddMediaImage } from "iconoir-react";
import { useRouter } from "next/router";
import { UserObjectType } from "../src/types/index";

function Input({ user }: UserObjectType) {
  const router = useRouter();

  const createPost = () => {
    router.push("/create");
  };

  return (
    <Box width={{ base: "100%", sm: "90%" }}>
      <Flex onClick={createPost} gap={4} alignItems={"center"}>
        <Avatar name={user.name ? user.name : user.email} src={user.image} />
        <ChakraInput placeholder="Créer une publication" size="lg" />
        <AddMediaImage fontSize={"28"} />
      </Flex>
    </Box>
  );
}

export default Input;
