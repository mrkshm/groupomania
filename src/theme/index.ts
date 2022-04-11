import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        color: "#346beb"
      }
    },
    Button: {
      baseStyle: {}
    }
  }
});

export default theme;
