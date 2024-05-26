import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useMessageStore = create(
  devtools((set) => ({
    messages: [],
    conversations: [],
    onlineUsers: [],
    chatSelected: null,
    setOnlineUsers: (users) => {
      set((state) => ({
        ...state,
        onlineUsers: users,
      }));
    },
    setConversations: (conversations) => {
      set((state) => ({
        ...state,
        conversations,
      }));
    },
    setMessages: (messages) => {
      set((state) => ({
        ...state,
        messages,
      }));
    },

    setChatSelected: (conversation) => {
      set((state) => ({
        ...state,
        chatSelected: conversation,
      }));
    },
    createMessage: (message) => {
      set((state) => {
        if (state.chatSelected.initialCreate) {
          const findC = state.conversations.map((conversation) => {
            if (
              (conversation.recipients[0]._id.toString() ===
                message?.sender._id.toString() &&
                conversation.recipients[1]._id.toString() ===
                  message?.reciever._id.toString()) ||
              (conversation.recipients[0]._id.toString() ===
                message?.reciever._id.toString() &&
                conversation.recipients[1]._id.toString() ===
                  message?.sender._id.toString())
            ) {
              return message.conversation;
            }
            return conversation;
          });
          return {
            ...state,
            conversations: findC,
            chatSelected: message.conversation,
            messages: [...state.messages, message],
          };
        } else {
          const conversations = state.conversations?.map((conv) =>
            conv._id?.toString() === message.conversation?._id.toString()
              ? message.conversation
              : conv
          );
          return {
            ...state,
            conversations,
            chatSelected: message.conversation,
            messages: [...state.messages, message],
          };
        }
      });
    },
    createConversation: (recipients) => {
      set((state) => {
        const findC = state.conversations.find(
          (conversation) =>
            (conversation.recipients[0]._id.toString() ===
              recipients[0]._id.toString() &&
              conversation.recipients[1]._id.toString() ===
                recipients[1]._id.toString()) ||
            (conversation.recipients[0]._id.toString() ===
              recipients[1]._id.toString() &&
              conversation.recipients[1]._id.toString() ===
                recipients[0]._id.toString())
        );
        if (!findC) {
          return {
            ...state,
            conversations: [
              ...state.conversations,
              {
                _id: "fake_id" + new Date().toISOString(),
                recipients,
                text: "",
                media: "",
                initialCreate: true,
              },
            ],
          };
        }
        return {
          ...state,
        };
      });
    },
  }))
);

export default useMessageStore;
