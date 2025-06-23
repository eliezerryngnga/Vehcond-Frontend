import React, { useState } from 'react';
import {
  Box,
  Divider,
  useToast, 
  HStack,
  Button,
} from '@chakra-ui/react';

import ApprovedTable from '../Msi_tableData/ApprovedTable';

import { useFetchApprovedVehicleReport } from '../../hooks/reportQueries';
// import { useFetchUsersProfile } from '../../hooks/userQueries';

const ApprovedVehicles = () => {

  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const filterValues = { search, year, month};

  const toast = useToast();
  const { 
    mutate: exportReport,
    isPending: isExporting,
  } = useFetchApprovedVehicleReport();

  // const { data: profileData, isLoading: isLoadingProfile} = useFetchUsersProfile();

  // const profile = profileData?.data;

  const handleExport = (format) => {
    if(!year || !month)
    {
      toast({
        title: "Selection Required",
        description: "Please select both a year and a month to generate a report.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    exportReport({ year, month, format,});
  };

  // const canExport = profile && (profile.role === 'ADMIN' || profile.role === 'TD');

  return (
    <Box mt={5}>
      <ApprovedTable
        filterValues={filterValues}
        setSearch={setSearch}
        setYear={setYear}
        setMonth={setMonth}
      />

      {/* Export buttons are at the top level */}
      {/* {canExport && ( */}
        <HStack spacing={5} mt={4} justifyContent="center">
        <Button 
          size="md" 
          colorScheme="red" 
          onClick={() => handleExport('pdf')}
          isLoading={isExporting}
          loadingText="Generating..."
        >
          Export PDF
        </Button>
        <Button 
          size="md"  
          colorScheme="green" 
          onClick={() => handleExport('excel')}
          isLoading={isExporting}
          loadingText="Generating..."
        >
          Export Excel
        </Button>
      </HStack>  
      {/* )} */}
      
    </Box>
  );
};

export default ApprovedVehicles;