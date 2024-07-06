import {
  Avatar,
  Box,
  HStack,
  Icon,
  Input,
  Tag,
  TagLabel,
  Text,
  Textarea,
  useColorMode,
} from "@chakra-ui/react";
import moment from "moment";
import { FiEdit } from "react-icons/fi";
import { IoHeart, IoHeartOutline, IoTrash } from "react-icons/io5";
import useAuth from "../store/auth.store";
import { useState } from "react";

function Comment({
  comment,
  deleteComment,
  handleEdit,
  handleLike,
  createCommentFunc,
  tag,
}) {
  const { colorMode } = useColorMode();
  const [edit, setIsEdit] = useState(false);
  const [reply, setReply] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const { myInfo } = useAuth((state) => ({ myInfo: state.myInfo }));
  const handleReplyCreate = async () => {
    const createObj = {
      content: replyComment,
      postId: comment?.post,
      reply: comment._id,
      ...(tag && { tag: comment?.user?._id }),
    };
    console.log(createObj);
    await createCommentFunc(createObj);

    setReply(false);
    setReplyComment("");
  };
  return (
    <Box
      background={colorMode === "light" ? "gray.200" : "gray.800"}
      p="4"
      borderRadius={"4"}
    >
      <HStack justifyContent={"space-between"}>
        <Box display={"flex"} gap="2" alignItems={"center"}>
          <Avatar src={comment?.user?.avatar?.url} size="sm" />
          <Text fontSize={"sm"}>@{comment?.user?.username}</Text>
        </Box>
        {comment?.user?._id?.toString() === myInfo?._id.toString() && (
          <Box display="flex" gap="4">
            <Icon
              as={FiEdit}
              w="4"
              h="4"
              cursor={"pointer"}
              onClick={() => {
                setIsEdit((prev) => !prev);
                setEditComment(comment?.content);
              }}
            />
            <Icon
              as={IoTrash}
              w="4"
              h="4"
              cursor={"pointer"}
              onClick={() => deleteComment(comment?._id)}
            />
          </Box>
        )}
      </HStack>
      {edit ? (
        <Textarea
          my="2"
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
        />
      ) : (
        <Box display="flex" gap="4" alignItems={"center"}>
          {comment?.tag && (
            <Tag size="md" colorScheme="red" borderRadius="full" my="2">
              <Avatar
                src={comment?.tag?.avatar?.url}
                size="xs"
                name={comment?.tag?.name}
                ml={-1}
                mr={2}
              />
              <TagLabel>{comment.tag?.username}</TagLabel>
            </Tag>
          )}
          <Text my="2">{comment?.content}</Text>
        </Box>
      )}

      <Box display="flex" gap="8" fontSize={"sm"}>
        <Box as="span" color="gray.400">
          {moment(comment.createdAt).fromNow()}
        </Box>
        <Box as="span" display="flex" alignItems={"center"} gap="1">
          <Icon
            as={comment?.likes?.includes(myInfo._id) ? IoHeart : IoHeartOutline}
            w="4"
            h="4"
            cursor="pointer"
            onClick={() => handleLike(comment?._id)}
          />
          <Text>{comment?.likes?.length}</Text>
        </Box>
        {edit ? (
          <Box display="flex" alignItems={"center"} gap="4">
            <Text onClick={() => setIsEdit(false)} cursor={"pointer"}>
              cancel
            </Text>
            <Text
              onClick={() => {
                handleEdit(editComment, comment?._id);
                setIsEdit(false);
              }}
              cursor={"pointer"}
            >
              Update
            </Text>
          </Box>
        ) : (
          <>
            {!reply && (
              <Box
                as="span"
                cursor="pointer"
                onClick={() => setReply((prev) => !prev)}
              >
                Reply
              </Box>
            )}
          </>
        )}
      </Box>
      {reply && (
        <>
          {" "}
          <Input
            type="text"
            variant={"flushed"}
            focusBorderColor="purple.300"
            placeholder="Reply..."
            value={replyComment}
            onChange={(e) => setReplyComment(e.target.value)}
            ml="5"
          />
          <Box
            display="flex"
            alignItems={"center"}
            mt="2"
            gap="4"
            justifyContent={"flex-end"}
          >
            <Text onClick={() => setReply(false)} cursor={"pointer"}>
              cancel
            </Text>
            <Text cursor={"pointer"} onClick={handleReplyCreate}>
              Reply
            </Text>
          </Box>
        </>
      )}
      {comment?.reply &&
        comment?.reply.map((reply) => (
          <Comment
            comment={reply}
            key={reply._id}
            deleteComment={deleteComment}
            handleEdit={handleEdit}
            handleLike={handleLike}
            createCommentFunc={createCommentFunc}
            tag={true}
          />
        ))}
    </Box>
  );
}

export default Comment;
