import React, { useState } from 'react';
import {
  Box,
  Divider,
  useToast, 
  HStack,
  Button,
} from '@chakra-ui/react';


// Import the child table components
import CirculationListTable from '../Msi_tableData/CirculationListTable';

// Import mutation hooks
// import { useApproveVehicle, useRejectVehicle } from '../../../hooks/transportActions';

const CirculationList = () => {
  const [search, setSearch] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
  
    const filterValues = { search, year, month};
  
    const toast = useToast();
    // const { 
    //   mutate: exportReport,
      // isPending: isExporting,
    // } = useFetchApprovedVehicleReport();
  
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

  return (
    <Box mt={5}>
        <CirculationListTable
          filterValues={filterValues}
          setSearch={setSearch}
          setYear={setYear}
          setMonth={setMonth}
        />
      <HStack spacing={5} mt={4} justifyContent="center">
              <Button 
                size="md" 
                colorScheme="red" 
                onClick={() => handleExport('pdf')}
                // isLoading={isExporting}
                loadingText="Generating..."
              >
                Export PDF
              </Button>
              <Button 
                size="md"  
                colorScheme="green" 
                onClick={() => handleExport('excel')}
                // isLoading={isExporting}
                loadingText="Generating..."
              >
                Export Excel
              </Button>
            </HStack>  

    </Box>
  );
};

export default CirculationList;