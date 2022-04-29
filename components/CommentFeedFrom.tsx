import React, { useState, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import fetcher from "../src/utils/fetcher";
import { Box, Flex, Spinner, Heading, Button, Tooltip } from "@chakra-ui/react";
import { CommentType } from "../src/types";
import CommentCard from "./CommentCard";
import { Trophy, Flower } from "iconoir-react";

function CommentFeed({ userId, uId }: any) {
  const [observedComment, setObservedComment] = useState<number>();

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

  const {
    data,
    error,
    mutate,
    size: page,
    setSize: setPage,
    isValidating
  } = useSWRInfinite<any>(
    index => `/api/comments/from/${userId}?page=${index}`,
    fetcher
  );
  // @ts-ignore
  const comments: CommentType[] = data ? [].concat(...data) : [];

  useEffect(() => {
    if (!comments || comments.length === 0) return;

    const id = comments[comments.length - 1].id;
    if (id !== observedComment) {
      setObservedComment(id);
      // @ts-ignore
      observeElement(document.getElementById(id));
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
    <Flex mt={8} justifyContent="center" width={"100%"}>
      <Box>
        <Heading size={"lg"} mb={8} ml={{ base: 4, sm: 0 }}>
          Les commentaires
        </Heading>
        <Flex gap={8} my={8} direction={{ base: "column", sm: "row" }}>
          <Button onClick={setDateDesc} variant="ghost" leftIcon={<Flower />}>
            Nouveau
          </Button>
          <Button onClick={setVoteDesc} variant="ghost" leftIcon={<Trophy />}>
            Meilleur
          </Button>
        </Flex>
        <Box maxW="2xl">
          {comments ? (
            comments.sort(sortOptions).map((comment: CommentType) => (
              <CommentCard
                comment={comment}
                key={comment.id}
                uId={uId}
                mutate={mutate}
                setCommentCount={(arg: any) => {
                  null;
                }}
                commentCount={1}
              />
            ))
          ) : (
            <Spinner />
          )}
        </Box>
      </Box>
    </Flex>
  );
}

export default CommentFeed;
