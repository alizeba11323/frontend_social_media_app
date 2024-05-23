import { Box, Text } from "@chakra-ui/react";
import Post from "./Post";
import usePost from "../store/post.store";
import { useEffect } from "react";
import { DotLoader } from "react-spinners";
const Posts = ({ handleEditOpen }) => {
  const { posts, loading, getAllPosts } = usePost((state) => ({
    posts: state.posts,
    loading: state.loading,
    getAllPosts: state.getAllPosts,
  }));
  console.log(posts);
  useEffect(() => {
    const getPosts = async () => {
      await getAllPosts();
    };
    getPosts();
  }, []);
  return (
    <Box display={"flex"} flexDirection={"column"} gap="8">
      {loading && (
        <Box
          width="100%"
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <DotLoader color="#5d1bd1" />
        </Box>
      )}
      {!loading && posts?.length === 0 && (
        <Text fontSize={"2xl"} textAlign={"center"}>
          {" "}
          No Posts
        </Text>
      )}
      {posts?.map((post) => (
        <Post post={post} key={post?._id} handleEditOpen={handleEditOpen} />
      ))}
    </Box>
  );
};

export default Posts;
