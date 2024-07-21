import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  DeleteData,
  GetData,
  PatchData,
  PostData,
} from "../../fetchData/fetch.api";
import useAuth from "./auth.store";

const usePost = create(
  devtools((set) => ({
    loading: false,
    posts: [],
    explorePosts: [],
    errorMessage: "",
    successMessage: "",
    explorePost: (followers) => {
      console.log();
      set((state) => {
        const posts = state.posts?.filter((post) =>
          followers.includes(post?.creator?._id.toString())
        );
        return {
          ...state,
          explorePosts: posts,
        };
      });
    },
    handleLike: (cpost, message) => {
      console.log(cpost);
      set((state) => {
        const updatedPost = state.posts.map((post) => {
          if (post._id.toString() === cpost._id.toString()) {
            return cpost;
          }
          return post;
        });

        return {
          ...state,
          successMessage: message,
          posts: updatedPost,
        };
      });
    },
    handleError: (err) => {
      set((state) => ({
        ...state,
        loading: false,
        errorMessage: err.response.data.message || err.message,
      }));
    },
    clearMessage: () => {
      set((state) => ({
        ...state,
        successMessage: "",
        errorMessage: "",
      }));
    },
    createPost: async (post) => {
      set((state) => ({ ...state, loading: true }));
      try {
        const res = await PostData("/posts/create-post", post);
        set((state) => ({
          successMessage: res.data.message,
          loading: false,
          posts: [res.data.post, ...state.posts],
        }));
      } catch (err) {
        set((state) => ({
          ...state,
          loading: false,
          errorMessage: err.response.data.message || err.message,
        }));
      }
    },
    copyPostLink: async (link) => {
      await navigator.clipboard.writeText(link);
      set((state) => ({
        ...state,
        successMessage: "Copy Link successfully",
      }));
    },
    editPost: async (id, post) => {
      set((state) => ({ ...state, loading: true }));
      try {
        const res = await PatchData("/posts/" + id, post);
        set((state) => {
          const index = state.posts.findIndex(
            (post) => post._id.toString() === res.data.post._id.toString()
          );
          const newArray = [...state.posts];
          newArray.splice(index, 1, res.data.post);
          return {
            ...state,
            successMessage: res.data.message,
            loading: false,
            posts: newArray,
          };
        });
      } catch (err) {
        set((state) => ({
          ...state,
          loading: false,
          errorMessage: err.response.data.message || err.message,
        }));
      }
    },
    deletePost: async (id) => {
      set((state) => ({ ...state, loading: true }));
      try {
        const res = await DeleteData("/posts/" + id);
        set((state) => {
          const index = state.posts.findIndex(
            (post) => post._id.toString() === res.data.id.toString()
          );
          const newArray = [...state.posts];
          newArray.splice(index, 1);
          return {
            ...state,
            successMessage: res.data.message,
            loading: false,
            posts: newArray,
          };
        });
      } catch (err) {
        set((state) => ({
          ...state,
          loading: false,
          errorMessage: err.response.data.message || err.message,
        }));
      }
    },
    getAllPosts: async () => {
      set((state) => ({ ...state, loading: true }));
      try {
        const res = await GetData("/posts/get-all-posts");
        set((state) => ({
          ...state,
          loading: false,
          posts: res.data.posts,
        }));
      } catch (err) {
        err.response.data.message === "Token Not Found"
          ? useAuth.getState().logoutSession()
          : set((state) => ({
              ...state,
              loading: false,
              errorMessage: err.response.data.message || err.message,
            }));
      }
    },
  }))
);

export default usePost;
