import {
  Avatar,
  AvatarBadge,
  Box,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import useAuth from "../store/auth.store";
import moment from "moment";

function Notifications() {
  const { colorMode } = useColorMode();
  const { notifications, makeAsRead } = useAuth((state) => ({
    notifications: state.notifications,
    makeAsRead: state.makeAsRead,
  }));
  return (
    <Box
      m="10"
      display={"flex"}
      flexDirection={"column"}
      width={{ base: "95%", md: "60%", lg: "50%" }}
      bgColor={colorMode === "light" ? "gray.50" : "gray.700"}
      marginLeft={"auto"}
      marginRight={"auto"}
      borderRadius={"10"}
    >
      <Box
        p="4"
        display="flex"
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Text fontSize={"2xl"}>Notifications</Text>
        <Text fontSize={"sm"} cursor={"pointer"} onClick={() => makeAsRead()}>
          Mark all as read
        </Text>
      </Box>

      <VStack spacing="4" alignItems={"flex-start"} p="5">
        {notifications?.length === 0 && (
          <Text fontSize={"lg"} textAlign={"center"}>
            No Notification
          </Text>
        )}
        {notifications?.map((noti) => {
          return (
            <Box
              key={noti}
              bgColor={"gray.800"}
              display={"flex"}
              alignItems={"center"}
              gap="4"
              p="3"
              borderRadius={"4"}
              w="100%"
            >
              <Avatar size="sm">
                <AvatarBadge boxSize="1em" bg="green.500" />
              </Avatar>

              <VStack alignItems={"flex-start"} spacing="0">
                <Text>{noti}</Text>
                <Text fontSize={"small"}>{moment(new Date()).fromNow()}</Text>
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

export default Notifications;
