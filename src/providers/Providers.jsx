import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

const Providers = ({ children }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

export default Providers;
