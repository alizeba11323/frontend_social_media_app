import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import useAuth from "../store/auth.store";
function Login() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { loadingUser, loginUser, authenticated, getMe } = useAuth((state) => ({
    loadingUser: state.loading,
    loginUser: state.loginUser,
    authenticated: state.authenticated,
    getMe: state.getMe,
  }));
  const [data, setData] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    if (authenticated) {
      getMe().then(() => {
        navigate("/", { replace: true });
      });
    }
  }, [authenticated]);
  const handleLogin = async () => {
    await loginUser(data);
  };
  return (
    <Box
      display={"flex"}
      width={{ sm: "420px" }}
      alignItems={"center"}
      flexDir={"column"}
    >
      <Text fontSize={{ base: "2xl", md: "3xl" }} onClick={toggleColorMode}>
        Login to your account
      </Text>
      <Text
        pt="2"
        color={colorMode === "dark" ? "purple.100" : "gray.400"}
        fontSize={{ base: "sm", md: "md" }}
      >
        Welcome Back! Please enter your details{" "}
      </Text>
      <Box display={"flex"} flexDir={"column"} w="100%" gap={2} mt="4">
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
            onClick={handleLogin}
            spinner={<BeatLoader size={8} color="white" />}
          >
            Login
          </Button>
          <Text textAlign={"center"} letterSpacing={1}>
            Don`t have an account? <Link to="/auth/register">Register</Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default Login;
