import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import usePost from "../store/post.store";
import Post from "../components/Post";
function SinglePost() {
  const { id } = useParams();
  const { posts } = usePost((state) => ({ posts: state.posts }));
  const [post, setPost] = useState(null);
  useEffect(() => {
    if (id) {
      const post = posts?.find((post) => post._id.toString() === id.toString());
      setPost(post);
    }
  }, [id, posts]);
  return <Box>{<Post post={post} handleEditOpen={() => {}} />}</Box>;
}

export default SinglePost;
