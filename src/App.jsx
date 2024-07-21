import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Box, useToast } from "@chakra-ui/react";
import HomeLayout from "./layouts/HomeLayout";
import MainLayout from "./layouts/MainLayout";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import Chat from "./pages/Chat";
import UserProfile from "./pages/UserProfile";
import { useEffect } from "react";
import useAuth from "./store/auth.store";
import ProtectedLayout from "./layouts/ProtectedLayout";
import SinglePost from "./pages/SinglePost";

import { socket } from "./socketsclient";
import usePost from "./store/post.store";
import useMessageStore from "./store/message.store";
import AudioNoti from "./assets/noti.mp3";
function App() {
  console.log(document.cookie);
  console.log(import.meta.env.BASE_URL);
  const { likeDislike } = usePost((state) => ({
    likeDislike: state.handleLike,
  }));
  const {
    errorMessage,
    successMessage,
    clearMessage,
    authenticated,
    myInfo,
    addNotification,
  } = useAuth((state) => ({
    successMessage: state.successMessage,
    errorMessage: state.errorMessage,
    clearMessage: state.clearMessage,
    authenticated: state.authenticated,
    addNotification: state.addNotification,
    myInfo: state.myInfo,
  }));
  const { setOnlineUsers } = useMessageStore((state) => ({
    setOnlineUsers: state.setOnlineUsers,
  }));
  const toast = useToast();
  useEffect(() => {
    if (authenticated) {
      socket.connect();
      socket.emit("user_join", myInfo?._id);
    }
    return () => {
      socket.disconnect();
    };
  }, [authenticated, myInfo?._id]);
  useEffect(() => {
    socket.on("liked_unliked_post", (post) => {
      console.log("liked");
      likeDislike(post, "");
    });
    return () => {
      socket.off("liked_unliked_post");
    };
  }, []);
  useEffect(() => {
    socket.on("notification", (message) => {
      const audio = new Audio(AudioNoti);
      audio.play();
      addNotification(message);
    });
  }, []);
  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Error Message",
        description: errorMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      clearMessage();
    }
    if (successMessage) {
      toast({
        title: "Success Message",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      clearMessage();
    }
  }, [errorMessage, successMessage]);
  useEffect(() => {
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.off("online-users");
    };
  }, []);
  return (
    <Box as="main" display={"flex"} w="100vw" h="100vh">
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="/chat" element={<Chat />} />
          <Route
            path="/explore"
            element={
              <MainLayout>
                <Explore />
              </MainLayout>
            }
          />
          <Route
            path="/notifications"
            element={
              <MainLayout>
                <Notifications />
              </MainLayout>
            }
          />
          <Route
            path="/users"
            element={
              <MainLayout>
                <Users />
              </MainLayout>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <MainLayout>
                <UserProfile />
              </MainLayout>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <MainLayout>
                <SinglePost />
              </MainLayout>
            }
          />

          <Route
            path="/"
            element={
              <HomeLayout>
                <Home />
              </HomeLayout>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
