import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  ChakraProvider,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { mode } from "@chakra-ui/theme-tools";
export const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: "normal",
    // <-- border radius is same for all variants and sizes
  },
  variants: {
    purple_outline: {
      border: "2px solid",
      borderColor: "purple.500",
      color: "purple.500",
      _hover: {
        border: "none",
        bg: "purple.700",
        color: "white",
      },
    },
    purple_solid: {
      bg: "purple.500",
      color: "white",
      _hover: {
        bg: "purple.700",
      },
    },
  },
});
const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  components: {
    Button,
  },
  styles: {
    global: (props) => ({
      body: {
        fontFamily: "Poppins",
        color: mode("gray.500", "whiteAlpha.900")(props),
        bg: mode("white", "gray.800")(props),
      },
      a: {
        color: "purple.400",
        textDecoration: "none",
      },
    }),
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraProvider>
);
