import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Tag,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Heading,
} from '@chakra-ui/react';

import { format } from 'date-fns';
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

import { useFetchHeavyVehicle } from '../../hooks/transportActions'; // Adjust path if needed

//import SearchInput from "../../components/core/SearchInput"

// Props: onOpenModal (function to call when an action button is clicked)
const HeavyVehiclesTable = ({ onOpenModal }) => {
  // --- State specific to this table ---
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // --- Data Fetching specific to this table ---
  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
    isPreviousData
  } = useFetchHeavyVehicle(pageNumber, pageSize, debouncedSearchTerm);

  // --- Derived Data specific to this table ---
  const fetchedData = response?.data?.content ?? [];
  const totalPages = response?.data?.totalPages ?? 0;
  const totalElements = response?.data?.totalElements ?? 0;
  const currentPageNumber = response?.data?.number ?? 0;
  const currentPageSize = response?.data?.size ?? pageSize;

  // --- UI Styling ---
  const containerBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // --- Calculation for display ---
  const startIndex = currentPageNumber * currentPageSize;
  const endIndex = startIndex + fetchedData.length;

  // --- Render Logic ---
  return (
    <Box p={{ base: 2, md: 4 }} borderWidth="1px" borderRadius="md" bg={containerBg} shadow="sm">
        <Heading size="md" mb={4} color={textColor}>For Tender</Heading>

        {/* Loading state specific to this table */}
        {isLoading && (
             <Flex justify="center" align="center" height="200px">
                <Spinner /> <Text ml={3}>Loading...</Text>
             </Flex>
        )}

        {/* Error state specific to this table */}
        {isError && (
            <Alert status="error" borderRadius="md" mb={4}>
                <AlertIcon />
                <Box>
                    <Text fontWeight="bold">Error Fetching Data</Text>
                    <Text>{error instanceof Error ? error.message : 'An unknown error occurred.'}</Text>
                </Box>
            </Alert>
        )}

        {/* Render controls and table only if not in initial loading or error state */}
        {!isLoading && !isError && (
            <>
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ base: 'stretch', md: 'center' }}
                    mb={4}
                    gap={4}
                    flexWrap="wrap"
                >
                    {/* Left Side - Page Sizing */}
                    <VStack alignItems="flex-start" spacing={3}>
                        <DTPageSizing
                            pageSize={pageSize}
                            setPageSize={(value) => {
                                setPageSize(Number(value));
                                setPageNumber(0); // Reset page number on size change
                            }}
                        />
                    </VStack>

                    {/* Right Side - Search Field */}
                    <HStack spacing={2} width={{ base: '100%', md: 'auto' }}>
                        <Text fontSize="sm" whiteSpace="nowrap" color={textColor}>Search:</Text>
                        <Input
                            size="sm"
                            placeholder="Reg No, Description..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPageNumber(0); // Reset page number on search
                            }}
                            maxW={{ base: 'full', sm: '250px' }}
                            flexGrow={1}
                        />
                    {/* <SearchInput 
                        searchText={searchTerm}
                        setSearchText={handleSearchChange}
                        size = "sm"
                        maxW={{base: 'full', sm: '250px'}}
                        flexGrow = {1}
                    /> */}
                    </HStack>
                </Flex>

                <DataTableContainer>
                    <DataTable>
                        <DThead>
                            <DTr>
                                <DTh>Registration Number</DTh>
                                {/* <DTH>Department Name</DTH> */}
                                <DTh>Vehicle Description</DTh>
                                <DTh>Purchase Date</DTh>
                                <DTh isNumeric>Deprecated Value</DTh>
                                <DTh isNumeric>Total Kms Logged</DTh>
                                <DTh>MVI Report</DTh>
                                <DTh>Case Pending</DTh>
                                <DTh>Actions</DTh>
                            </DTr>
                        </DThead>
                        <DTbody>
                            {/* Show fetching overlay */}
                            {isFetching && (
                                <DTr>
                                    <DTd colSpan={8} textAlign="center" py={4} position="relative">
                                        {/* Optional: Add overlay for better UX during refetch */}
                                        <Flex justify="center" align="center" position="absolute" inset={0}>
                                            <Spinner size="md" />
                                        </Flex>
                                    </DTd>
                                </DTr>
                            )}
                            {/* Show table rows (only when not fetching to avoid flashing) */}
                            {!isFetching && fetchedData.length > 0 ? (
                                fetchedData.map((row) => (
                                    <DTr key={row.applicationCode}>
                                        <DTd><Text fontWeight="medium" color="teal.600">{row?.registrationNo || 'N/A'}</Text></DTd>
                                        <DTd>{row.vehicleDescription || 'N/A'}</DTd>
                                        <DTd>{row.purchaseDate}</DTd>
                                        <DTd isNumeric>{row.depreciatedValue?.toLocaleString() ?? 'N/A'}</DTd>
                                        <DTd isNumeric>{row.totalKmsLogged?.toLocaleString() ?? 'N/A'}</DTd>
                                        <DTd>
                                            {/* MVI Report is always Yes for this table */}
                                            <Tag size="sm" colorScheme={'green'} variant="subtle">Yes</Tag>
                                        </DTd>
                                        <DTd>
                                            <Tag size="sm" colorScheme={row.anyCasePending ? 'orange' : 'blue'} variant="subtle">
                                                {row.anyCasePending ? 'Yes' : 'No'}
                                            </Tag>
                                        </DTd>
                                        <DTd>
                                            <HStack spacing={2}>
                                                {/* Call parent's function on click */}
                                                <Button size="xs" colorScheme="teal" variant="outline" onClick={() => onOpenModal(row, 'tender')}>
                                                    Tender
                                                </Button>
                                                
                                                <Button size="xs" colorScheme="red" variant="outline" onClick={() => onOpenModal(row, 'scrap')}>
                                                    Scrap
                                                </Button>
                                            </HStack>
                                        </DTd>
                                    </DTr>
                                ))
                            ) : null}
                            {/* Show no data message */}
                            {!isFetching && fetchedData.length === 0 && (
                                <DTr>
                                    <DTd colSpan={8} textAlign="center" color={textColor} py={6}>
                                        {debouncedSearchTerm ? 'No vehicles match your search.' : 'No vehicles pending action found.'}
                                    </DTd>
                                </DTr>
                            )}
                        </DTbody>
                    </DataTable>
                </DataTableContainer>

                {/* --- Pagination --- */}
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    mt={4}
                    gap={2}
                    flexWrap="wrap"
                >
                    {totalElements > 0 ? (
                        <>
                            <Text fontSize="sm" color={textColor}>
                                Showing {startIndex + 1} to {endIndex} of {totalElements} entries
                            </Text>
                            <DTPagination
                                pageNumber={currentPageNumber}
                                setPageNumber={setPageNumber}
                                totalPages={totalPages}
                                isDisabled={isFetching || isPreviousData} // Disable pagination while fetching or showing old data
                            />
                        </>
                    ) : (
                         !isFetching && <Text fontSize="sm" color={textColor}>No entries found</Text> // Only show if not fetching
                    )}
                </Flex>
             </>
        )}
    </Box>
  );
};

export default HeavyVehiclesTable;