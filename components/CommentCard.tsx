import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Link,
  Flex,
  Button,
  Modal,
  IconButton,
  FormControl,
  FormLabel,
  Textarea,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { UpRoundArrow, DownRoundArrow } from "iconoir-react";
import { CommentType, UserType } from "../src/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchPoster from "../src/utils/fetchPoster";
import fetcher from "../src/utils/fetcher";

import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { mutate } from "swr";
import voteHelper from "../src/utils/voteHelper";

interface CommentCardProps {
  comment: CommentType;
  mutate: Function;
  setCommentCount: Function;
  commentCount: number;
  uId: string;
}

function CommentCard({
  comment,
  mutate,
  commentCount,
  setCommentCount,
  uId
}: CommentCardProps) {
  const formatter = buildFormatter(frenchStrings);

  const [localUser, setLocalUser] = useState<UserType | null>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [userVoteDisp, setUserVoteDisp] = useState(comment.userVote);
  const [voteScoreDisp, setVoteScoreDisp] = useState(comment.voteScore);

  const deleteComment = async () => {
    console.log("deleting");
    const res = await fetch(`/api/comments/${comment.id}`, {
      method: "DELETE"
    });
    commentCount ? setCommentCount((commentCount -= 1)) : null;
    mutate();
  };

  useEffect(() => {
    fetcher(`/api/user/${uId}`)
      .then(res => setLocalUser(res))
      .catch(err => console.log(err));
  }, []);

  const formik = useFormik({
    initialValues: {
      body: comment.body
    },
    validationSchema: Yup.object({
      body: Yup.string()
        .required("Ce champ ne peut pas être vide")
        .max(
          1000,
          "Un commentaire ne peut pas contenir plus de 1000 caractères."
        )
    }),
    onSubmit: async values => {
      const commentModUrl = `/api/comments/${comment.id}`;
      const body = JSON.stringify({
        body: values.body
      });
      const res = await fetchPoster(commentModUrl, body);
      mutate();
      onClose();
    }
  });

  const vote = async (voteValue: number) => {
    const newComment = await voteHelper(
      comment.id,
      uId,
      voteValue,
      userVoteDisp as number,
      "comment"
    );

    setVoteScoreDisp(newComment.voteScore);
    setUserVoteDisp(newComment.userVote);
  };

  return (
    <Box borderWidth="1px" borderRadius={"lg"} p={4} my={2} width="100%">
      <Flex gap={4}>
        <Flex direction={"column"} alignItems={"center"} alignSelf="center">
          <IconButton
            aria-label="J'aime"
            icon={<UpRoundArrow />}
            variant="ghost"
            color={userVoteDisp === 1 ? "orange" : ""}
            onClick={() => vote(1)}
          />
          {voteScoreDisp}
          <IconButton
            aria-label="Je n'aime pas"
            icon={<DownRoundArrow />}
            variant="ghost"
            color={userVoteDisp === -1 ? "orange" : ""}
            onClick={() => vote(-1)}
          />
        </Flex>
        <Box>
          <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
            {comment.body}
          </ReactMarkdown>
          <Flex gap={1} mt={2} direction={{ base: "column", sm: "row" }}>
            <Text fontSize="sm">
              Publié par{" "}
              <Link href={`u/${comment.username}`}>{comment.username}</Link>
            </Text>
            <Text fontSize="sm">
              <TimeAgo date={comment.createdAt} formatter={formatter} />
            </Text>
          </Flex>
          {localUser && localUser.isAdmin ? (
            <Button
              onClick={deleteComment}
              mt={2}
              colorScheme={"red"}
              size={"xs"}
            >
              effacer
            </Button>
          ) : null}
          {uId === comment.userId ? (
            <Button
              onClick={onOpen}
              mt={2}
              ml={2}
              colorScheme={"blue"}
              size={"xs"}
            >
              modifier
            </Button>
          ) : null}
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier le commentaire</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* @ts-ignore */}
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                isInvalid={formik.touched.body && (formik.errors.body as any)}
              >
                <FormLabel htmlFor="body">Votre commentaire</FormLabel>
                <Textarea
                  value={formik.values.body}
                  name="body"
                  id="body"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </FormControl>
              <FormControl mt={8}>
                <Button colorScheme="blue" mr={3} type="submit">
                  Publier
                </Button>
                <Button onClick={onClose} variant="ghost">
                  Fermer
                </Button>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CommentCard;
