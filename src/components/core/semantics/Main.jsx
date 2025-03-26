import React from "react";
import { Stack } from "@chakra-ui/react";

const Main = ({ spacing = 4, children }) => {
  return (
    <Stack as="main" spacing={spacing} mt={0}>
      {children}
    </Stack>
  );
};

export default Main;
