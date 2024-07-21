import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import useAuth from "../store/auth.store";

function Register() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { loadingUser, createUser, authenticated, getMe } = useAuth(
    (state) => ({
      loadingUser: state.loading,
      createUser: state.createUser,
      authenticated: state.authenticated,
      getMe: state.getMe,
    })
  );
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const imgRef = useRef();
  const [src, setSrc] = useState("");
  const uploadImg = () => {
    imgRef.current.click();
  };
  const handleChangeImage = (e) => {
    setLoading(true);
    const file = e.target.files[0];
    setData((prev) => ({ ...prev, avatar: file }));
    const reader = new FileReader();
    reader.onload = function () {
      setTimeout(() => {
        setLoading(false);
        setSrc(reader.result);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async () => {
    if (!data.avatar) {
      return toast({
        title: "Error Occured",
        description: "Please Select Image",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar, data.avatar.name);
    const res = await createUser(formData);
    console.log(res);
  };
  useEffect(() => {
    if (authenticated) {
      getMe().then(() => {
        navigate("/", { replace: true });
      });
    }
  }, [authenticated]);
  return (
    <Box
      display={"flex"}
      width={{ sm: "420px" }}
      alignItems={"center"}
      flexDir={"column"}
    >
      <Text fontSize={{ base: "2xl", md: "3xl" }}>Create a new Account</Text>
      <Text
        color={colorMode === "dark" ? "purple.100" : "gray.400"}
        fontSize={{ base: "sm", md: "md" }}
      >
        To use This App. enter your details{" "}
      </Text>
      <Box display={"flex"} flexDir={"column"} w="100%" gap={2} mt="4">
        <Flex alignItems={"center"} gap="6">
          <Box flex="1" display={"flex"} justifyContent={"center"}>
            <Avatar
              size="xl"
              name="Prosper Otemuyiwa"
              src={src ? src : "https://bit.ly/prosper-baba"}
            />
          </Box>
          <Box flex="1">
            <Input
              type="file"
              display={"none"}
              ref={imgRef}
              onChange={handleChangeImage}
            />
            <Button
              size="md"
              flex="1"
              colorScheme="gray"
              isLoading={loading}
              borderRadius={2}
              onClick={uploadImg}
            >
              Upload Image
            </Button>
          </Box>
        </Flex>
        <HStack spacing={"4"} alignItems={"center"}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              focusBorderColor="purple.300"
              name="name"
              value={data.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              focusBorderColor="purple.300"
              name="username"
              value={data.username}
              onChange={handleChange}
            />
          </FormControl>
        </HStack>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            focusBorderColor="purple.300"
            name="email"
            value={data.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            focusBorderColor="purple.300"
            name="password"
            value={data.password}
            onChange={handleChange}
          />
        </FormControl>
        <VStack>
          <Button
            w="100%"
            variant={"purple_solid"}
            isLoading={loadingUser}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={handleSubmit}
          >
            Register
          </Button>
          <Text mt="0" textAlign={"center"} letterSpacing={1}>
            Already have an account? <Link to="/auth/login">Login</Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default Register;
