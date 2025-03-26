import React from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Select,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

export const TableContainer = ({ children, ...others }) => {
  return (
    <Box
      overflowX="auto"
      overflowY="hidden"
      shadow="sm"
      border="1px"
      borderColor="border"
      rounded="md"
      __css={{
        "&::-webkit-scrollbar": {
          h: "8px",
          bg: useColorModeValue("zinc.300", "zinc.700"),
        },
        "&::-webkit-scrollbar-thumb": {
          cursor: "pointer",
          borderRadius: "full",
          bg: useColorModeValue("zinc.400", "zinc.600"),
        },
      }}
      {...others}
    >
      {children}
    </Box>
  );
};

export const Table = ({ children }) => {
  return (
    <Box as="table" w="full">
      {children}
    </Box>
  );
};

export const Thead = ({ children }) => {
  return (
    <Box as="thead" bg="paperSecondary" borderBottom="1px" borderColor="border">
      {children}
    </Box>
  );
};

export const Tr = ({ children, ...others }) => {
  return (
    <Box
      as="tr"
      p={4}
      borderBottom="1px"
      borderColor="border"
      _last={{
        borderBottom: "0px",
      }}
      {...others}
    >
      {children}
    </Box>
  );
};

export const Th = ({ children, isNumeric = false, ...others }) => {
  return (
    <Box
      as="th"
      textAlign={isNumeric ? "right" : "left"}
      whiteSpace="nowrap"
      fontSize="sm"
      fontWeight="medium"
      color="body"
      px={4}
      py={2}
      {...others}
    >
      {children}
    </Box>
  );
};

export const Tbody = ({ children }) => {
  return <Box as="tbody">{children}</Box>;
};

export const Td = ({ children, isNumeric = false }) => {
  return (
    <Box
      as="td"
      textAlign={isNumeric ? "right" : "left"}
      whiteSpace="nowrap"
      px={4}
      py={2}
    >
      {children}
    </Box>
  );
};

export const PageSizing = ({ pageSize, setPageSize }) => {
  // Handlers
  const handlePageSize = (e) => {
    setPageSize(e.target.value);
  };

  return (
    <HStack alignItems="center">
      <Text color="body" fontSize="small" flexShrink={0}>
        Page Size
      </Text>
      <Select
        value={pageSize}
        w="fit-content"
        onChange={handlePageSize}
        rounded="md"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </Select>
    </HStack>
  );
};

export const Pagination = ({ query, pageNumber, setPageNumber }) => {
  // Handlers
  const nextPage = () => {
    if (pageNumber + 1 === query?.data?.data?.totalPages) return;
    setPageNumber(pageNumber + 1);
  };

  const prevPage = () => {
    if (pageNumber === 0) return;
    setPageNumber(pageNumber - 1);
  };

  return (
    <HStack justifyContent="space-between">
      {/* Page Number */}
      <Text fontSize="small" color="body">
        <strong>{pageNumber + 1}</strong> of{" "}
        <strong>{query?.data?.data?.totalPages}</strong>{" "}
        {query?.data?.data?.totalPages === 1 ? "page" : "pages"}
      </Text>

      {/* Pagination Buttons */}
      <HStack>
        <Button
          variant="outline"
          isDisabled={pageNumber === 0}
          onClick={() => setPageNumber(0)}
        >
          First
        </Button>

        <IconButton
          variant="outline"
          icon={<MdOutlineChevronLeft size={20} />}
          isDisabled={pageNumber === 0}
          onClick={prevPage}
        />

        <IconButton
          variant="outline"
          icon={<MdOutlineChevronRight size={20} />}
          isDisabled={pageNumber + 1 === query?.data?.data?.totalPages}
          onClick={nextPage}
        />

        <Button
          variant="outline"
          isDisabled={pageNumber + 1 === query?.data?.data?.totalPages}
          onClick={() => setPageNumber(query?.data?.data?.totalPages - 1)}
        >
          Last
        </Button>
      </HStack>
    </HStack>
  );
};

export const elementCounter = (index, query) => {
  return (
    index +
    query?.data?.data?.pageable?.pageNumber * query?.data?.data?.size +
    1
  );
};

export default TableContainer;