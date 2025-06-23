import React, { useState } from 'react';
import {
  Box,
} from '@chakra-ui/react';

import DistrictTable from '../../tableData/DistrictTable';

import DistrictForm from '../dataInsertion/DistrictForm';

const DistrictPage = () => 
{

  return (
    <Box mt={5}>

      <DistrictForm />

        <DistrictTable />
        
    
    </Box>
  );
};

export default DistrictPage;