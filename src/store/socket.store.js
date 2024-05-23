import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useSocketStore = create(
  devtools((set) => ({
    socket: null,
    setSocket: (socket) => {
      set((state) => ({
        ...state,
        socket,
      }));
    },
  }))
);

export default useSocketStore;
