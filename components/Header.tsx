import React, { useEffect, useState } from "react";
import { Logo } from "./Logo";
import {
  Input,
  IconButton,
  Flex,
  Box,
  Button,
  Image,
  Divider,
  Badge,
  Text,
  LinkBox,
  LinkOverlay,
  useColorModeValue
} from "@chakra-ui/react";
import { Search } from "iconoir-react";
import Menu from "./Menu";
import { PostType, TagType } from "../src/types";
import fetcher from "../src/utils/fetcher";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [postResults, setPostResults] = useState([]);
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [timer, setTimer] = useState<any>();
  const [tags, setTags] = useState<TagType[]>([]);

  const getTags = async () => {
    const ueTags = await fetcher("/api/tags");
    setTags(ueTags);
  };

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      clearTimeout(timer);
      setPostResults([]);
      return;
    }
    const searchPosts = async () => {
      clearTimeout(timer);
      const url = `/api/posts/search/${searchTerm}`;
      const res = await fetcher(url);
      res.map((post: any) => {
        const tag = tags.findIndex((tag: TagType) => tag.id === post.tagId);
        post.tagName = tags[tag].name;
      });
      setPostResults(res);
    };

    setTimer(
      setTimeout(async () => {
        searchPosts();
      }, 250)
    );
  }, [searchTerm]);

  return (
    <Flex
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      mx={{ base: 2, sm: 8 }}
      mt={{ base: 2, sm: 0 }}
    >
      <Flex alignItems={"center"} gap={{ base: 1, sm: 16 }}>
        <Logo />
        <form>
          <Flex position={"relative"} gap={1}>
            <IconButton
              colorScheme="blue"
              aria-label="Rechercher posts, tags et utilisateurs"
              icon={<Search />}
            />
            <Input
              type={"text"}
              value={searchTerm}
              // @ts-ignore
              onChange={(e: Event) => setSearchTerm(e.target.value)}
              placeholder="Rechercher"
              mr={2}
            />
            <Box position={"absolute"} mt={12} minW={"lg"} maxW={"xl"}>
              {postResults?.map((post: PostType) => (
                <Box key={post.identifier}>
                  <LinkBox
                    bg={bgColor}
                    zIndex={2}
                    opacity={"100"}
                    px={8}
                    py={4}
                    mb={2}
                    borderRadius={"lg"}
                  >
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Flex gap={2} alignItems={"center"}>
                        <Badge colorScheme={"orange"}>{post.tagName}</Badge>
                        <LinkOverlay
                          href={`/p/${post.tagName}/${post.identifier}/${post.slug}`}
                          fontSize={"lg"}
                        >
                          {post.title}
                        </LinkOverlay>
                      </Flex>
                      <Text mr={8}>{post.userName}</Text>
                    </Flex>
                    <Text noOfLines={2}>{post.body}</Text>
                    {post.image ? (
                      <Image
                        my="2"
                        alt="photo"
                        maxH={32}
                        maxW={32}
                        src={`/${post.image}`}
                      />
                    ) : null}
                  </LinkBox>
                  <Divider color={"black"} />
                </Box>
              ))}
            </Box>
          </Flex>
        </form>
      </Flex>
      <Flex alignItems={"center"} gap={8}>
        <Menu />
      </Flex>
    </Flex>
  );
};

export default Header;
