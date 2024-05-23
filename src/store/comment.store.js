import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  DeleteData,
  GetData,
  PatchData,
  PostData,
} from "../../fetchData/fetch.api";
import usePost from "./post.store";

const useComment = create(
  devtools((set) => ({
    loading: false,
    comments: [],
    createComment: async (commentData) => {
      set((state) => ({ ...state, loading: true }));
      try {
        const res = await PostData("/posts/create-comment", commentData);
        set((state) => ({ ...state, loading: false }));
        usePost.setState((state) => ({
          ...state,
          successMessage: res?.data?.message,
        }));
      } catch (err) {
        set((state) => ({ ...state, loading: false }));
        console.log(err);
      }
    },
    fetchComments: async (postId) => {
      set((state) => ({ ...state, loading: true }));
      try {
        const res = await GetData("/posts/get-all-comments/" + postId);
        usePost.setState((state) => ({
          ...state,
          posts: state.posts?.map((post) => {
            if (post._id.toString() === postId) {
              return { ...post, comments: res.data.comments };
            }
            return post;
          }),
        }));
        set((state) => ({
          ...state,
          loading: false,
        }));
      } catch (err) {
        set((state) => ({ ...state, loading: false }));
        usePost.setState((state) => ({
          ...state,
        }));
        console.log(err);
      }
    },
    DeleteComment: async (postId) => {
      try {
        const res = await DeleteData("/posts/comments/" + postId);
        usePost.setState((state) => ({
          ...state,
          successMessage: res?.data?.message,
        }));
      } catch (err) {
        usePost.setState((state) => ({
          ...state,
          errorMessage: err?.response?.data?.message,
        }));
        console.log(err);
      }
    },
    EditComment: async (content, commentId) => {
      try {
        const res = await PatchData("/posts/comments/" + commentId, {
          content,
        });
        usePost.setState((state) => ({
          ...state,
          successMessage: res?.data?.message,
        }));
      } catch (err) {
        usePost.setState((state) => ({
          ...state,
          errorMessage: err?.response?.data?.message,
        }));
        console.log(err);
      }
    },
    LikeDislikeComment: async (commentId) => {
      try {
        const res = await PatchData(
          "/posts/comments/like-dislike/" + commentId
        );
        usePost.setState((state) => ({
          ...state,
          successMessage: res?.data?.message,
        }));
      } catch (err) {
        usePost.setState((state) => ({
          ...state,
          errorMessage: err?.response?.data?.message,
        }));
        console.log(err);
      }
    },
  }))
);

export default useComment;
