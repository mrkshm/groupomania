import React from "react";
import { useRouter } from "next/router";
import {
  Menu as ChakraMenu,
  MenuButton,
  useColorModeValue,
  useColorMode,
  IconButton,
  MenuItem,
  MenuList,
  Text,
  Flex
} from "@chakra-ui/react";

import {
  User,
  Menu as MenuIcon,
  Group,
  LogOut,
  LightBulb,
  HalfMoon,
  Home
} from "iconoir-react";
import { signOut } from "next-auth/react";

function Menu() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };
  const goToUserlist = () => {
    router.push("/u");
  };
  const goToProfile = () => {
    router.push("/profile");
  };

  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(HalfMoon, LightBulb);

  const MENUITEMS = [
    { name: "Home", function: goHome, icon: <Home /> },
    { name: "Profil", function: goToProfile, icon: <User /> },
    { name: "Annuaire", function: goToUserlist, icon: <Group /> },
    { name: "Mode sombre", function: toggleColorMode, icon: <SwitchIcon /> },
    { name: "Déconnexion", function: signOut, icon: <LogOut /> }
  ];

  return (
    <div>
      <ChakraMenu>
        <MenuButton
          as={IconButton}
          aria-label="Menu"
          variant="outline"
          icon={<MenuIcon />}
        />

        <MenuList>
          {MENUITEMS.map(item => (
            <MenuItem onClick={item.function as any} key={item.name}>
              <Flex gap={4} mb={2}>
                {item.icon}
                <Text>{item.name}</Text>
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </ChakraMenu>
    </div>
  );
}

export default Menu;
