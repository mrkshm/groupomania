import {
  FormControl,
  FormLabel,
  Input,
  Link,
  VStack,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  useDisclosure,
  Button,
  Container,
  Box,
  Stack,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react";
import CommentFaire from "./CommentFaire";

const LoginComp = ({ providers, csrfToken, signIn }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW="70%" centerContent>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Conditions d&apos;utilisation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Voici un jour les conditions d&apos;utilisation du service. En
            attendant un peu de lorem ipsum: Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Heading textAlign={"center"} mt={{ base: 4, sm: 40 }} as="h1">
        Bienvenue chez Groupomania
      </Heading>
      <Text mt={8} mb={4} maxW={{ base: "100%", sm: "70%" }}>
        Vous pouvez vous inscrire (ou, si vous avez déjà un compte, vous
        connecter) avec seulement votre adresse email, ou avec votre compte
        GitHub ou Google. C&apos;est à vous !{" "}
      </Text>
      <CommentFaire />
      <Box marginTop={12}>
        <Box
          alignContent="center"
          justifyContent="center"
          className="email-form"
        >
          <form method="post" action="/api/auth/signin/email">
            <Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <FormControl>
              <FormLabel>
                Votre Email
                <Input type="email" id="email" name="email" />
              </FormLabel>
            </FormControl>
            <Button colorScheme={"blue"} type="submit">
              Connexion avec Email
            </Button>
          </form>
        </Box>
        <Stack marginTop={12}>
          {Object.values(providers).map((provider: any) => {
            if (provider.name === "Email") {
              return;
            }

            return (
              <Box key={provider.name}>
                <Button variant="outline" onClick={() => signIn(provider.id)}>
                  Connexion avec {provider.name}
                </Button>
              </Box>
            );
          })}
        </Stack>
        <Text fontSize="xs" my={8}>
          En cliquant sur &quot;Connexion&quot;, vous acceptez les{" "}
          <Link onClick={onOpen}>CGU</Link> de Groupomania.
          <br />
          Nous gardons vos données strictement confidentielles.
        </Text>
      </Box>
    </Container>
  );
};

export default LoginComp;
