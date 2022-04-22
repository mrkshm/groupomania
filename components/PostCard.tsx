import {
  Badge,
  Box,
  Flex,
  Text,
  Link,
  Button,
  IconButton,
  Image as ChakraImage
} from "@chakra-ui/react";
import React, { useState } from "react";
import NextLink from "next/link";
import { UpRoundArrow, DownRoundArrow, MessageText } from "iconoir-react";
import voteHelper from "../src/utils/voteHelper";
import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { PostType } from "../src/types";

interface PostCardProps {
  post: PostType;
  sessionUser: any;
}

function PostCard({
  post: {
    id,
    identifier,
    slug,
    title,
    body,
    tagName,
    image,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    userId,
    userName
  },
  sessionUser
}: PostCardProps) {
  const formatter = buildFormatter(frenchStrings);
  const [userVoteDisp, setUserVoteDisp] = useState(userVote);
  const [voteScoreDisp, setVoteScoreDisp] = useState(voteScore);

  const vote = async (voteValue: number) => {
    const newPost = await voteHelper(
      id,
      sessionUser.id,
      voteValue,
      userVoteDisp as number
    );

    setVoteScoreDisp(newPost.voteScore);
    setUserVoteDisp(newPost.userVote);
  };

  return (
    <Box
      mb={4}
      key={identifier}
      id={identifier}
      borderRadius="lg"
      borderWidth="1px"
      p={4}
      maxW="xl"
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Box fontWeight="semibold" as="h3" overflow="hidden">
          <NextLink href={`/p/${tagName}/${identifier}/${slug}`} passHref>
            {title}
          </NextLink>
        </Box>
        <Link href={`/p/${tagName}`}>
          <Badge colorScheme="orange" mt={2}>
            {tagName}
          </Badge>
        </Link>
      </Flex>
      <Box fontSize="sm">
        <Flex gap={1} direction={{ base: "column", sm: "row" }}>
          <div>
            Publié par <Link href={`/u/${userName}`}>{userName}</Link>
          </div>
          <TimeAgo date={createdAt} formatter={formatter} />
        </Flex>
      </Box>
      <Link
        color=""
        href={`/p/${tagName}/${identifier}/${slug}`}
        style={{ textDecoration: "none" }}
      >
        <Box mt={2}>{body ? <Text noOfLines={3}>{body}</Text> : null}</Box>
        <Box mt={2}>
          {image === "" ? null : (
            <ChakraImage w={"100px "} src={`/api/images/${image}`} />
          )}
        </Box>
      </Link>
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={{ base: "column", sm: "row" }}
      >
        <NextLink href={`/p/${tagName}/${identifier}/${slug}`} passHref>
          <Button
            aria-label="J'aime"
            leftIcon={<MessageText />}
            variant="ghost"
          >
            {commentCount} {commentCount === 1 ? "Commentaire" : "Commentaires"}
          </Button>
        </NextLink>
        <Flex gap={1} alignItems={"center"}>
          {/* Upvote */}
          <IconButton
            aria-label="J'aime"
            icon={<UpRoundArrow />}
            variant="ghost"
            color={userVoteDisp === 1 ? "orange" : ""}
            onClick={() => vote(1)}
          />
          {voteScoreDisp}
          {/* Downvote */}
          <IconButton
            aria-label="Je n'aime pas"
            icon={<DownRoundArrow />}
            variant="ghost"
            color={userVoteDisp === -1 ? "orange" : ""}
            onClick={() => vote(-1)}
          />
        </Flex>
      </Flex>
    </Box>
  );
}

export default PostCard;
