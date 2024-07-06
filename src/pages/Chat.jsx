import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { IoArrowBack, IoClose, IoSearchOutline, IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { GetData, PostData } from "../../fetchData/fetch.api";
import { BeatLoader, PuffLoader } from "react-spinners";
import { socket } from "../socketsclient";
import useAuth from "../store/auth.store";
import useMessageStore from "../store/message.store";
import NotificationSound from "../assets/noti.mp3";
function Chat() {
  const [search, setSearch] = useState("");
  const messageRef = useRef(null);
  const [message, setMessage] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [selectUserToMakeConversation, setSelectUserToMakeConversation] =
    useState(null);
  const { myInfo } = useAuth((state) => ({ myInfo: state.myInfo }));

  const {
    onlineUsers,
    createConversation,
    conversations,
    chatSelected,
    setChatSelected,
    createMessage,
    messages,
    setConversations,
    setMessages,
  } = useMessageStore((state) => ({
    createConversation: state.createConversation,
    conversations: state.conversations,
    setConversations: state.setConversations,
    chatSelected: state.chatSelected,
    messages: state.messages,
    setMessages: state.setMessages,
    createMessage: state.createMessage,
    onlineUsers: state.onlineUsers,
    setChatSelected: state.setChatSelected,
  }));
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chatloading, setChatLoading] = useState(false);
  const handleSearch = async () => {
    if (!search) {
      return toast({
        title: "Search User Error",
        description: "Please Provide Username",
        status: "error",
        position: "top-right",
        duration: 2000,
      });
    }
    setLoading(true);
    try {
      const res = await GetData("/users/search/" + search);
      setLoading(false);
      setSearchUsers(res?.data.users);
      setSearch("");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const handleClose = () => {
    setSearchUsers([]);
  };
  const handleSelectConversation = () => {
    createConversation([myInfo, selectUserToMakeConversation]);
    setSelectUserToMakeConversation(null);
    setSearchUsers([]);
  };
  const handleSend = async () => {
    setLoading(true);
    const cUserIndex = chatSelected.recipients.findIndex(
      (reci) => reci?._id?.toString() !== myInfo?._id?.toString()
    );
    try {
      const res = await PostData("/messages/create-message", {
        reciever: chatSelected.recipients[cUserIndex],
        text: message,
      });
      console.log(res.data);
      setLoading(false);
      socket.emit("message-send", res?.data?.message);
      createMessage(res?.data?.message);
      setMessage("");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    socket.on("recieve-message", (message) => {
      const audio = new Audio(NotificationSound);
      audio.play();
      createMessage(message);
    });
    return () => {
      socket.off("recieve-message");
    };
  }, []);
  useEffect(() => {
    const getAllConversations = async () => {
      try {
        const res = await GetData("/messages/conversations");
        console.log(res.data.conversations);
        setConversations(res.data.conversations);
      } catch (err) {
        console.log(err);
      }
    };
    getAllConversations();
  }, []);
  useEffect(() => {
    const getAllMessages = async () => {
      setMessages([]);
      setChatLoading(true);
      try {
        const res = await GetData("/messages/" + chatSelected?._id);
        setMessages(res.data.messages);
        setChatLoading(false);
      } catch (err) {
        setChatLoading(false);
        console.log(err);
      }
    };
    if (chatSelected?._id) {
      getAllMessages();
    }
  }, [chatSelected?._id]);
  useEffect(() => {
    messageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  return (
    <Box w="100%" h="100vh">
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem
          colSpan={{ sm: 12, md: 3 }}
          w="100%"
          h="100vh"
          bg="gray.900"
          display={{ base: !chatSelected ? "block" : "none", md: "block" }}
        >
          <Box
            w="100%"
            h="100vh"
            p="4"
            display={"flex"}
            flexDirection={"column"}
            gap="4"
          >
            <Box w="100%" position={"relative"}>
              <Button mb="4" onClick={() => navigate("/")}>
                <Icon as={IoArrowBack} h="6" w="6" />
                Back To Home
              </Button>
              <Box w="100%">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                  >
                    <IoSearchOutline />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter User"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    ml="2"
                    onClick={handleSearch}
                    isLoading={loading}
                    spinner={<BeatLoader color="white" size="6" />}
                  >
                    Search
                  </Button>
                </InputGroup>
              </Box>
              {searchUsers.length > 0 && (
                <Box
                  color={"white"}
                  width="100%"
                  h="min-content"
                  position={"absolute"}
                  top="50px"
                  zIndex={"1"}
                  left="0"
                  bgColor={"gray.700"}
                  p="4"
                  display="flex"
                  flexDirection={"column"}
                  gap="2"
                >
                  <Box
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Text fontSize="xl" ml="4" mb="2">
                      Users
                    </Text>
                    <Icon
                      onClick={handleClose}
                      as={IoClose}
                      width={"5"}
                      h="5"
                      cursor="pointer"
                      right="4"
                      mb="2"
                    />
                  </Box>

                  {searchUsers?.map((user) => {
                    return (
                      <Box
                        as="div"
                        key={user?._id}
                        display="flex"
                        gap="3"
                        alignItems="center"
                        p="2"
                        px="3"
                        onClick={() => setSelectUserToMakeConversation(user)}
                        bgColor={
                          user?._id?.toString() ===
                          selectUserToMakeConversation?._id?.toString()
                            ? "teal.600"
                            : ""
                        }
                        _hover={{
                          bgColor: "teal.600",
                          cursor: "pointer",
                        }}
                        borderRadius={"8"}
                      >
                        <Avatar size="md" src={user?.avatar?.url} />
                        <Text fontSize="md">{user?.name}</Text>
                      </Box>
                    );
                  })}
                  <Button
                    variant="purple_solid"
                    size="sm"
                    ml={"auto"}
                    onClick={handleSelectConversation}
                  >
                    Done
                  </Button>
                </Box>
              )}
            </Box>

            {conversations?.map((conversation) => {
              const cUserIndex = conversation.recipients.findIndex(
                (reci) => reci?._id?.toString() !== myInfo?._id?.toString()
              );
              const isMatch = onlineUsers?.find(
                (user) =>
                  user?.userId?.toString() ===
                  conversation?.recipients[cUserIndex]?._id?.toString()
              );
              return (
                <Box
                  as="div"
                  key={conversation?._id}
                  display="flex"
                  gap="3"
                  alignItems="center"
                  p="2"
                  px="3"
                  color={"white"}
                  cursor={"pointer"}
                  bgColor={
                    chatSelected?._id?.toString() ===
                    conversation?._id?.toString()
                      ? "teal.600"
                      : ""
                  }
                  _hover={{
                    bgColor: "teal.600",
                    cursor: "pointer",
                  }}
                  borderRadius={"8"}
                  onClick={() => setChatSelected(conversation)}
                >
                  <Avatar
                    size="md"
                    src={conversation?.recipients[cUserIndex]?.avatar?.url}
                  >
                    <AvatarBadge
                      boxSize="1em"
                      bg={isMatch ? "green.500" : "tomato"}
                      borderColor={"white"}
                      borderWidth={"2px"}
                    />
                  </Avatar>

                  <VStack alignItems={"flex-start"} spacing={"1"}>
                    <Text fontSize="md">
                      {conversation?.recipients[cUserIndex]?.name}
                    </Text>
                    <Text fontSize="sm">{conversation?.text}</Text>
                  </VStack>
                </Box>
              );
            })}
          </Box>
        </GridItem>
        <GridItem
          display={{ base: chatSelected ? "block" : "none", md: "block" }}
          colSpan={{ base: 12, md: 9 }}
          w="100%"
          h="100vh"
          bg="gray.900"
        >
          {!chatSelected ? (
            <Box
              w="100%"
              h="100%"
              display="flex"
              alignItems={"center"}
              justifyContent="center"
            >
              <Text fontSize="2xl" color="white">
                Select Chat To Chat With Your Friends
              </Text>
            </Box>
          ) : (
            <>
              <Box
                w="100%"
                h="70px"
                bg="gray.800"
                display="flex"
                gap="4"
                p="2"
                alignItems={"center"}
              >
                <Icon
                  as={IoArrowBack}
                  cursor="pointer"
                  onClick={() => setChatSelected(null)}
                  display={{ base: "block", md: "none" }}
                />
                <Avatar
                  size="md"
                  src={
                    chatSelected.recipients[
                      chatSelected.recipients.findIndex(
                        (reci) =>
                          reci?._id?.toString() !== myInfo?._id?.toString()
                      )
                    ].avatar?.url
                  }
                />
                <VStack spacing="0" alignItems={"flex-start"}>
                  <Text color={"white"}>
                    {
                      chatSelected.recipients[
                        chatSelected.recipients.findIndex(
                          (reci) =>
                            reci?._id?.toString() !== myInfo?._id?.toString()
                        )
                      ].name
                    }
                  </Text>
                </VStack>
              </Box>
              <Box
                sx={{ height: "calc(100vh - 120px)" }}
                w="100%"
                overflowY={"scroll"}
                display="flex"
                flexDir={"column"}
                gap="3"
                p="4"
              >
                {chatloading && (
                  <Box
                    w="100%"
                    h="100%"
                    textAlign={"center"}
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <PuffLoader color="#36d7b7" />
                  </Box>
                )}
                {messages?.map((message) => (
                  <Box
                    ref={messageRef}
                    key={message?._id}
                    p="2"
                    bgColor={
                      message?.sender?._id?.toString() ===
                      myInfo?._id?.toString()
                        ? "gray.600"
                        : "teal.600"
                    }
                    maxWidth={"sm"}
                    w="max-content"
                    borderRadius="8"
                    borderEndStartRadius={
                      chatSelected.recipients[
                        chatSelected.recipients.findIndex(
                          (reci) =>
                            reci?._id?.toString() !== myInfo?._id?.toString()
                        )
                      ]?._id?.toString() !== message?.reciever?._id?.toString()
                        ? "0"
                        : "4"
                    }
                    borderEndEndRadius={
                      message.sender?._id !== myInfo?._id ? 4 : 0
                    }
                    px="2"
                    alignSelf={
                      chatSelected.recipients[
                        chatSelected.recipients.findIndex(
                          (reci) =>
                            reci?._id?.toString() !== myInfo?._id?.toString()
                        )
                      ]._id.toString() === message.reciever?._id?.toString()
                        ? "flex-end"
                        : "flex-start"
                    }
                  >
                    <Text fontSize="sm" color="white">
                      {message?.text}
                    </Text>

                    <Text fontSize="x-small" color="white" textAlign={"right"}>
                      {moment(message?.createdAt).format("LT")}
                    </Text>
                  </Box>
                ))}
              </Box>
              <Box w="100%" h="50px" p="2">
                <InputGroup size="sm">
                  <InputLeftAddon>
                    <Icon as={ImAttachment} w="4" h="4" />
                  </InputLeftAddon>
                  <Input
                    placeholder="Enter Text..."
                    focusBorderColor="teal.600"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <InputRightAddon bgColor="teal" onClick={handleSend}>
                    {loading ? <Spinner size={"sm"} /> : <IoSend />}
                  </InputRightAddon>
                </InputGroup>
              </Box>
            </>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Chat;
