import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../src/theme";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        {/* @ts-ignore */}
        {Component.authPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
