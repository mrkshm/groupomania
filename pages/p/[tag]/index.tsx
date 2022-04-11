import React from "react";
import { useRouter } from "next/router";
import { Container, Flex, Box, Heading, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Header from "../../../components/Header";
import MetaHead from "../../../components/MetaHead";
import Feed from "../../../components/Feed";

function TagPage() {
  const router = useRouter();
  const session = useSession();
  const sessionUser = session.data?.user;

  const { tag } = router.query;

  return (
    <Container maxW="container.xl" p={0}>
      <MetaHead />
      <Header />
      <Flex
        flexDirection={{ base: "column", sm: "row" }}
        justifyContent="center"
        alignItems="flex-start"
        gap={4}
      >
        <Box w={{ base: "100%", sm: "50%" }} p={4}>
          <Box my={8}>
            <Heading size={"md"} mb={8}>
              Tous les posts pour le tag {tag}
            </Heading>
            {router.query.tag ? (
              <Feed
                sessionUser={sessionUser}
                feedUrl={`posts/with/tag/${router.query.tag}`}
              />
            ) : (
              <Spinner />
            )}
          </Box>
        </Box>
        <Box w={{ base: "100%", sm: "35%" }}>
          <Box w={{ base: "100%" }} p={4}>
            <Heading>{tag}</Heading>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}

export default TagPage;
