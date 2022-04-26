import React from "react";
import { getSession } from "next-auth/react";
import { Flex, Box, Spinner } from "@chakra-ui/react";
import CodesOfConduct from "../components/CodesOfConduct";
import TagCreate from "../components/TagCreate";
import PostCreate from "../components/PostCreate";
import fetcher from "../src/utils/fetcher";
import { prisma } from "../db";
import useSWR from "swr";
import { SessionUserType, UserType } from "../src/types";

function Create({ sessionUser }: any) {
  const getTagsUrl = "../api/tags";
  const {
    data: tags,
    mutate: mutateTags,
    error: tagError
  } = useSWR(getTagsUrl, fetcher);

  return (
    <Box>
      <Flex
        flexDirection={{ base: "column", sm: "row" }}
        justifyContent="center"
        alignItems="flex-start"
        gap={4}
      >
        <PostCreate tags={tags} />
        <Flex
          direction={{ base: "column-reverse", sm: "column" }}
          w={{ base: "100%", sm: "35%" }}
        >
          <CodesOfConduct />
          {sessionUser ? (
            <TagCreate
              sessionUser={sessionUser}
              tags={tags}
              mutateTags={mutateTags}
            />
          ) : (
            <Spinner />
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default Create;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    };
  }

  const sessionUser: any = session.user;

  const localUser: any = await prisma.user.findUnique({
    where: {
      id: sessionUser.id
    }
  });

  if (localUser.isAdmin) {
    sessionUser.isAdmin = true;
  } else {
    sessionUser.isAdmin = false;
  }

  return {
    props: {
      sessionUser
    }
  };
}
