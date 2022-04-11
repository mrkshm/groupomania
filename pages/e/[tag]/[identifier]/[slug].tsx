import React from "react";
import { prisma } from "../../../../db";
import { getSession } from "next-auth/react";
import { Container, Flex, Box, Spinner } from "@chakra-ui/react";
import Header from "../../../../components/Header";
import MetaHead from "../../../../components/MetaHead";
import CodesOfConduct from "../../../../components/CodesOfConduct";
import { SessionUserObjectType } from "../../../../src/types";
import { useRouter } from "next/router";
import TagCreate from "../../../../components/TagCreate";
import PostEdit from "../../../../components/PostEdit";
import fetcher from "../../../../src/utils/fetcher";
import useSWR from "swr";

function EditPost({ sessionUser }: SessionUserObjectType) {
  const router = useRouter();

  const { identifier, slug } = router.query;

  // getting the post with swr
  const getPostUrl = `/api/posts/${identifier}/${slug}`;
  const {
    data: post,
    mutate: mutatePost,
    error: postError
  } = useSWR(getPostUrl, fetcher);
  if (postError) {
    console.log("Erreur dans getPost");
  }

  const getTagsUrl = "/api/tags";
  const {
    data: tags,
    mutate: mutateTags,
    error: tagError
  } = useSWR(getTagsUrl, fetcher);
  if (tagError) {
    console.log("Erreur dans getTags");
  }

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
        {post ? (
          <PostEdit
            tags={tags}
            sessionUser={sessionUser}
            post={post}
            mutatePost={mutatePost}
          />
        ) : (
          <Spinner />
        )}

        <Box w={{ base: "100%", sm: "35%" }}>
          <CodesOfConduct />
          <TagCreate
            sessionUser={sessionUser}
            tags={tags}
            mutateTags={mutateTags}
          />
        </Box>
      </Flex>
    </Container>
  );
}

export default EditPost;

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
