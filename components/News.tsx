import React from "react";
import { Heading, Box, Tooltip, Link, Text } from "@chakra-ui/react";
import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

function News({ articles }: any) {
  const formatter = buildFormatter(frenchStrings);
  return (
    <div>
      <Heading size="lg" mb={6}>
        <Tooltip
          label={
            "Voici peut-être des communiqués de Groupomania ? En attendant les nouvelles du jour."
          }
        >
          Quelques nouvelles
        </Tooltip>
      </Heading>
      {articles.articles.slice(0, 5).map((article: any) => (
        <Box mb={2} key={article.url}>
          <Tooltip label={article.title}>
            <Link href={article.url} isExternal>
              <Text isTruncated>{article.title}</Text>
            </Link>
          </Tooltip>
          <Text fontSize="sm">
            <TimeAgo date={article.publishedAt} formatter={formatter} />
          </Text>
        </Box>
      ))}
    </div>
  );
}

export default News;
