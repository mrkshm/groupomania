import type { NextPage } from "next";
import Head from "next/head";
import { prisma } from "../db";
import Tags from "../components/Tags";
import { Container, Box, Flex, Spinner } from "@chakra-ui/react";
import Header from "../components/Header";
import News from "../components/News";
import Input from "../components/Input";
import { getSession, useSession } from "next-auth/react";
import Feed from "../components/Feed";

const Home: NextPage = articles => {
  const session = useSession();
  const sessionUser: any = session.data?.user;

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
        flexDirection={{ base: "column-reverse", sm: "row" }}
        justifyContent="center"
        alignItems="flex-start"
        gap={4}
      >
        <Box w={{ base: "100%", sm: "50%" }} p={4}>
          {sessionUser ? (
            <>
              <Input user={sessionUser} />
              <Feed feedUrl="posts" sessionUser={sessionUser} />
            </>
          ) : (
            <Spinner />
          )}
        </Box>
        <Box w={{ base: "100%", sm: "35%" }}>
          <Box w={{ base: "100%" }} p={4}>
            <Tags />
          </Box>

          <Box
            display={{ base: "none", sm: "unset" }}
            w={{ base: "100%", sm: "100%" }}
            my={4}
            p={4}
          >
            <News articles={articles} />
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default Home;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    };
  }

  const sessionUser = session.user;

  // get news
  const results = await fetch(
    `https://newsapi.org/v2/top-headlines?country=fr&apiKey=${process.env.NEWS_KEY}`
  ).then(res => res.json());
  return {
    props: {
      articles: results.articles,
      sesh: session,
      sessionUser: sessionUser
    }
  };
}
