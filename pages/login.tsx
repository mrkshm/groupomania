import React from "react";
import MetaHead from "../components/MetaHead";
import { Container, Flex } from "@chakra-ui/react";
import Intro from "../components/login/Intro";
import HeaderLogin from "../components/login/HeaderLogin";
import LoginComp from "../components/login/LoginComp";
import {
  signIn,
  getProviders,
  getCsrfToken,
  getSession
} from "next-auth/react";

function Login({ providers, csrfToken }: any) {
  return (
    <Container maxW="container.xl" p={0}>
      <MetaHead />
      <HeaderLogin />
      <Flex py={[0, 8, 0]} direction={{ base: "column", md: "row" }}>
        <LoginComp
          providers={providers}
          csrfToken={csrfToken}
          signIn={signIn}
        />
        <Intro />
      </Flex>
    </Container>
  );
}

export default Login;

Login.getInitialProps = async (context: any) => {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session) {
    res.writeHead(302, {
      Location: "/"
    });
    res.end();
    return;
  }

  return {
    session: undefined,
    providers: await getProviders(),
    csrfToken: await getCsrfToken(context)
  };
};
