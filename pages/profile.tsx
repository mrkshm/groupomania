import React, { useState } from "react";
import useSWR from "swr";
import { Flex, Box, Heading, Spinner, Button } from "@chakra-ui/react";
import UserSidebar from "../components/UserSidebar";
import fetcher from "../src/utils/fetcher";
import { getSession } from "next-auth/react";
import Feed from "../components/Feed";
import CommentFeedFrom from "../components/CommentFeedFrom";
import { SessionUserObjectType } from "../src/types";

function Profile({ sessionUser }: SessionUserObjectType) {
  const getUserUrl = `/api/user/${sessionUser.id}`;

  const {
    data: user,
    mutate: mutateUser,
    error: userError
  } = useSWR(getUserUrl, fetcher);
  if (userError) {
    console.log(userError);
  }

  const [postCommentSwitcher, setPostCommentSwitcher] = useState("posts");

  return (
    <Box>
      {user ? (
        <Flex
          flexDirection={{ base: "column-reverse", sm: "row" }}
          justifyContent="center"
          alignItems="flex-start"
          gap={{ base: 0, sm: 4 }}
        >
          <Box w={{ base: "100%", sm: "50%" }} p={4}>
            <Flex my={4} gap="4">
              <Button
                variant={"ghost"}
                onClick={() => setPostCommentSwitcher("posts")}
              >
                Posts
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => setPostCommentSwitcher("comments")}
              >
                Comments
              </Button>
            </Flex>
            {postCommentSwitcher === "posts" ? (
              <>
                <Heading size={"lg"}>Les posts de {user.name}</Heading>
                <Feed
                  feedUrl={`posts/from/${user.id}`}
                  sessionUser={sessionUser}
                />
              </>
            ) : (
              <CommentFeedFrom userId={user.id} uId={sessionUser.id} />
            )}
          </Box>
          <Box w={{ base: "100%", sm: "35%" }}>
            <UserSidebar
              sessionUser={sessionUser as any}
              user={user}
              mutateUser={mutateUser}
            />
          </Box>
        </Flex>
      ) : (
        <Spinner />
      )}
    </Box>
  );
}

export default Profile;

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

  return {
    props: {
      sessionUser: session.user
    }
  };
}
