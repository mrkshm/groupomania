import { Heading, Text, Container } from "@chakra-ui/react";

const LoginComp = () => {
  return (
    <Container maxW="70%" centerContent>
      <Heading textAlign={"center"} mt={44} as="h1">
        Bienvenue chez Groupomania
      </Heading>
      <Text my={8} maxW={{ base: "100%", sm: "70%" }}>
        Un email avec un lien pour vous connecter vous a été envoyé. Si vous
        n&apos;avez rien réçu, veuillez regarder dans votre dossier Spam. Sinon,
        veuillez contacter l&apos;administrateur.
      </Text>
    </Container>
  );
};

export default LoginComp;
