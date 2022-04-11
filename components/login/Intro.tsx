import { VStack, Text, SimpleGrid, GridItem } from "@chakra-ui/react";
import Image from "next/image";

const Intro = () => {
  return (
    <VStack
      w="full"
      h="full"
      p={10}
      mt={{ base: -24, sm: -12 }}
      spacing={10}
      alignItems="flex-start"
    >
      <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
        <GridItem colSpan={2} h={8}></GridItem>
        <GridItem colSpan={2} ml={{ base: "0", lg: "-20" }}>
          <Text fontSize={{ base: "xl", sm: "2xl" }}>
            Faites une pause, échangez, détendez-vous...
          </Text>
          <Text
            align={{ base: "left", md: "right" }}
            fontSize={{ base: "xl", sm: "2xl" }}
            mt={4}
          >
            Ici, c&apos;est chez vous...
          </Text>
        </GridItem>
        <GridItem mt={4} colSpan={2}>
          <Image
            alt="un(e) ouvrier(e) heureux·se, comme vous"
            src="/assets/happy-worker.jpg"
            layout="responsive"
            width="1200"
            height="800"
          ></Image>
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default Intro;
