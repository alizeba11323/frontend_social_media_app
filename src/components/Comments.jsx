import { Box, Button, Input } from "@chakra-ui/react";
import Comment from "./Comment";
import { useCallback, useEffect, useState } from "react";
import useComment from "../store/comment.store";
import { BeatLoader, ScaleLoader } from "react-spinners";
import { socket } from "../socketsclient";
import useAuth from "../store/auth.store";
function Comments({ showComment, postId, comments, post }) {
  const [comment, setComment] = useState("");
  const [IsFetchAgain, setIsFetchAgain] = useState(false);
  const { myInfo } = useAuth((state) => ({ myInfo: state.myInfo }));
  const {
    loading,
    createComment,
    fetchComments,
    DeleteComment,
    EditComment,
    LikeDislikeComment,
  } = useComment((state) => ({
    loading: state.loading,
    createComment: state.createComment,
    fetchComments: state.fetchComments,
    DeleteComment: state.DeleteComment,
    EditComment: state.EditComment,
    LikeDislikeComment: state.LikeDislikeComment,
  }));
  useEffect(() => {
    socket.on("create-comment", () => {
      setIsFetchAgain((prev) => !prev);
    });
    socket.on("like-comment", () => {
      setIsFetchAgain((prev) => !prev);
    });
    socket.on("edit-comment", () => {
      setIsFetchAgain((prev) => !prev);
    });
    socket.on("delete-comment", () => {
      setIsFetchAgain((prev) => !prev);
    });
    return () => {
      socket.off("create-comment");
      socket.off("like-comment");
      socket.off("edit-comment");
      socket.off("delete-comment");
    };
  }, []);
  useEffect(() => {
    const getComment = async () => {
      await fetchComments(postId);
    };
    getComment();
  }, [IsFetchAgain, showComment, postId]);
  const createCommentFunc = async (data) => {
    await createComment(data);
    setIsFetchAgain((prev) => !prev);
    socket.emit("create-comment", [post, myInfo]);
  };
  const handleCreateComment = async () => {
    await createCommentFunc({ content: comment, postId });
    setComment("");
  };
  const deleteComment = async (commentId) => {
    await DeleteComment(commentId);
    setIsFetchAgain((prev) => !prev);
    socket.emit("delete-comment", [post, myInfo]);
  };
  const handleEdit = async (content, commentId) => {
    await EditComment(content, commentId);
    setIsFetchAgain((prev) => !prev);
    socket.emit("edit-comment", [post, myInfo]);
  };
  const handleLike = async (commentId) => {
    await LikeDislikeComment(commentId);
    setIsFetchAgain((prev) => !prev);
    socket.emit("like-comment", [post, myInfo]);
  };
  return (
    <>
      <Box display="flex" gap="4" alignItems={"center"}>
        <Input
          type="text"
          variant={"filled"}
          placeholder="Enter Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          isLoading={loading}
          spinner={<BeatLoader size={8} color="white" />}
          variant="purple_solid"
          size="sm"
          fontSize="sm"
          onClick={handleCreateComment}
        >
          comment
        </Button>
      </Box>

      {showComment && (
        <Box display={"flex"} flexDir={"column"} gap="3">
          {comments?.map((comment) => {
            return (
              <Comment
                comment={comment}
                key={comment._id}
                deleteComment={deleteComment}
                handleEdit={handleEdit}
                handleLike={handleLike}
                createCommentFunc={createCommentFunc}
                tag={false}
              />
            );
          })}
        </Box>
      )}
    </>
  );
}

export default Comments;
