import * as React from "react";
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";
import { LightBulb, HalfMoon } from "iconoir-react";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(HalfMoon, LightBulb);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      width={8}
      mr={4}
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Basculer en mode ${text}`}
      {...props}
    />
  );
};
