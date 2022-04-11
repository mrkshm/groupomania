import React from "react";
import { Container, Flex } from "@chakra-ui/react";
import Intro from "../../components/login/Intro";
import HeaderLogin from "../../components/login/HeaderLogin";
import MetaHead from "../../components/MetaHead";
import OnboardingForm from "../../components/login/OnboardingForm";
import { getSession } from "next-auth/react";

function Onboarding({ sessionUser }: any) {
  return (
    <Container maxW="container.xl" p={0}>
      <MetaHead />
      <HeaderLogin />
      <Flex py={[0, 8, 0]} direction={{ base: "column", md: "row" }}>
        <OnboardingForm />
        <Intro />
      </Flex>
    </Container>
  );
}

export default Onboarding;

Onboarding.getInitialProps = async (context: any) => {
  const { req, res } = context;
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, {
      Location: "/login"
    });
    res.end();
    return;
  }

  console.log("session is", session);
  const sessionUser = session.user;

  if (session && session.user && session.user.name) {
    res.writeHead(302, {
      Location: "/"
    });
    res.end();
    return;
  }

  return {
    sessionUser
  };
};
