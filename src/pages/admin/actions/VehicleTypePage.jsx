import React, { useState } from 'react';
import {
  Box,
} from '@chakra-ui/react';

import VehicleTypeTable from '../../tableData/VehicleTypeTable';

import VehicleTypeForm from '../dataInsertion/VehicleTypeForm';

const VehicleTypePage = () => 
{

  return (
    <Box mt={5}>

      <VehicleTypeForm />

      <VehicleTypeTable />
        
    
    </Box>
  );
};

export default VehicleTypePage;