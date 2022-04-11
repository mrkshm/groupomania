import React from "react";
import NextLink from "next/link";
import { UserType } from "../../src/types";
import fetcher from "../../src/utils/fetcher";
import {
  Avatar,
  Box,
  Flex,
  Link,
  Button,
  Text,
  Image as ChakraImage
} from "@chakra-ui/react";
import { Mail } from "iconoir-react";

import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

interface UserCardProps {
  user: UserType;
  mutate: Function;
}

const baseUrl = "/api/admin/";

function UserCardAdmin({ user, mutate }: UserCardProps) {
  const promoteUser = async () => {
    const url = `${baseUrl}promote/${user.id}`;
    const res = await fetcher(url);
    mutate();
  };

  const demoteUser = async () => {
    const url = `${baseUrl}demote/${user.id}`;
    const res = await fetcher(url);
    mutate();
  };

  const deactivateUser = async () => {
    const url = `${baseUrl}deactivate/${user.id}`;
    const res = await fetcher(url);
    mutate();
  };

  const reactivateUser = async () => {
    const url = `${baseUrl}reactivate/${user.id}`;
    const res = await fetcher(url);
    mutate();
  };

  const deleteUser = async () => {
    const url = `${baseUrl}delete/${user.id}`;
    const res = await fetcher(url);
    mutate();
  };

  const annihilateUser = async () => {
    const url = `${baseUrl}annihilate/${user.id}`;
    const res = await fetcher(url);
    mutate();
  };

  const formatter = buildFormatter(frenchStrings);
  return (
    <Box maxW={"2xl"} mt={4}>
      <Flex
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        mr={8}
        mt={8}
      >
        <Box>
          <Flex alignItems={"center"} gap={4}>
            <NextLink passHref href={`/u/${user.name}`}>
              <Link color={"none"} fontSize={"xl"}>
                {user.name}{" "}
              </Link>
            </NextLink>
            <Link href={`mailto:${user.email}`}>
              <Box mt={1}>
                <Mail />
              </Box>
            </Link>
          </Flex>
          <Text fontSize={"sm"}>
            active depuis{" "}
            <TimeAgo date={user.createdAt} formatter={formatter} />
          </Text>
          <Box mt="2">{user.body}</Box>
        </Box>
        <Link href={`/u/${user.name}`}>
          <Avatar name={user.name} src={`/${user.image}`} />
        </Link>
      </Flex>
      {/* ADMIN CONTENT STARTS HERE */}
      <Box mt={4}>
        <Button
          onClick={user.isAdmin ? demoteUser : promoteUser}
          colorScheme={user.isAdmin ? "red" : "green"}
          size={"xs"}
        >
          {user.isAdmin ? "Demote" : "Promote"}
        </Button>
        <Button
          onClick={user.isActive ? deactivateUser : reactivateUser}
          mx={4}
          size={"xs"}
          colorScheme={user.isActive ? "red" : "green"}
        >
          {user.isActive ? "Deactivate" : "Reactivate"}
        </Button>

        <Button onClick={deleteUser} size={"xs"} colorScheme={"red"}>
          Delete
        </Button>
        <Button onClick={annihilateUser} ml={4} size={"xs"}>
          Annihilate
        </Button>
      </Box>
    </Box>
  );
}

export default UserCardAdmin;
