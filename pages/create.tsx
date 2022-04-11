import React from "react";
import { getSession, useSession } from "next-auth/react";
import { Container, Flex, Box, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import Header from "../components/Header";
import CodesOfConduct from "../components/CodesOfConduct";
import { useRouter } from "next/router";
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
    <Container maxW="container.xl" p={0}>
      <Head>
        <title>Groupomania</title>
        <meta
          name="description"
          content="Le reseau social de votre entreprise."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

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
    </Container>
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
