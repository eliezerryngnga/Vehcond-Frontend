import React, { useState } from 'react';
import {
  Box,
} from '@chakra-ui/react';

import DepartmentTable from '../../tableData/DepartmentTable';

import DepartmentForm from '../dataInsertion/DepartmentForm';

const DepartmentPage = () => 
{

  return (
    <Box mt={5}>

      <DepartmentForm />

        <DepartmentTable />
        
    
    </Box>
  );
};

export default DepartmentPage;