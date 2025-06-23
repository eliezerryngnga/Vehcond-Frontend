import React from "react";
import { Box } from "@chakra-ui/react";

const MdIcon = ({ iconName, size = 22, ...others }) => {
  return (
    <Box
      as="span"
      className="material-symbols-outlined"
      fontSize={size}
      {...others}
    >
      {iconName}
    </Box>
  );
};

export default MdIcon;
