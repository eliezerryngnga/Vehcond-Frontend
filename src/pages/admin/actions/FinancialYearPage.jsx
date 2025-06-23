import React from 'react'

import
{
  Box,
} from '@chakra-ui/react';

import FinancialYearForm from '../dataInsertion/FinancialYearForm';
import FinancialYearTable from '../../tableData/FinancialYearTable';

const FinancialYearPage = () => {
  return (
    <Box mt={5}
    >

      <FinancialYearForm />


      <FinancialYearTable />

     
    </Box>
  )
}

export default FinancialYearPage;