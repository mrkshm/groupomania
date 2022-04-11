import React from "react";
import { useRouter } from "next/router";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
  Image as ChakraImage
} from "@chakra-ui/react";
import { MessageText, UpRoundArrow, DownRoundArrow } from "iconoir-react";
import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import voteHelper from "../src/utils/voteHelper";

interface PostCardFullProps {
  post: any;
  commentCount: number;
  sessionUser: any;
  userVoteDisp: number;
  voteScoreDisp: number;
  setUserVoteDisp: Function;
  setVoteScoreDisp: Function;
}

function PostCardFull({
  post,
  commentCount,
  sessionUser,
  userVoteDisp,
  voteScoreDisp,
  setUserVoteDisp,
  setVoteScoreDisp
}: PostCardFullProps) {
  const router = useRouter();
  const formatter = buildFormatter(frenchStrings);
  const editPost = () => {
    router.push(`/e/${post.tagName}/${post.identifier}/${post.slug}`);
  };

  const vote = async (voteValue: number) => {
    const newPost = await voteHelper(
      post.id,
      sessionUser.id,
      voteValue,
      userVoteDisp
    );
    console.log("new post is: ", newPost);

    setVoteScoreDisp(newPost.voteScore);
    setUserVoteDisp(newPost.userVote);
  };
  return (
    <Flex justifyContent={"center"}>
      <Box maxW={"2xl"} borderWidth="1px" borderRadius={"lg"} p={8}>
        <Flex justifyContent={"space-between"}>
          <Heading mb={4}>{post.title}</Heading>
          <Link href={`/p/${post.tagName}`}>
            <Badge
              // alignSelf={"center"}
              colorScheme="orange"
              maxH={8}
              mt={2}
              p="2"
            >
              {post.tagName}
            </Badge>
          </Link>
        </Flex>
        <Box fontSize="sm">
          <Flex gap={1}>
            <div>
              Publié par{" "}
              <Link href={`/u/${post.userName}`}>{post.userName}</Link>
            </div>
            <TimeAgo date={post.createdAt} formatter={formatter} />
          </Flex>
        </Box>
        <Box mt={2}>
          <Text>{post.body === "" ? null : post.body}</Text>
        </Box>
        <Box mt={2}>
          {post.image === "" ? null : (
            <ChakraImage w={"100%"} mb={8} src={`/${post.image}`} />
          )}
        </Box>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Flex gap={2} mr={4}>
            <MessageText />
            {commentCount ? commentCount : 0}{" "}
            {commentCount === 1 ? "Commentaire" : "Commentaires"}
          </Flex>

          {sessionUser && sessionUser.id === post.userId ? (
            <Button mr={4} onClick={editPost} colorScheme={"blue"}>
              Edit
            </Button>
          ) : null}
          {sessionUser.isAdmin ? (
            <Button mr={4} onClick={editPost} colorScheme={"red"}>
              Supprimer
            </Button>
          ) : null}

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
    </Flex>
  );
}

export default PostCardFull;
