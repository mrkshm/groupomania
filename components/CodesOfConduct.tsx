import React from "react";
import { Flex, Box, Heading, List, ListItem, ListIcon } from "@chakra-ui/react";
import { CheckCircledOutline } from "iconoir-react";

const cOfC = [
  "Souvenez vous d'être humain.",
  "Comportez-vous comme vous le feriez dans la vraie vie (ou mieux).",
  "Si vous partagez quelque chose, citez la source originale, si possible.",
  "Cherchez des doublons potentiels avant de publier.",
  "Profitez !"
];

function CodesOfConduct() {
  return (
    <Box mx={16} mt={32}>
      <Heading size={"md"} my={8}>
        Quelques astuces
      </Heading>
      <List spacing={3}>
        {cOfC.map(code => (
          <ListItem key={code}>
            <Flex alignItems={"center"} gap={2}>
              <ListIcon
                color={"green.500"}
                fontSize={24}
                as={CheckCircledOutline}
              />
              {code}
            </Flex>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CodesOfConduct;
