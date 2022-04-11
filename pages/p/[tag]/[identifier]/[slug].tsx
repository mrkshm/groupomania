import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { prisma } from "../../../../db";
import { Box, Container, Spinner } from "@chakra-ui/react";
import Header from "../../../../components/Header";
import MetaHead from "../../../../components/MetaHead";
import PostCardFull from "../../../../components/PostCardFull";
import CommentFeed from "../../../../components/CommentFeed";
import CreateComment from "../../../../components/CreateComment";
import { PostType, SessionUserObjectType } from "../../../../src/types";
import useSWR from "swr";
import fetcher from "../../../../src/utils/fetcher";

import { getSession } from "next-auth/react";

function PostPage({ sessionUser }: SessionUserObjectType) {
  const router = useRouter();
  // const session = useSession();
  const [userVoteDisp, setUserVoteDisp] = useState(0);
  const [voteScoreDisp, setVoteScoreDisp] = useState(0);
  // const sessionUser: any = session.data?.user;

  const { identifier, slug } = router.query;

  // getting the post with swr
  const swrPostUrl = `/api/posts/${identifier}/${slug}`;
  const {
    data: post,
    mutate: mutatePost,
    error: postError
  } = useSWR(swrPostUrl, fetcher);

  const [commentCount, setCommentCount] = useState(0);
  const [commentAdded, setCommentAdded] = useState(false);

  useEffect(() => {
    if (post) {
      setVoteScoreDisp(post.voteScore);
      setUserVoteDisp(post.userVote);
      setCommentCount(post.commentCount);
    }
  }, [post]);

  return (
    <Container maxW="container.xl" p={0}>
      <MetaHead />
      <Header />
      {post ? (
        <Box>
          <PostCardFull
            post={post}
            commentCount={commentCount}
            sessionUser={sessionUser}
            userVoteDisp={userVoteDisp}
            voteScoreDisp={voteScoreDisp}
            setVoteScoreDisp={setVoteScoreDisp}
            setUserVoteDisp={setUserVoteDisp}
          />
          <CreateComment
            // mutate={commentsMutate}
            postId={post.id}
            commentCount={commentCount}
            setCommentCount={setCommentCount}
            uId={sessionUser.id}
            setCommentAdded={setCommentAdded}
          />

          <CommentFeed
            postId={post.id}
            commentCount={commentCount}
            setCommentCount={setCommentCount}
            commentAdded={commentAdded}
            setCommentAdded={setCommentAdded}
            uId={sessionUser.id}
          />
        </Box>
      ) : (
        <Spinner />
      )}
    </Container>
  );
}

export default PostPage;

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
  const sessionUser: any = session.user;
  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    };
  }
  const localUser = await prisma.user.findUnique({
    where: {
      id: sessionUser!.id!
    }
  });
  if (localUser) {
    sessionUser.isAdmin = localUser.isAdmin;
  }
  return {
    props: {
      sessionUser: sessionUser
    }
  };
}
