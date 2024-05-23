import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useMessageStore = create(
  devtools((set) => ({
    messages: [],
    createMessage: (message) => {
      set((state) => {
        const findConversation = state.messages.find(
          (msg) => msg[message?.conversation._id]
        );
        let newMessages;
        if (findConversation) {
          newMessages = state.messages?.map((msg) => {
            const conversationId = msg[message?.conversation._id];
            if (conversationId) {
              return {
                [message?.conversation._id]: [
                  ...msg[message?.conversation._id],
                  message,
                ],
              };
            }
            return msg;
          });
        } else {
          newMessages = [
            ...state.messages,
            { [message?.conversation?._id]: [message] },
          ];
        }

        return {
          ...state,
          messages: newMessages,
        };
      });
    },
    getAllMessages: (conversationId, messages) => {
      if (conversationId === null) {
        set((state) => ({
          ...state,
          messages,
        }));
      } else {
        set((state) => {
          let newMessages;
          const findConversation = state.messages.find(
            (msg) => msg[conversationId]
          );
          if (findConversation) {
            newMessages = state.messages?.map((msg) => {
              if (msg[conversationId]) {
                return {
                  [conversationId]: [...messages],
                };
              }
              return msg;
            });
          } else {
            newMessages = [
              ...state.messages,
              { [conversationId]: [...messages] },
            ];
          }

          return {
            ...state,
            messages: newMessages,
          };
        });
      }
    },
  }))
);

export default useMessageStore;
