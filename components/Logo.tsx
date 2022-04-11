import * as React from "react";
import {
  chakra,
  keyframes,
  ImageProps,
  forwardRef,
  useColorModeValue,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import Link from "next/link";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Logo = forwardRef<ImageProps, "img">((props, ref) => {
  const logo = useColorModeValue(
    "/assets/GroupomaniaLogoBright.png",
    "/assets/GroupomaniaLogoDark.png"
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 70s linear`;

  return (
    <Link href={"/"} passHref>
      <chakra.img
        cursor={"pointer"}
        animation={animation}
        src={logo}
        ref={ref}
        w={{ base: 16, md: 32 }}
        h={{ base: 16, md: 32 }}
        mt={{ base: 0, md: 0 }}
        {...props}
      />
    </Link>
  );
});
