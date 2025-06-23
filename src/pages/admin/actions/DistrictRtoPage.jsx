import React, { useState } from 'react';
import {
  Box,
} from '@chakra-ui/react';

import DistrictRtoTable from '../../tableData/DistrictRtoTable';

import DistrictRtoForm from '../dataInsertion/DistrictRtoForm';

const DistrictRtoPage = () => 
{

  return (
    <Box mt={5}>

      <DistrictRtoForm />

      <DistrictRtoTable />
        
    
    </Box>
  );
};

export default DistrictRtoPage;