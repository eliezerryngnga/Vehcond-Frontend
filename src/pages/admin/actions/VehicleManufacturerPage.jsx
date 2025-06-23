import React, { useState } from 'react';
import {
  Box,
} from '@chakra-ui/react';

import VehicleManufacturerTable from '../../tableData/VehicleManufacturerTable';

import VehicleManufacturerForm from '../dataInsertion/VehicleManufacturerForm';

const VehicleManufacturerPage = () => 
{

  return (
    <Box mt={5}>

      <VehicleManufacturerForm />

      <VehicleManufacturerTable />
        
    
    </Box>
  );
};

export default VehicleManufacturerPage;