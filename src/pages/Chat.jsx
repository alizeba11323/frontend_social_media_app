import {
  Avatar,
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
} from "@chakra-ui/react";
import moment from "moment";
import { IoSearchOutline, IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { useEffect, useRef, useState } from "react";
import { GetData, PostData } from "../../fetchData/fetch.api";
import useAuth from "../store/auth.store";
import useMessageStore from "../store/message.store";
import { socket } from "../socketsclient";

function Chat() {
  const [searchUser, setSearchUser] = useState("");
  const [users, setUsers] = useState([]);
  const messageRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const { messages, createMessage, getAllMessages } = useMessageStore(
    (state) => ({
      messages: state.messages,
      createMessage: state.createMessage,
      getAllMessages: state.getAllMessages,
    })
  );
  const { myInfo, chatUsers, setChatUser, setConversationToChatUser } = useAuth(
    (state) => ({
      chatUsers: state.chatUsers,
      setChatUser: state.setChatUser,
      setConversationToChatUser: state.setConversationToChatUser,
      myInfo: state.myInfo,
    })
  );
  const handleSearch = async () => {
    try {
      const res = await GetData("/users/search/" + searchUser);
      setUsers(res.data?.users);
      setSearchUser("");
    } catch (err) {
      console.log(err);
    }
  };
  const getMessages = async (conversationId) => {
    try {
      const res = await GetData("/messages/" + conversationId);
      getAllMessages(conversationId, res?.data?.messages);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    socket.on("recieve-message", (message) => {
      createMessage(message);
    });
    return () => {
      socket.off("recieve-message");
    };
  }, []);
  useEffect(() => {
    if (selectedChatUser?.conversation) {
      getMessages(selectedChatUser.conversation._id);
    }
  }, [selectedChatUser]);
  const handleAddMessage = async () => {
    setLoading(true);
    try {
      const res = await PostData("/messages/create-message", {
        reciever: selectedChatUser._id,
        text: message,
      });
      createMessage(res?.data?.message);
      setConversationToChatUser(
        selectedChatUser?._id,
        res?.data?.message?.conversation
      );
      setMessage("");
      setLoading(false);
      messageRef.current.scrollIntoView({ behavior: "smooth" });
      socket.emit("message-send", res?.data?.message);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const showMessages = messages?.find(
    (msg) => msg[selectedChatUser?.conversation?._id]
  );
  console.log(showMessages);
  return (
    <Box w="100%" h="100vh">
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem
          display={{ base: "none", md: "block" }}
          colSpan={{ md: 3 }}
          w="100%"
          h="100vh"
          bg="gray.900"
        >
          <Box
            w="100%"
            h="100%"
            p="4"
            display={"flex"}
            flexDirection={"column"}
            gap="4"
          >
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
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <Button ml="2" onClick={handleSearch}>
                Search
              </Button>
            </InputGroup>
            {chatUsers?.map((user) => {
              return (
                <Box
                  onClick={() => {
                    setSelectedChatUser(user);
                  }}
                  as="div"
                  key={user?._id}
                  display="flex"
                  gap="3"
                  alignItems="center"
                  p="2"
                  px="3"
                  bgColor={
                    selectedChatUser?._id.toString() ===
                      user?._id?.toString() && "teal.600"
                  }
                  _hover={{
                    bgColor: "teal.600",
                    cursor: "pointer",
                  }}
                  borderRadius={"8"}
                >
                  <Avatar size="md" src={user?.avatar?.url} />
                  <VStack spacing={"0"} alignItems="flex-start">
                    <Text fontSize="md">{user?.name}</Text>
                    <Text fontSize="sm">{user?.conversation?.text}</Text>
                  </VStack>
                </Box>
              );
            })}
            {users?.map((user) => {
              return (
                <Box
                  onClick={() => {
                    setChatUser(user);
                    setUsers([]);
                  }}
                  as="div"
                  key={user?._id}
                  display="flex"
                  gap="3"
                  alignItems="center"
                  p="2"
                  px="3"
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
          </Box>
        </GridItem>
        <GridItem
          colSpan={{ base: 12, md: 9 }}
          w="100%"
          h="100vh"
          bg="gray.900"
        >
          {!selectedChatUser ? (
            <Box
              w="100%"
              h="100%"
              display="flex"
              alignItems={"center"}
              justifyContent="center"
            >
              <Text fontSize="2xl">Select Chat To Chat With Your Friends</Text>
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
                <Avatar size="md" src={selectedChatUser?.avatar?.url} />
                <VStack spacing="0" alignItems={"flex-start"}>
                  <Text>{selectedChatUser?.name}</Text>
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
                {messages?.length > 0 &&
                  showMessages?.[selectedChatUser?.conversation?._id]?.map(
                    (message) => (
                      <Box
                        key={message?._id}
                        p="2"
                        bgColor={
                          message?.sender?._id === myInfo?._id?.toString()
                            ? "gray.600"
                            : "teal.600"
                        }
                        maxWidth={"sm"}
                        w="max-content"
                        borderRadius="8"
                        borderEndStartRadius={
                          message?.reciever?._id ===
                          selectedChatUser._id?.toString()
                            ? "4"
                            : "0"
                        }
                        borderEndEndRadius={
                          message?.sender?._id !== myInfo?._id?.toString()
                            ? "4"
                            : "0"
                        }
                        px="2"
                        alignSelf={
                          message?.sender?._id === myInfo?._id?.toString()
                            ? "flex-end"
                            : "flex-start"
                        }
                      >
                        <>{message?.text}</>

                        <Text
                          ref={messageRef}
                          fontSize="x-small"
                          color="white"
                          textAlign={"right"}
                        >
                          {moment(message?.createdAt).fromNow()}
                        </Text>
                      </Box>
                    )
                  )}
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
                  <InputRightAddon bgColor="teal" onClick={handleAddMessage}>
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
