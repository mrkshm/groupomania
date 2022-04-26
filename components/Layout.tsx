import { Box, Container } from "@chakra-ui/layout";
import Header from "./Header";
import MetaHead from "./MetaHead";

const Layout = ({ children }: any) => {
  return (
    <Container maxW={"container.xl"}>
      <Box>
        <MetaHead />
        <Header />
      </Box>
      <Box m={"auto"}>{children}</Box>
    </Container>
  );
};

export default Layout;
