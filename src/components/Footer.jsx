import { Box, Icon } from "@chakra-ui/react";
import {
  IoHomeOutline,
  IoChatbubblesOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function Footer() {
  const navigate = useNavigate();
  return (
    <Box
      display={{ base: "flex", lg: "none" }}
      alignItems={"center"}
      justifyContent={"space-between"}
      px={3}
      position={"fixed"}
      bottom={0}
      left={0}
      width="100%"
      h="80px"
    >
      <Box
        bgColor={"purple.500"}
        color="white"
        px="3"
        py="2"
        borderRadius={"8"}
        _hover={{ bgColor: "purple.700" }}
        onClick={() => navigate("/")}
        cursor={"pointer"}
      >
        <Icon as={IoHomeOutline} h={6} w={6} />
      </Box>
      <Box
        bgColor={"purple.500"}
        color="white"
        px="3"
        py="2"
        borderRadius={"8"}
        _hover={{ bgColor: "purple.700" }}
        onClick={() => navigate("/chat")}
        cursor={"pointer"}
      >
        <Icon as={IoChatbubblesOutline} h={6} w={6} />
      </Box>
      <Box
        bgColor={"purple.500"}
        color="white"
        px="3"
        py="2"
        borderRadius={"8"}
        _hover={{ bgColor: "purple.700" }}
        onClick={() => navigate("/notifications")}
        cursor={"pointer"}
      >
        <Icon as={IoPeopleOutline} h={6} w={6} />
      </Box>
      <Box
        bgColor={"purple.500"}
        color="white"
        px="3"
        py="2"
        borderRadius={"8"}
        _hover={{ bgColor: "purple.700" }}
        onClick={() => navigate("/explore")}
        cursor={"pointer"}
      >
        <Icon as={MdOutlineExplore} h={6} w={6} />
      </Box>
    </Box>
  );
}

export default Footer;
