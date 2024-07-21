import { Box, Grid, GridItem } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Recommendation from "../components/Recommendation";

function HomeLayout({ children }) {
  return (
    <Box w="100vw" h="100vh">
      <Header />
      <Grid templateColumns={"repeat(12,1fr)"}>
        <GridItem colSpan={2}>
          <SideBar />
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 5 }}>
          <Box as="section">{children}</Box>
        </GridItem>
        <GridItem colSpan={5}>
          <Recommendation />
        </GridItem>
      </Grid>

      <Footer />
    </Box>
  );
}

export default HomeLayout;
