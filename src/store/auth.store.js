import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { GetData, PatchData, PostData } from "../../fetchData/fetch.api";
const useAuth = create(
  devtools(
    persist(
      (set) => ({
        loading: false,
        authenticated: false,
        errorMessage: "",
        successMessage: "",
        chatUsers: [],
        notifications: [],
        token: "",
        myInfo: null,
        savedPost: [],
        makeAsRead: () => {
          set((state) => ({
            ...state,
            notifications: [],
          }));
        },
        setConversationToChatUser: (userId, conversation) => {
          console.log(userId, conversation);
          set((state) => {
            const newChatUsers = state.chatUsers?.map((usr) => {
              if (usr._id.toString() === userId?.toString()) {
                return {
                  ...usr,
                  conversation,
                };
              }
              return usr;
            });
            return {
              ...state,
              chatUsers: newChatUsers,
            };
          });
        },
        setChatUser: (userId) => {
          set((state) => ({
            ...state,
            chatUsers: [...state.chatUsers, userId],
          }));
        },
        createUser: async (user) => {
          set((state) => ({ ...state, loading: true }));
          try {
            const res = await PostData("/users/signup", user);

            set((state) => {
              return {
                ...state,
                loading: false,
                authenticated: true,
                token: res.data.token,
                successMessage: res.data.message,
                errorMessage: "",
              };
            });
          } catch (err) {
            set((state) => ({
              ...state,
              loading: false,
              authenticated: false,
              errorMessage:
                err.response?.data?.errors?.[0] || err.response?.data?.message,
            }));
          }
        },
        clearMessage: () => {
          set((state) => ({
            ...state,
            successMessage: "",
            errorMessage: "",
          }));
        },
        handlePostSave: async (post) => {
          const data = {
            postId: post?._id,
          };
          try {
            const res = await PatchData("/users/saved-post", data);
            console.log(res);
            set((state) => ({
              ...state,
              loading: false,
              successMessage: res?.data?.message,
              myInfo: res?.data.user,
            }));
          } catch (err) {
            set((state) => ({
              ...state,
              loading: false,
              errorMessage: err?.response?.data?.message,
            }));
          }
        },
        getMe: async () => {
          try {
            const res = await GetData("/users/me");
            console.log(res);
            set((state) => ({
              ...state,
              myInfo: res.data.user,
              successMessage: "",
              errorMessage: "",
            }));
          } catch (err) {
            console.log(err);
            console.log(err.response?.data);
            set((state) => ({
              ...state,
              loading: false,
              authenticated: false,
              successMessage: "Your Token Expired,Login Again",
              token: "",
              myInfo: "",
              chatUsers: [],
            }));
          }
        },
        updateProfile: async (user) => {
          set((state) => ({ ...state, loading: true }));
          try {
            const res = await PatchData("/users/update-profile", user);
            set((state) => ({
              ...state,
              loading: false,
              myInfo: res.data.user,
              successMessage: res.data.message,
            }));
          } catch (err) {
            set((state) => ({
              ...state,
              loading: false,
              errorMessage: err?.response?.data?.message,
            }));
          }
        },
        addNotification: (message) => {
          set((state) => ({
            ...state,
            notifications: [...state.notifications, message],
          }));
        },
        loginUser: async (user) => {
          set((state) => ({ ...state, loading: true }));
          try {
            const res = await PostData("/users/login", user);

            set((state) => {
              return {
                ...state,
                loading: false,
                authenticated: true,
                token: res.data.token,
                successMessage: res.data.message,
                errorMessage: "",
              };
            });
          } catch (err) {
            set((state) => ({
              ...state,
              loading: false,
              authenticated: false,
              errorMessage:
                err.response?.data?.errors?.length > 0
                  ? err.response?.data?.errors[0]
                  : err.response?.data?.message,
            }));
          }
        },
        logoutUser: async () => {
          try {
            const res = await GetData("/users/logout");
            set((state) => ({
              ...state,
              loading: false,
              authenticated: false,
              successMessage: res.data?.message,
              token: "",
              myInfo: "",
              chatUsers: [],
            }));
          } catch (err) {
            set((state) => ({
              ...state,
              errorMessage: err?.response?.data?.message,
            }));
          }
        },
        FollowUnFollowUser: async (id) => {
          set((state) => ({ ...state, loading: true }));
          try {
            const res = await PatchData("/users/follow-unfollow/" + id);
            set((state) => ({
              ...state,
              myInfo: {
                ...state.myInfo,
                followings:
                  res.data.message.indexOf("unfollow") === -1
                    ? [...state.myInfo.followings, id]
                    : state.myInfo.followings.filter(
                        (follow) => follow.toString() !== res.data.id.toString()
                      ),
              },
              loading: false,
              successMessage: res?.data?.message,
            }));
          } catch (err) {
            set((state) => ({
              ...state,
              loading: false,
              errorMessage: err?.response?.data?.message,
            }));
          }
        },
      }),
      { name: "auth" }
    )
  )
);

export default useAuth;
