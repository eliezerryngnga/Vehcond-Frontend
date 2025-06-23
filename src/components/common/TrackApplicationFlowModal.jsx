import React from "react";
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  Tooltip,
  useSteps,
} from "@chakra-ui/react";
import { useFetchApplicationHistoryByAppNo } from "../../hooks/allApplicationsQueries";
import dayjs from "dayjs";

const HistoryFlow = ({ history }) => {
  // Hooks
  const { activeStep } = useSteps({
    index: history?.flow?.length,
    count: history?.flow?.length,
  });

  return (
    <Stepper
      index={activeStep}
      colorScheme="red"
      orientation="vertical"
      h={`${history?.flow?.length * 60}px`}
      gap={0}
    >
      {history?.flow?.map((row, index) => (
        <Tooltip
          key={index}
          label={`${row?.remarks || "No Remarks"}, ${dayjs(
            row?.timstamp
          ).format("DD MMM YYYY, hh:mm A")}`}
        >
          <Step>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{row?.action}</StepTitle>
              <StepDescription>
                {row?.role}: {row?.username}
              </StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        </Tooltip>
      ))}
    </Stepper>
  );
};

const TrackApplicationFlowModal = ({ rowState, isOpen, onClose }) => {
  // Queries
  const historyQuery = useFetchApplicationHistoryByAppNo(rowState?.appNo);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            Application Flow
          </ModalHeader>
          <ModalBody as={Stack} spacing={4}>
            <Stack
              bg="onPaper"
              border="1px"
              borderColor="border"
              rounded="md"
              p={4}
            >
              <SimpleGrid columns={2}>
                <Text color="body">Status:</Text>
                <Text fontWeight="bold">
                  {historyQuery?.data?.data?.status}
                </Text>
              </SimpleGrid>
              <SimpleGrid columns={2}>
                <Text color="body">Name:</Text>
                <Text fontWeight="bold">{historyQuery?.data?.data?.name}</Text>
              </SimpleGrid>
              <SimpleGrid columns={2}>
                <Text color="body">Designation:</Text>
                <Text fontWeight="bold">
                  {historyQuery?.data?.data?.designation}
                </Text>
              </SimpleGrid>
              <SimpleGrid columns={2}>
                <Text color="body">Office:</Text>
                <Text fontWeight="bold">
                  {historyQuery?.data?.data?.office}
                </Text>
              </SimpleGrid>
              <SimpleGrid columns={2}>
                <Text color="body">Scale of Pay:</Text>
                <Text fontWeight="bold">
                  &#8377;{historyQuery?.data?.data?.scaleOfPay}
                </Text>
              </SimpleGrid>
              <SimpleGrid columns={2}>
                <Text color="body">Pending With:</Text>
                <Text fontWeight="bold">
                  {historyQuery?.data?.data?.pendingWith}
                </Text>
              </SimpleGrid>
            </Stack>

            {/* <Accordion>
              {historyQuery?.data?.data?.flow?.map((row, index) => (
                <AccordionItem key={index}>
                  <AccordionButton
                  // _expanded={{ bg: "tomato", color: "white" }}
                  >
                    <Box as="span" flex="1" textAlign="left">
                      {index + 1}. {row?.role} - {row?.action}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel as={Stack} spacing={0}>
                    <Text>Username: {row?.username}</Text>
                    <Text>Remarks: {row?.remarks || "-"}</Text>
                    <Text>
                      Timestamp:{" "}
                      {dayjs(row?.timstamp).format("DD MMM YYYY, hh:mm A")}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion> */}

            {historyQuery?.data?.data?.flow?.length && (
              <HistoryFlow history={historyQuery?.data?.data} />
            )}

            {/* <Stepper index={activeStep} orientation="vertical" gap={4}>
              {historyQuery?.data?.data?.flow?.map((row, index) => (
                <Tooltip
                  key={index}
                  label={`${row?.remarks || "No Remarks"}, ${dayjs(
                    row?.timstamp
                  ).format("DD MMM YYYY, hh:mm A")}`}
                >
                  <Step>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle>{row?.action}</StepTitle>
                      <StepDescription>
                        {row?.role}: {row?.username}
                      </StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                </Tooltip>
              ))}
            </Stepper> */}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default TrackApplicationFlowModal;
