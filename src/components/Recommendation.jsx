import {
  Avatar,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { GetData } from "../../fetchData/fetch.api";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/auth.store";
import { socket } from "../socketsclient";
const debounceFunction = (fn, wait) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
    }, wait);
  };
};
function Recommendation() {
  const navigate = useNavigate();
  const { myInfo, clearMessage, FollowUnFollowUser } = useAuth((state) => ({
    FollowUnFollowUser: state.FollowUnFollowUser,
    clearMessage: state.clearMessage,
    myInfo: state.myInfo,
  }));
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState("");
  const handleFollow = async (user) => {
    myInfo.followings.includes(user._id)
      ? socket.emit("follow-unfollow", [user?._id, myInfo, "unfollow"])
      : socket.emit("follow-unfollow", [user?._id, myInfo, "follow"]);
    await FollowUnFollowUser(user?._id);
    clearMessage();
  };
  const getUsers = async () => {
    try {
      const res = await GetData("/users/get-users");
      setUsers(res.data.users);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  const GetSearchUser = async (e) => {
    const value = e.target.value || "all";
    if (value === "all") {
      return getUsers();
    }
    try {
      const res = await GetData("/users/search/" + value);
      setUsers(res.data?.users);
    } catch (err) {
      console.log(err);
    }
  };
  const changeAPI = useMemo(() => {
    return debounceFunction(GetSearchUser, 300);
  }, []);
  const handleChange = (e) => {
    setValue(e.target.value);
    changeAPI(e);
  };
  return (
    <Box
      w="100%"
      overflowY={"scroll"}
      h="100vh"
      display={{ base: "none", lg: "flex" }}
      p="5"
      gap="3"
      flexDir={"column"}
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <IoSearch color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search User"
          focusBorderColor="purple.300"
          variant={"filled"}
          value={value}
          onChange={handleChange}
        />
      </InputGroup>
      <Box>
        <Text fontSize="xl" mb="4">
          {" "}
          Popular Users
        </Text>
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          gap="4"
          flexWrap={"wrap"}
        >
          {users.map((user) => (
            <Box
              key={user?._id}
              sx={{ border: "1px solid #21253a" }}
              shadow="lg"
              py="4"
              px="8"
              borderRadius={"5"}
              display="flex"
              alignItems={"center"}
              flexDir={"column"}
              gap="2"
              cursor={"pointer"}
            >
              <Avatar name={user?.name} size={"md"} src={user?.avatar?.url} />
              <VStack
                spacing="0"
                onClick={() => navigate("/profile/" + user._id)}
              >
                <Text fontSize={"md"}>{user?.name}</Text>
                <Text fontSize="sm" color="purple.200">
                  @{user?.username}
                </Text>
              </VStack>
              <Button
                variant="purple_solid"
                size="sm"
                onClick={() => handleFollow(user)}
              >
                {myInfo.followings.includes(user._id) ? "unfollow" : "follow"}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Recommendation;
