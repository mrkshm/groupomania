import React from "react";
import NextLink from "next/link";
import type { User } from "@prisma/client";
import { Avatar, Box, Flex, Link, Text } from "@chakra-ui/react";
import { Mail } from "iconoir-react";

import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  console.log("user is", user);
  const formatter = buildFormatter(frenchStrings);
  return (
    <Box maxW={{ base: "600px", sm: "2xl" }} mt={4}>
      <Flex
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        mr={8}
        mt={8}
        direction={{ base: "column-reverse", sm: "row" }}
      >
        <Box>
          <Flex alignItems={"center"} gap={4}>
            <NextLink passHref href={`/u/${user.slug}`}>
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
        <Link href={`/u/${user.slug}`}>
          <Avatar
            ml={8}
            name={user.name as string | undefined}
            src={
              user.image
                ? user.image.includes("https://")
                  ? `${user.image}`
                  : `/${user.image}`
                : ""
            }
          />
        </Link>
      </Flex>
    </Box>
  );
}

export default UserCard;
