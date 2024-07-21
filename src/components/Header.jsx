import {
  Avatar,
  Badge,
  Box,
  Button,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import Logo from "../assets/logo.png";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import useAuth from "../store/auth.store";
import { useNavigate } from "react-router-dom";
function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { myInfo, logoutUser, notifications } = useAuth((state) => ({
    myInfo: state.myInfo,
    logoutUser: state.logoutUser,
    notifications: state.notifications,
  }));

  const handleLogout = async () => {
    await logoutUser();
    navigate("/auth/login", { replace: true });
  };
  return (
    <Box
      w="100%"
      h="60px"
      bg={colorMode === "dark" ? "gray.900" : "white"}
      sx={colorMode === "light" && { borderBottom: "1px solid #EDF2F7" }}
      display={{ base: "flex", lg: "none" }}
      alignItems={"center"}
      px={{ base: 3, md: 10 }}
      justifyContent={"space-between"}
    >
      <Image
        src={Logo}
        w={{ base: "40px", md: "50px" }}
        h={{ base: "40px", md: "50px" }}
        borderRadius={"50%"}
        objectFit={"cover"}
      />
      <Box
        display={"flex"}
        gap={{ base: 3, sm: 6, md: 10 }}
        alignItems={"center"}
      >
        <Box position={"relative"} w="8" h="8">
          <Icon
            as={IoMdNotificationsOutline}
            w="8"
            h="8"
            cursor={"pointer"}
            color={"purple.500"}
          />
          <Badge
            position={"absolute"}
            top="0.6"
            right="-0.4"
            borderRadius={"50%"}
            w="15px"
            h="15px"
            bgColor={"purple.500"}
            color="white"
            display="flex"
            alignItems={"center"}
            justifyContent={"center"}
            fontSize={"10px"}
          >
            {notifications?.length}
          </Badge>
        </Box>
        <Menu>
          <MenuButton as={Button} rightIcon={<IoChevronDownOutline />}>
            <Avatar size="sm" mr="1" src={myInfo?.avatar?.url} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate(`/profile/${myInfo?._id}`)}>
              Profile
            </MenuItem>
            <MenuItem onClick={toggleColorMode}>
              {colorMode === "light" ? "Dark Mode" : "Light Mode"}
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
}

export default Header;
