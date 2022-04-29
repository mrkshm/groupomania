import React, { useState, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import fetcher from "../src/utils/fetcher";
import { Box, Flex, Spinner, Button } from "@chakra-ui/react";
import { CommentType } from "../src/types";
import CommentCard from "./CommentCard";
import { Trophy, Flower } from "iconoir-react";

function CommentFeed({
  commentCount,
  setCommentCount,
  postId,
  uId,
  commentAdded,
  setCommentAdded
}: any) {
  const [observedComment, setObservedComment] = useState<number>();

  const {
    data,
    error,
    mutate,
    size: page,
    setSize: setPage,
    isValidating
  } = useSWRInfinite<any>(
    index => `/api/comments/for/${postId}?page=${index}`,
    fetcher
  );
  // @ts-ignore
  const comments: CommentType[] = data ? [].concat(...data) : [];

  const voteDesc = () => {
    return (a: CommentType, b: CommentType) =>
      a.voteScore > b.voteScore ? -1 : 1;
  };

  const dateDesc = () => {
    return (a: CommentType, b: CommentType) =>
      a.createdAt > b.createdAt ? -1 : 1;
  };

  const setVoteDesc = () => setSortOptions(voteDesc);
  const setDateDesc = () => setSortOptions(dateDesc);

  const [sortOptions, setSortOptions] = useState(dateDesc);

  useEffect(() => {
    mutate();
    setCommentAdded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentAdded]);

  useEffect(() => {
    if (!comments || comments.length === 0) return;

    const id = comments[comments.length - 1].id;
    if (id !== observedComment) {
      setObservedComment(id);
      // @ts-ignore
      observeElement(document.getElementById(id) as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments]);

  const observeElement = (element: HTMLElement) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting === true) {
          console.log("Bottom reached => get more");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };

  return (
    <Flex mt={8} alignItems={"center"} flexDirection={"column"}>
      {!comments || comments.length < 2 ? null : (
        <Flex gap={8} my={2} direction={{ base: "column", sm: "row" }}>
          <Button onClick={setVoteDesc} variant="ghost" leftIcon={<Trophy />}>
            Meilleur
          </Button>

          <Button onClick={setDateDesc} variant="ghost" leftIcon={<Flower />}>
            Nouveau
          </Button>
        </Flex>
      )}

      <Box maxW="2xl" width={"100%"}>
        {comments ? (
          comments
            .sort(sortOptions)
            .map((comment: CommentType) => (
              <CommentCard
                comment={comment}
                key={comment.id}
                uId={uId}
                mutate={mutate}
                commentCount={commentCount}
                setCommentCount={setCommentCount}
              />
            ))
        ) : (
          <Spinner />
        )}
      </Box>
    </Flex>
  );
}

export default CommentFeed;
