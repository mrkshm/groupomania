import React from "react";
import MetaHead from "../../components/MetaHead";
import { Container, Flex } from "@chakra-ui/react";
import Intro from "../../components/login/Intro";
import HeaderLogin from "../../components/login/HeaderLogin";
import VerificationComp from "../../components/login/VerificationComp";
import { getSession } from "next-auth/react";

function Verify() {
  return (
    <Container maxW="container.xl" p={0}>
      <MetaHead />
      <HeaderLogin />
      <Flex py={[0, 8, 0]} direction={{ base: "column", md: "row" }}>
        <VerificationComp />
        <Intro />
      </Flex>
    </Container>
  );
}

export default Verify;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }

  return {
    props: {
      session
    }
  };
}
