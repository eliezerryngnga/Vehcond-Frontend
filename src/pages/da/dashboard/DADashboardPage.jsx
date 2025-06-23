import React, { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Container, Box } from "@chakra-ui/react";

import TableContainer from "../../../components/core/Table";

import DataTableContainer from "../../../components/core/DataTable";
//import DAPendingApplicationTableWrapper from "./DAPendingApplicationTableWrapper";

const DADashboardPage = ({profile}) => {
  // States
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Queries
  //const applicationsQuery = useFetchBookingApplications(pageNumber, pageSize);

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
  );
};

export default DADashboardPage;
