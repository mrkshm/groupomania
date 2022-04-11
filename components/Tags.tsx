import React from "react";
import { TagCloud } from "react-tagcloud";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import useSWR from "swr";
import fetcher from "../src/utils/fetcher";
import { useRouter } from "next/router";
import { TagType } from "../src/types";
import { Tag } from ".prisma/client";

const swrUrl = `../api/tags`;

function Tags() {
  const router = useRouter();

  // getting Tags from DB and putting them into an array TagCloud can understand
  const { data, error } = useSWR(swrUrl, fetcher);
  if (error) {
    console.log(error);
  }

  let tagData: Array<{
    value: string;
    id: number;
    count: number;
  }> = [];

  if (data) {
    data.map((tag: TagType) => {
      tagData.push({
        value: tag.name,
        id: tag.id,
        count: Number(tag._count.posts)
      });
    });
  }

  interface TagObject {
    value: string;
    count: number;
    id: number;
  }
  const luminosity = useColorModeValue("dark", "light");
  const options = {
    luminosity: luminosity,
    hue: "blue"
  };
  const bgColor = useColorModeValue("blue.50", "");
  return (
    <Box
      cursor={"pointer"}
      p={{ base: 0, sm: 8 }}
      borderRadius={"lg"}
      bg={bgColor}
      my={{ base: 0, sm: 24 }}
    >
      <Heading mb={8}>Tags</Heading>
      <TagCloud
        minSize={12}
        maxSize={35}
        tags={tagData}
        colorOptions={options}
        // TODO tag page
        onClick={(tag: TagObject) => router.push(`/p/${tag.value}`)}
      />
    </Box>
  );
}

export default Tags;
