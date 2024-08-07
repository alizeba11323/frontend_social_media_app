import { Box, Image } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import sideImg from "../assets/side-img.avif";

function AuthLayout() {
  return (
    <>
      <Box
        as="section"
        display="flex"
        flex={1}
        alignItems={"center"}
        justifyContent={"center"}
        flexDir={"column"}
        py={10}
      >
        <Outlet />
      </Box>
      {sideImg && (
        <Image
          src={sideImg}
          display={{ base: "none", lg: "block" }}
          h={"100vh"}
          w="50%"
          objectFit={"cover"}
          bgRepeat={"no-repeat"}
        />
      )}
    </>
  );
}

export default AuthLayout;
