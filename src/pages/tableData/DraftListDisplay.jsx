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
  Tabs,
  TabList,
  Tab,
  list,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

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

import SearchInput from "../../components/core/SearchInput";

import { useFetchListDrafts, useFetchRejectedList } from '../../hooks/dataEntryQueries';

const DraftListDisplay = () => {

  const [ listType, setListType ] = useState('drafts');

  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const draftsQuery = useFetchListDrafts(pageNumber, pageSize, debouncedSearchTerm, {
    enabled: listType === 'drafts',
  })

  const rejectedQuery = useFetchRejectedList(pageNumber, pageSize, debouncedSearchTerm, {
    enabled: listType === 'rejected',
  })

  const { 
    data: response, 
    isLoading, 
    isError, 
    error,
    isFetching,
    isPreviousData
  } = listType === 'drafts' ? draftsQuery : rejectedQuery;
  
  const fetchedData = response?.data?.content ?? [];
  const totalPages = response?.data?.totalPages ?? 0;
  const totalElements = response?.data?.totalElements ?? 0;
  const currentPageNumber = response?.data?.number ?? 0;
  const currentPageSize = response?.data?.size ?? pageSize;

  const containerBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  const handleEditData = (applicationCode) => {
    if(applicationCode)
    {
      navigate(`/da/dataentryvehicle/edit/${applicationCode}`); 
    }
    return null;
  }

  const handleTabChange = (index) => {
    setListType(index === 0 ? 'drafts' : 'rejected');
    setPageNumber(0);
    setSearchTerm('');
  }


  if (isLoading) 
  {
    return (
      <Flex justify="center" align="center" height="200px" mt={5}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.500" size="xl" />
        <Text ml={4} fontSize="lg">Loading {listType}...</Text>
      </Flex>
    );
  }

  if (isError) { 
    return (
      <Alert status="error" mt={5} borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">Error Fetching { listType === 'drafts' ? 'Drafts' : 'Rejected Vehicles'}</Text>
          <Text>{error instanceof Error ? error.message : 'An unknown error occurred.'}</Text>
          <Text fontSize="sm">Please try refreshing the page or contact support.</Text>
        </Box>
      </Alert>
    );
  }

  const startIndex = currentPageNumber * currentPageSize;

  const endIndex = startIndex + fetchedData.length;

  const handleSearchChange = (newValue) =>
    {
      setSearchTerm(newValue);
      setPageNumber(0);
    };

  return (
    <Box p={{ base: 2, md: 4 }} mt={5} borderWidth="1px" borderRadius="md" bg={containerBg} shadow="sm">
      <Tabs onChange={handleTabChange} mb={4} variant="soft-rounded" colorScheme='teal'>
        <TabList>
          <Tab>Drafts</Tab>
          <Tab>Rejected</Tab>
        </TabList>
      </Tabs>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ base: 'stretch', md: 'center' }}
        mb={4}
        gap={4}
        flexWrap="wrap"
      >
        <VStack alignItems="flex-start" spacing={3}>
          <DTPageSizing
            pageSize={pageSize}
            setPageSize={(value) => 
              { 
                setPageSize(Number(value)); 
                setPageNumber(0); 
              }}
          />
        </VStack>

        {/* Right Side - Search Field */}
        <HStack spacing={2} width={{ base: '100%', md: 'auto' }}>
           <Text fontSize="sm" whiteSpace="nowrap" color={textColor}>Search:</Text>
           <SearchInput 
            searchText={searchTerm}
            setSearchText={handleSearchChange}
            size = "sm"
            maxW={{base: 'full', sm: '250px'}}
            flexGrow = {1}
           />
        </HStack>
      </Flex>


     
      <DataTableContainer> 
        <DataTable>
          <DThead>
            <DTr>
              <DTh>Reg. No</DTh>
              <DTh>Description</DTh>
              <DTh>Purchase Date</DTh>
              <DTh isNumeric>Dep. Value</DTh>
              <DTh isNumeric>Total Kms</DTh>
              <DTh>MVI Report</DTh>
              <DTh>Case Pending</DTh>
              <DTh>Actions</DTh>
            </DTr>
          </DThead>
          <DTbody>
            
            {isFetching && !isLoading && (
              <DTr>
                <DTd colSpan={8} textAlign="center" py={4}>
                  <Spinner size="md" />
                </DTd>
              </DTr>
            )}
            {!isFetching && fetchedData.length > 0 ? (
              fetchedData.map((row) => (
                <DTr key={row.applicationCode}>
                  <DTd><Text fontWeight="medium" color="teal.600">{row?.registrationNo || 'N/A'}</Text></DTd>
                  <DTd>{row.vehicleDescription || 'N/A'}</DTd>
                  <DTd>{row.purchaseDate}</DTd>
                  <DTd isNumeric>{row.depreciatedValue?.toLocaleString() ?? 'N/A'}</DTd>
                  <DTd isNumeric>{row.totalKmsLogged?.toLocaleString() ?? 'N/A'}</DTd>
                  <DTd>
                    <Tag size="sm" colorScheme={row.mviReportsAvailable ? 'green' : 'red'} variant="outline">
                      {row.mviReportsAvailable ? 'Yes' : 'No'}
                    </Tag>
                  </DTd>
                  <DTd>
                    <Tag size="sm" colorScheme={row.anyCasePending ? 'red' : 'green'} variant="outline">
                      {row.anyCasePending ? 'Yes' : 'No'}
                    </Tag>
                  </DTd>
                   {/* <DTd>
                     <Tag size="sm" variant='subtle' colorScheme={row.status === 'DRAFT' ? 'green' : 'blue'}>
                        {row.status === 'DRAFT' ? 'Draft' : 'Returned'}
                    </Tag>
                  </DTd> */}
                  <DTd>
                    <Button 
                      size="sm" 
                      colorScheme="yellow" 
                      variant="outline" 
                      width="full"
                      onClick={() => handleEditData(row.applicationCode)}
                    >
                      Edit
                    </Button>
                  </DTd>
                </DTr>
              ))
            ) : null}
            
            {!isFetching && fetchedData.length === 0 && (
              <DTr>
                <DTd colSpan={8} textAlign="center" color={textColor} py={6}>
                  {debouncedSearchTerm ? 'No drafts match your search.' : 'No drafts available.'}
                </DTd>
              </DTr>
            )}
              
          </DTbody>
        </DataTable>
      </DataTableContainer>

      {/* --- Pagination (Keep as is) --- */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          mt={4}
          gap={2}
          flexWrap="wrap"
        >
          {totalElements > 0 ?  (
            <>
              <Text fontSize="sm" color={textColor}>
                Showing {startIndex + 1} to {endIndex} of {totalElements} entries
              </Text>

             <DTPagination
                 
                 pageNumber={currentPageNumber} 
                 setPageNumber={setPageNumber} 
                 totalPages={totalPages}

                 isDisabled={isFetching || isPreviousData}
             />
             </>
         ) : (
             <Text fontSize="sm" color={textColor}>No entries found</Text>
         )}
      </Flex>
      {/* --- End Pagination --- */}

    </Box>
  );
};

export default DraftListDisplay;