// src/pages/masters/DepartmentTable.js (or your actual path)
import React, { useState, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Heading,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
// import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

import { useDebounce } from "use-debounce";

import {
  DataTableContainer,
  DataTable,
  DThead,
  DTr,
  DTh,
  DTbody,
  DTd,
  DTPageSizing,
  DTPagination,
} from '../../components/core/DataTable'; 

import { useFetchAllDepartment } from '../../hooks/adminActions'; 
import SearchInput from "../../components/core/SearchInput"; 

const columnConfig = [
  { key: 'departmentCode', label: 'Code' },
  { key: 'departmentName', label: 'Name' },
  { key: 'departmentCode_Iobs', label: 'IOBS Code' },
  // Add more columns here if needed in the future
];

const DepartmentTable = () => {

  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [debouncedGlobalSearchTerm] = useDebounce(globalSearchTerm, 500);

  const [filterDeptCode, setFilterDeptCode] = useState('');
  const [debouncedFilterDeptCode] = useDebounce(filterDeptCode, 500);

  const [filterDeptName, setFilterDeptName] = useState('');
  const [debouncedFilterDeptName] = useDebounce(filterDeptName, 500);

  const [filterIobsCode, setFilterIobsCode] = useState('');
  const [debouncedFilterIobsCode] = useDebounce(filterIobsCode, 500);

  const [sortConfig, setSortConfig] = useState({ key: 'departmentName', direction: 'asc' });

  const {
    data: responseData,
    isLoading,
    isError,
    error,
    isFetching,
    // isPreviousData,
  } = useFetchAllDepartment(
    pageNumber,
    pageSize,
    debouncedGlobalSearchTerm,
    debouncedFilterDeptCode,
    debouncedFilterDeptName,
    debouncedFilterIobsCode,
    sortConfig
  );

  // Memoize processed data to avoid re-computation on every render
  const {
    departments,
    totalPages,
    totalElements,
    currentPageApi,
    currentSizeApi,
  } = useMemo(() => {
    return {
      departments: responseData?.data?.content ?? [],
      totalPages: responseData?.data?.totalPages ?? 0,
      totalElements: responseData?.data?.totalElements ?? 0,
      currentPageApi: responseData?.data?.number ?? 0,
      currentSizeApi: responseData?.data?.size ?? pageSize,
    };
  }, [responseData, pageSize]);

  // --- UI Styling ---
  const containerBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');

  // --- Calculation for display ---
  const startIndex = totalElements > 0 ? currentPageApi * currentSizeApi : 0;
  const endIndex = startIndex + departments.length;

  // --- Handlers ---
  const handleGlobalSearchChange = (newSearchText) => {
    setGlobalSearchTerm(newSearchText);
    setPageNumber(0);
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPageNumber(0);
  };

  const handleSort = (columnKey) => {
    let newDirection = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      newDirection = 'desc';
    }
    setSortConfig({ key: columnKey, direction: newDirection });
    setPageNumber(0);
  };

  const SortableDTh = ({ children, columnKey, ...props }) => (
    <DTh
      onClick={() => handleSort(columnKey)}
      cursor="pointer"
      userSelect="none" // Prevents text selection on click
      bg={tableHeaderBg}
      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
      {...props}
    >
      <Flex align="center" justify="space-between"> {/* For better alignment of icon */}
        {children}
        {sortConfig.key === columnKey && (
          <Icon
            // as={sortConfig.direction === 'asc' ? TriangleUpIcon : TriangleDownIcon}
            ml={2}
            boxSize={3}
          />
        )}
      </Flex>
    </DTh>
  );

  const numColumns = columnConfig.length; // departmentCode, departmentName, departmentCode_Iobs

  return (
    <Box p={{ base: 3, md: 5 }} borderWidth="1px" borderRadius="lg" bg={containerBg} shadow="lg">
      <Heading size="lg" mb={6} color={useColorModeValue('gray.700', 'gray.200')}>
        Department Management
      </Heading>

      {/* --- Filters Section --- */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} mb={6}>
        <SearchInput
          searchText={globalSearchTerm}
          setSearchText={handleGlobalSearchChange}
          placeholder="Global Search (e.g., Name)..."
          size="sm"
        />
        <Input
          placeholder="Filter by Dept Code..."
          value={filterDeptCode}
          onChange={(e) => handleFilterChange(setFilterDeptCode, e.target.value)}
          size="sm"
          bg={inputBg}
        />
        <Input
          placeholder="Filter by Dept Name..."
          value={filterDeptName}
          onChange={(e) => handleFilterChange(setFilterDeptName, e.target.value)}
          size="sm"
          bg={inputBg}
        />
        <Input
          placeholder="Filter by IOBS Code..."
          value={filterIobsCode}
          onChange={(e) => handleFilterChange(setFilterIobsCode, e.target.value)}
          size="sm"
          bg={inputBg}
        />
      </SimpleGrid>

      {/* --- Table Controls: Page Sizing --- */}
      <Flex justifyContent="flex-start" mb={4}>
        <DTPageSizing
          pageSize={pageSize}
          setPageSize={(value) => {
            setPageSize(Number(value));
            setPageNumber(0);
          }}
        />
      </Flex>

      {/* --- Loading and Error States --- */}
      {isLoading && !isFetching && (
        <Flex justify="center" align="center" minHeight="300px">
          <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
          <Text ml={4} fontSize="lg" color={textColor}>Loading Departments...</Text>
        </Flex>
      )}

      {isError && (
        <Alert status="error" borderRadius="md" mb={4} variant="left-accent">
          <AlertIcon />
          <Box>
            <Heading size="sm">Error Fetching Departments</Heading>
            <Text fontSize="sm" mt={1}>
              {error instanceof Error ? error.message : 'An unknown error occurred. Please try again.'}
            </Text>
          </Box>
        </Alert>
      )}

      {/* --- Table Content (show only if not initial load or error) --- */}
      {!isLoading && !isError && (
        <>
          <DataTableContainer>
            <DataTable>
              <DThead>
                <DTr>
                  {columnConfig.map((col) => (
                    <SortableDTh key={col.key} columnKey={col.key}>
                      {col.label}
                    </SortableDTh>
                  ))}
                </DTr>
              </DThead>
              <DTbody>
                {isFetching && departments.length === 0 && (
                  <DTr>
                    <DTd colSpan={numColumns} textAlign="center" py={10}>
                      <Spinner size="md" color="blue.500" />
                    </DTd>
                  </DTr>
                )}
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <DTr key={dept.departmentCode} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                      <DTd>{dept?.departmentCode ?? 'N/A'}</DTd>
                      <DTd whiteSpace="nowrap">{dept?.departmentName ?? 'N/A'}</DTd>
                      <DTd>{dept?.departmentCode_Iobs ?? 'N/A'}</DTd>
                    </DTr>
                  ))
                ) : (
                  !isFetching && (
                    <DTr>
                      <DTd colSpan={numColumns} textAlign="center" color={textColor} py={10}>
                        {debouncedGlobalSearchTerm || debouncedFilterDeptCode || debouncedFilterDeptName || debouncedFilterIobsCode
                          ? 'No departments match your criteria.'
                          : 'No departments found.'}
                      </DTd>
                    </DTr>
                  )
                )}
              </DTbody>
            </DataTable>
          </DataTableContainer>

          {/* --- Pagination --- */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            mt={6}
            gap={3}
            flexWrap="wrap"
          >
            {totalElements > 0 ? (
              <>
                <Text fontSize="sm" color={textColor}>
                  Showing {startIndex + 1} to {endIndex} of {totalElements} entries
                </Text>
                <DTPagination
                  pageNumber={currentPageApi}
                  setPageNumber={setPageNumber}
                  totalPages={totalPages}
                  isDisabled={isFetching} // Disable if any fetch is in progress
                />
              </>
            ) : (
              !isFetching && <Text fontSize="sm" color={textColor}>No entries to display</Text>
            )}
          </Flex>
        </>
      )}
    </Box>
  );
};

export default DepartmentTable;