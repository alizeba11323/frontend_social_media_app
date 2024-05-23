import {
  Avatar,
  Box,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import moment from "moment";
import {
  IoArrowRedoOutline,
  IoBookmarkOutline,
  IoBookmarkSharp,
  IoChatbubbleEllipsesOutline,
  IoCopyOutline,
  IoEllipsisVerticalSharp,
  IoHeart,
  IoHeartOutline,
  IoNavigateOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import Comments from "./Comments";
import { useState } from "react";
import useAuth from "../store/auth.store";
import usePost from "../store/post.store";
import { BASE_URL, PatchData } from "../../fetchData/fetch.api";
import { socket } from "../socketsclient";
import { useNavigate } from "react-router-dom";

function Post({ post, handleEditOpen }) {
  const [showComment, setShowComment] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { myInfo, handlePostSave } = useAuth((state) => ({
    myInfo: state.myInfo,
    handlePostSave: state.handlePostSave,
  }));
  const { deletePost, likeDislike, copyPostLink, handleError } = usePost(
    (state) => ({
      deletePost: state.deletePost,
      likeDislike: state.handleLike,
      copyPostLink: state.copyPostLink,
      handleError: state.handleError,
    })
  );
  const handleShowComment = () => {
    setShowComment((prev) => !prev);
  };
  const DeletePost = async (id) => {
    await deletePost(id);
  };
  const handleSavePost = async () => {
    await handlePostSave(post);
  };
  const handleLikeDislike = async (postId) => {
    try {
      const res = await PatchData("/posts/like-dislike/" + postId);
      likeDislike(res.data.post, res.data.message);
      socket.emit("liked_unliked_post", [res.data.post, myInfo]);
    } catch (err) {
      handleError(err);
    }
  };
  const handleCopyLink = async (postId) => {
    await copyPostLink(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`);
  };
  return (
    <Box
      p="4"
      borderRadius="8"
      background={"gray.900"}
      display="flex"
      flexDirection={"column"}
      gap="4"
    >
      <Box display="flex" gap="3" alignItems={"center"}>
        <Avatar src={post?.creator?.avatar?.url} />
        <VStack spacing="0" alignItems={"flex-start"}>
          <Text fontSize="md">{post?.creator?.name}</Text>
          <Text fontSize="sm" color="purple.100">
            {moment(post?.createdAt).fromNow()}
          </Text>
        </VStack>
        <Box flex="1"></Box>
        <Menu>
          <MenuButton>
            <Icon as={IoEllipsisVerticalSharp} h="4" w="4" />
          </MenuButton>
          <MenuList>
            {post?.creator?._id?.toString() === myInfo?._id?.toString() && (
              <>
                {" "}
                <MenuItem onClick={() => handleEditOpen(post)}>
                  <Icon as={FiEdit} h="4" w="4" />{" "}
                  <Text ml="2"> Edit Post</Text>
                </MenuItem>
                <MenuItem onClick={() => DeletePost(post._id)}>
                  <Icon as={IoTrashBinOutline} h="4" w="4" />{" "}
                  <Text ml="2"> Delete Post</Text>
                </MenuItem>
              </>
            )}

            <MenuDivider />
            <MenuItem onClick={() => handleCopyLink(post?._id)}>
              <Icon as={IoCopyOutline} h="4" w="4" />{" "}
              <Text ml="2"> Copy Post Link</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Text>
        {!show ? post?.body.slice(0, 100) : post?.body}{" "}
        <a
          onClick={() => {
            setShow((prev) => !prev);
          }}
        >
          {post?.body.length > 100 && (
            <>{show ? "Show Less..." : "Read More..."}</>
          )}
        </a>
      </Text>
      <HStack spacing="2">
        {post?.tags?.map((tag) => (
          <Tag key={tag}>#{tag}</Tag>
        ))}
      </HStack>
      <Image
        src={post?.image?.url}
        borderRadius={"8"}
        width="100%"
        objectFit={"cover"}
      />
      <VStack spacing={"1"}>
        <Box display="flex" alignItems={"center"} gap="4" w="100%">
          <Icon
            as={post?.likes?.includes(myInfo._id) ? IoHeart : IoHeartOutline}
            w="5"
            h="5"
            cursor={"pointer"}
            color="purple.500"
            onClick={() => handleLikeDislike(post?._id, myInfo?._id)}
          />
          <Icon
            as={IoNavigateOutline}
            w="5"
            h="5"
            color="purple.500"
            cursor={"pointer"}
            onClick={() => navigate(`/posts/${post?._id}`)}
          />
          <Icon
            as={IoChatbubbleEllipsesOutline}
            w="5"
            h="5"
            cursor={"pointer"}
            onClick={handleShowComment}
            color="purple.500"
          />
          <Box flex="1"></Box>
          <Icon
            as={
              myInfo?.savedPost?.find(
                (cpost) => cpost?._id?.toString() === post?._id?.toString()
              )
                ? IoBookmarkSharp
                : IoBookmarkOutline
            }
            w="5"
            h="5"
            color="purple.500"
            cursor={"pointer"}
            onClick={handleSavePost}
          />
        </Box>
        <Box
          display={"flex"}
          w="100%"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize="small">{post?.likes?.length} Likes</Text>
          <Text
            fontSize={"small"}
            onClick={handleShowComment}
            cursor={"pointer"}
          >
            {post?.comments?.length} comments
          </Text>
        </Box>
      </VStack>
      <Comments
        post={post}
        showComment={showComment}
        postId={post?._id}
        comments={post?.comments}
      />
    </Box>
  );
}

export default Post;
