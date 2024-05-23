import { useEffect } from "react";
import usePost from "../store/post.store";
import useAuth from "../store/auth.store";
import { Box, HStack, Icon, Image, Text } from "@chakra-ui/react";
import { IoBookmarkOutline, IoHeartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
function Explore() {
  const navigate = useNavigate();
  const { explorePost, explorePosts } = usePost((state) => ({
    explorePost: state.explorePost,
    explorePosts: state.explorePosts,
  }));
  const { myInfo } = useAuth((state) => ({ myInfo: state.myInfo }));
  useEffect(() => {
    explorePost(myInfo?.followers);
  }, []);
  console.log(explorePosts);
  return (
    <Box padding={"30px"}>
      <Text fontSize="3xl" mb="10">
        Explore Posts
      </Text>
      <Box display="flex" gap="8">
        {explorePosts?.map((post) => (
          <Box
            key={post._id}
            borderRadius={16}
            w="250px"
            h="250px"
            overflow={"hidden"}
            position="relative"
            onClick={() => navigate("/posts/" + post._id)}
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
  );
}

export default Explore;
