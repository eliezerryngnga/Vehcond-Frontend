import React from 'react'

import { Box, Container } from '@chakra-ui/react'
import Main from '../../../components/core/semantics/Main'
import Section from '../../../components/core/semantics/Section'
import DataTableContainer from '../../../components/core/DataTable'
import TableContainer from '../../../components/core/Table'

const TDDashboard = () => {
  return (
    <Main 
    display="flex"
    flexDirection="row"
    minH="100vh"
    
    >
      <Box display="flex" flexGrow={1} >

        {/* <UserSidebar profile={profile} /> */}

      <Section flexGrow={1} >
        <Container minW="full">
          {/*<DAPendingApplicationTableWrapper
            query={applicationsQuery}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />*/}
          <DataTableContainer />

          <Box bg={"blue.50"}>
            <TableContainer bg="black" />
          </Box>
        </Container>
      </Section>
      </Box>
    </Main>
  )
}

export default TDDashboard
