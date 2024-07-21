import { Box, Grid, GridItem } from "@chakra-ui/react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <Box w="100vw" h="100vh">
      <Header />
      <Grid templateColumns={"repeat(12,1fr)"}>
        <GridItem colSpan={3}>
          <SideBar />
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 9 }}>
          <Box as="section" h="100vh" overflowY={"scroll"}>
            <Outlet />
          </Box>
        </GridItem>
      </Grid>

      <Footer />
    </Box>
  );
}

export default MainLayout;
