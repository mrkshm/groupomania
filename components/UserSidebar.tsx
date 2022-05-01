import React, { useState, ReactElement } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Flex,
  Box,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Link,
  Text,
  Image as ChakraImage,
  useDisclosure,
  Spinner
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { Mail } from "iconoir-react";
import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import UsernameMod from "./profileMod/UsernameMod";
import EmailMod from "./profileMod/EmailMod";
import BodyMod from "./profileMod/BodyMod";
import ImageMod from "./profileMod/ImageMod";
import { SessionUserType, UserType } from "../src/types";
import { signOut } from "next-auth/react";

interface UserSidebarProps {
  sessionUser: SessionUserType;
  user: UserType;
  mutateUser: Function;
}

function UserSidebar({ sessionUser, user, mutateUser }: UserSidebarProps) {
  const formatter = buildFormatter(frenchStrings);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const closeAccount = async () => {
    const url = `/api/admin/deactivate/${sessionUser.id}`;
    const res = await fetch(url, { method: "DELETE" });
    const resJ = await res.json();
    signOut();
  };

  const annihilateAccount = async () => {
    const url = `/api/user/${user.id}`;
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      console.log("Il y avait un erreur.");
      return;
    }
    signOut();
  };

  const deletePhoto = async () => {
    console.log("delete photo");
    const url = `/api/user/${user.id}`;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      console.log("Il y avait un erreur.");
      return;
    }
    mutateUser();
    onClose();
  };

  const [modContent, setModContent] = useState<ReactElement>();

  const initialRef = React.useRef();

  const changeProfile = (event: Event) => {
    // event.preventDefault();
    // @ts-ignore
    const targetElt = event.target.id;
    switch (targetElt) {
      case "username":
        setModContent(
          <UsernameMod
            initialRef={initialRef}
            onClose={onClose}
            populator={user.name}
            mutateUser={mutateUser}
            userId={user.id}
          />
        );
        break;
      case "email":
        setModContent(
          <EmailMod
            initialRef={initialRef}
            onClose={onClose}
            populator={user.email}
            mutateUser={mutateUser}
            userId={user.id}
          />
        );
        break;
      case "body":
        setModContent(
          <BodyMod
            initialRef={initialRef}
            onClose={onClose}
            populator={user.body}
            mutateUser={mutateUser}
            userId={user.id}
          />
        );
        break;
      case "image":
        setModContent(
          <ImageMod
            initialRef={initialRef}
            onClose={onClose}
            userId={user.id}
            mutateUser={mutateUser}
          />
        );
        break;
      default:
        setModContent(<Text>Il y avait un erreur...</Text>);
    }

    onOpen();
  };

  console.log(user);

  return user ? (
    <Box w={{ base: "100%" }} p={4}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef as any}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier votre profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modContent}</ModalBody>
        </ModalContent>
      </Modal>
      <Heading mb={4}>
        {user.name}
        {sessionUser.id === user.id ? (
          <Button
            ml={4}
            id="username"
            onClick={changeProfile as any}
            size={"xs"}
          >
            Modifier
          </Button>
        ) : null}
      </Heading>

      <Text mb={0} fontSize={"sm"}>
        active depuis <TimeAgo date={user.createdAt} formatter={formatter} />
      </Text>
      <Text mb={4} fontSize={"sm"}>
        {user.name} a écrit {user.postCount}{" "}
        {user.postCount === 1 ? "post" : "posts"} et {user.commentCount}{" "}
        {user.commentCount === 1 ? "commentaire" : "commentaires"}.
      </Text>

      <Box my={2}>
        <Flex
          mb={4}
          gap={4}
          alignItems={"center"}
          direction={{ base: "column", sm: "row" }}
        >
          <Link href={`mailto:test@test.com`}>
            <Flex mt={1} gap={2}>
              <Mail />
              <Text>dummy email</Text>
            </Flex>
          </Link>
          {sessionUser.id === user.id ? (
            <Button id="email" onClick={changeProfile as any} size={"xs"}>
              Modifier
            </Button>
          ) : null}
        </Flex>
      </Box>
      {user.body ? (
        <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
          {user.body}
        </ReactMarkdown>
      ) : null}

      {sessionUser.id === user.id ? (
        <Button mt={2} id="body" onClick={changeProfile as any} size={"xs"}>
          Modifier votre descrition
        </Button>
      ) : null}
      <Box mb={4}>
        {!user.image ? null : (
          <ChakraImage
            mt={4}
            maxW={"90%"}
            alt="Photo de l'utilisateur·rice"
            src={
              user.image
                ? user.image.includes("https://")
                  ? `${user.image}`
                  : `/api/images/${user.image}`
                : ""
            }
          />
        )}

        {sessionUser.id === user.id ? (
          <Box mt={4}>
            <Button
              mt={4}
              id="image"
              onClick={changeProfile as any}
              size={"xs"}
            >
              {"Modifier l'image"}
            </Button>

            {user.image ? (
              <Button
                mt={4}
                ml={4}
                colorScheme={"red"}
                id="image"
                onClick={deletePhoto}
                size={"xs"}
              >
                Supprimer l&apos;image
              </Button>
            ) : null}
          </Box>
        ) : null}
      </Box>

      {sessionUser.id === user.id ? (
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton mb={4} mt={8}>
              <Box mr={4}>Autres actions</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Button colorScheme={"blue"} onClick={closeAccount}>
                Dèsactiver le compte
              </Button>
            </AccordionPanel>
            <AccordionPanel>
              <Button colorScheme={"red"} onClick={annihilateAccount}>
                Supprimer le compte
              </Button>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      ) : null}
    </Box>
  ) : (
    <Spinner />
  );
}

export default UserSidebar;
