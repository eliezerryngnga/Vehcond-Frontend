import React, { useState } from 'react';
import {
  Box,
} from '@chakra-ui/react';

import ProcessTable from '../../tableData/ProcessTable';

import ProcessForm from '../dataInsertion/ProcessForm';

const ProcessPage = () => 
{

  return (
    <Box mt={5}>

      <ProcessForm />

      <ProcessTable />
        
    
    </Box>
  );
};

export default ProcessPage;