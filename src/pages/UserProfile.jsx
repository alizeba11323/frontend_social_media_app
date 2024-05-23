import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  IoBookmarkOutline,
  IoBookmarkSharp,
  IoCreateOutline,
  IoHeartOutline,
  IoImageOutline,
} from "react-icons/io5";
import CustomModel from "../components/CustomModel";
import useAuth from "../store/auth.store";
import { GetData } from "../../fetchData/fetch.api";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import usePost from "../store/post.store";
function UserProfile() {
  const { id } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [selectedButton, setSelecedButton] = useState("posts");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(null);
  const { posts } = usePost((state) => ({ posts: state.posts }));
  useEffect(() => {
    const allPostsByUser = posts.filter(
      (post) => post.creator._id.toString() === id.toString()
    );
    setUserPosts(allPostsByUser);
  }, [id]);
  const {
    myInfo,
    updateProfile,
    loadingUser,
    FollowUnFollowUser,
    clearMessage,
  } = useAuth((state) => ({
    myInfo: state.myInfo,
    updateProfile: state.updateProfile,
    loadingUser: state.loading,
    FollowUnFollowUser: state.FollowUnFollowUser,
    clearMessage: state.clearMessage,
  }));
  const [data, setData] = useState({
    bio: myInfo.bio || "",
    address: myInfo.address || "",
    avatar: null,
  });
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const imgRef = useRef();
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetch, setIsFetch] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await GetData("/users/single-user/" + id);
        console.log(res);
        setUser(res?.data.user);
      } catch (Err) {
        console.log(Err);
      }
    };
    getUser();
  }, [id, fetch]);
  const uploadImg = () => {
    imgRef.current.click();
  };
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleChangeImage = (e) => {
    setLoading(true);
    const file = e.target.files[0];
    setData((prev) => ({ ...prev, avatar: file }));
    const reader = new FileReader();
    reader.onload = function () {
      setTimeout(() => {
        setLoading(false);
        setSrc(reader.result);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", myInfo.name);
    formData.append("username", myInfo.username);
    formData.append("email", myInfo.email);
    formData.append("bio", data.bio);
    formData.append("address", data.address);
    if (data.avatar) {
      formData.append("avatar", data.avatar, data.avatar.name);
    }

    await updateProfile(formData);
    setIsFetch((prev) => !prev);
  };
  const handleSelectButton = (type) => {
    setSelecedButton(type);
  };

  const handleFollowUnFollow = async (id) => {
    await FollowUnFollowUser(id);
    clearMessage();
  };
  return (
    <>
      <Box
        pt="10"
        pl={{ base: "5", lg: "16" }}
        h="100vh"
        overflowY="scroll"
        pb="4"
      >
        <Box display="flex">
          <Box flex="2" display="flex" alignItems={"center"} gap="8">
            <Avatar size={"xl"} src={user?.avatar?.url} />
            <VStack spacing="3" alignItems={"flex-start"}>
              <VStack spacing={"0"} alignItems={"flex-start"}>
                <Text fontSize={{ base: "md", lg: "lg" }}>{user?.name}</Text>
                <Text fontSize={{ base: "sm", lg: "lg" }}>
                  @{user?.username}
                </Text>
              </VStack>
              <VStack alignItems={"flex-start"}>
                <Text fontSize={{ base: "sm", lg: "md" }}>{user?.bio}</Text>
                <Box
                  display="flex"
                  alignItems={"center"}
                  gap={{ base: "4", lg: "8" }}
                >
                  <Text cursor={"pointer"} textAlign={"center"} fontSize="sm">
                    <Box as="span" color="purple.400">
                      {userPosts?.length}
                    </Box>{" "}
                    Post
                  </Text>
                  <Text cursor={"pointer"} textAlign={"center"} fontSize="sm">
                    <Box as="span" color="purple.400">
                      {user?.followers?.length}
                    </Box>{" "}
                    Followers
                  </Text>
                  <Text cursor={"pointer"} textAlign={"center"} fontSize="sm">
                    <Box as="span" color="purple.400">
                      {user?.followings?.length}
                    </Box>{" "}
                    Following
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </Box>
          <Box flex="1">
            {myInfo?._id?.toString() === user?._id?.toString() ? (
              <Button
                display="flex"
                gap="2"
                onClick={onOpen}
                variant="purple_solid"
              >
                <Icon as={IoCreateOutline} h="5" w="5" />
                <Text fontSize="sm">Edit Profile</Text>
              </Button>
            ) : (
              <Button
                isLoading={loadingUser}
                spinner={<BeatLoader size={8} color="white" />}
                variant="purple_solid"
                onClick={() => {
                  handleFollowUnFollow(user?._id);
                }}
              >
                <Text>
                  {myInfo.followings.includes(user?._id)
                    ? "Unfollow"
                    : "Follow"}
                </Text>
              </Button>
            )}
          </Box>
        </Box>
        <Box display={"flex"} alignItems={"center"} mt="10" ml="4">
          <Box
            onClick={() => handleSelectButton("posts")}
            display="flex"
            alignItems={"center"}
            gap="2"
            py="3"
            px="10"
            bg={selectedButton === "posts" ? "purple.700" : "gray.900"}
            borderRadius="8"
            borderEndRadius={"0"}
            _hover={{
              backgroundColor: "purple.700",
              cursor: "pointer",
            }}
          >
            <Icon as={IoImageOutline} w="6" h="6" />
            Posts
          </Box>
          <Box
            onClick={() => handleSelectButton("liked_posts")}
            display="flex"
            alignItems={"center"}
            gap="2"
            py="3"
            px="10"
            bg={selectedButton === "liked_posts" ? "purple.700" : "gray.900"}
            borderRadius={"8"}
            borderStartRadius={"0"}
            _hover={{
              backgroundColor: "purple.700",
              cursor: "pointer",
            }}
          >
            <Icon as={IoHeartOutline} w="6" h="6" />
            Liked Post
          </Box>
        </Box>
        <Box
          display="flex"
          flexWrap={"wrap"}
          alignItems={"center"}
          gap="4"
          mt="10"
          p="2"
        >
          {selectedButton === "liked_posts"
            ? user?.savedPost?.map((sPost) => (
                <Box
                  key={sPost._id}
                  borderRadius={16}
                  overflow={"hidden"}
                  position="relative"
                >
                  <Image
                    src={sPost?.image?.url}
                    objectFit={"cover"}
                    w="250px"
                    h="250px"
                  />
                  <Box
                    w="100%"
                    position={"absolute"}
                    bottom="0"
                    left="0"
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    p="4"
                  >
                    <HStack spacing="1">
                      <Icon as={IoHeartOutline} w="5" h="5" />
                      <Text fontSize={"sm"}>{sPost?.likes?.length}</Text>
                    </HStack>
                    <Icon as={IoBookmarkSharp} w="5" h="5" />
                  </Box>
                </Box>
              ))
            : userPosts.map((post) => (
                <Box
                  key={post._id}
                  borderRadius={16}
                  overflow={"hidden"}
                  position="relative"
                >
                  <Image
                    w="250px"
                    h="250px"
                    src={post?.image?.url}
                    objectFit={"cover"}
                  />
                  <Box
                    w="100%"
                    position={"absolute"}
                    bottom="0"
                    left="0"
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    p="4"
                  >
                    <HStack spacing="1">
                      <Icon as={IoHeartOutline} w="5" h="5" color="gray.100" />
                      <Text fontSize={"sm"}>{post.likes?.length}</Text>
                    </HStack>
                    <Icon as={IoBookmarkOutline} w="5" h="5" color="gray.100" />
                  </Box>
                </Box>
              ))}
        </Box>
      </Box>
      <CustomModel
        handleSave={handleSave}
        initialRef={initialRef}
        finalRef={finalRef}
        onClose={onClose}
        isOpen={isOpen}
        loading={loadingUser}
        title="Edit Profile"
      >
        <Flex alignItems={"center"} gap="6">
          <Box flex="1" display={"flex"} justifyContent={"center"}>
            <Avatar
              size="xl"
              name="Prosper Otemuyiwa"
              src={src ? src : myInfo?.avatar?.url}
            />
          </Box>
          <Box flex="1">
            <Input
              type="file"
              display={"none"}
              ref={imgRef}
              onChange={handleChangeImage}
            />
            <Button
              size="md"
              flex="1"
              colorScheme="gray"
              isLoading={loading}
              borderRadius={2}
              onClick={uploadImg}
            >
              Edit Image
            </Button>
          </Box>
        </Flex>
        <HStack spacing={"4"} alignItems={"center"}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              focusBorderColor="purple.300"
              defaultValue={myInfo.name}
              disabled
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="email"
              focusBorderColor="purple.300"
              defaultValue={myInfo.username}
              disabled
            />
          </FormControl>
        </HStack>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            focusBorderColor="purple.300"
            defaultValue={myInfo.email}
            disabled
          />
        </FormControl>

        <Textarea
          placeholder="Enter Bio"
          name="bio"
          value={data.bio}
          onChange={handleChange}
        />
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            focusBorderColor="purple.300"
            name="address"
            value={data.address}
            onChange={handleChange}
          />
        </FormControl>
      </CustomModel>
    </>
  );
}

export default UserProfile;
