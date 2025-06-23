import React, { useState } from 'react';
import {
  Box,
} from '@chakra-ui/react';

import VehiclePartTable from '../../tableData/VehiclePartTable';

import VehiclePartForm from '../dataInsertion/VehiclePartForm';

const VehiclePartPage = () => 
{

  return (
    <Box mt={5}>

      <VehiclePartForm />

      <VehiclePartTable />
        
    
    </Box>
  );
};

export default VehiclePartPage;