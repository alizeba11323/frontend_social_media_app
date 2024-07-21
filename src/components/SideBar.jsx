import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";

import {
  IoHomeOutline,
  IoChatbubblesOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoChatbubblesSharp,
  IoSunnyOutline,
  IoMoonOutline,
} from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import useAuth from "../store/auth.store";
import { useLocation, useNavigate } from "react-router-dom";
function SideBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const { myInfo, logoutUser, notifications } = useAuth((state) => ({
    myInfo: state.myInfo,
    notifications: state.notifications,
    logoutUser: state.logoutUser,
  }));
  const handleLogout = async () => {
    await logoutUser();
    navigate("/auth/login", { replace: true });
  };
  return (
    <Box
      display={{ base: "none", lg: "flex" }}
      width="100%"
      height="100vh"
      bgColor={colorMode === "dark" ? "gray.900" : "white"}
      p={2}
      boxShadow={"md"}
      flexDir={"column"}
    >
      <Box
        display="flex"
        flexDir={"column"}
        alignItems={"center"}
        gap="1"
        mb={4}
      >
        <Icon as={IoChatbubblesSharp} color="purple.300" w="10" h="10" />
        <Text color="purple.300" fontSize={"xl"}>
          INSTACHAT
        </Text>
      </Box>
      <Flex flexDir={"column"} gap="1">
        <Box display={"flex"} alignItems={"center"} gap="3" mb="4" ml="2">
          <Avatar size={"md"} name={myInfo.name} src={myInfo?.avatar?.url} />
          <VStack spacing={1} alignItems={"flex-start"}>
            <Text fontSize={"md"} size={"md"}>
              {myInfo?.name}
            </Text>
            <Text fontSize={"xs"} color={"purple.200"}>
              @{myInfo?.username}
            </Text>
          </VStack>
          <Box flex="1"></Box>
          <Button
            size={"xs"}
            variant="outline"
            cursor={"pointer"}
            onClick={toggleColorMode}
          >
            {colorMode === "light" ? <IoMoonOutline /> : <IoSunnyOutline />}
          </Button>
        </Box>
        <Box
          onClick={() => navigate(`/`)}
          cursor="pointer"
          display="flex"
          alignItems={"center"}
          gap="4"
          color="purple.300"
          p={3}
          borderRadius={"8"}
          sx={
            location.pathname === "/"
              ? { bgColor: "purple.500", color: "white" }
              : {}
          }
          _hover={{ bgColor: "purple.500", color: "white" }}
        >
          <Icon as={IoHomeOutline} h={6} w={6} />
          Home
        </Box>
        <Box
          onClick={() => navigate(`/chat`)}
          display="flex"
          alignItems={"center"}
          cursor="pointer"
          gap="4"
          sx={
            location.pathname === "/chat"
              ? { bgColor: "purple.500", color: "white" }
              : {}
          }
          color="purple.300"
          p={3}
          borderRadius={"8"}
          _hover={{ bgColor: "purple.500", color: "white" }}
        >
          <Icon as={IoChatbubblesOutline} h={6} w={6} />
          Chat
        </Box>
        <Box
          onClick={() => navigate(`/explore`)}
          display="flex"
          alignItems={"center"}
          cursor="pointer"
          gap="4"
          color="purple.300"
          p={3}
          borderRadius={"8"}
          sx={
            location.pathname === "/explore"
              ? { bgColor: "purple.500", color: "white" }
              : {}
          }
          _hover={{ bgColor: "purple.500", color: "white" }}
        >
          <Icon as={MdOutlineExplore} h={6} w={6} />
          Explore
        </Box>
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"space-between"}
          cursor="pointer"
          color="purple.300"
          onClick={() => navigate(`/notifications`)}
          p={3}
          sx={
            location.pathname === "/notifications"
              ? { bgColor: "purple.500", color: "white" }
              : {}
          }
          borderRadius={"8"}
          _hover={{ bgColor: "purple.500", color: "white" }}
        >
          <Box display="flex" gap="4">
            <Icon as={IoNotificationsOutline} h={6} w={6} />
            Notification
          </Box>
          <Box
            fontSize="12px"
            bgColor="purple.700"
            color="white"
            borderRadius="6"
            w="20px"
            h="20px"
            display="flex"
            alignItems={"center"}
            justifyContent={"center"}
          >
            {notifications?.length}
          </Box>
        </Box>
      </Flex>
      <Box flex="1"></Box>
      <Box>
        <Box
          onClick={handleLogout}
          display="flex"
          alignItems={"center"}
          gap="4"
          color="purple.300"
          p={3}
          borderRadius={"8"}
          _hover={{ bgColor: "purple.500", color: "white" }}
        >
          <Icon as={IoLogOutOutline} h={6} w={6} />
          Logout
        </Box>
        <Box position="relative" width="100%">
          <Box
            cursor="pointer"
            onClick={() => navigate(`/profile/${myInfo._id}`)}
            display="flex"
            alignItems={"center"}
            gap="4"
            color="purple.300"
            sx={
              location.pathname.indexOf("profile") !== -1
                ? { bgColor: "purple.500", color: "white" }
                : {}
            }
            p={3}
            borderRadius={"8"}
            _hover={{ bgColor: "purple.500", color: "white" }}
          >
            <Icon as={IoSettingsOutline} h={6} w={6} />
            Profile
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SideBar;
