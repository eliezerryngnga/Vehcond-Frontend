import { useState } from "react";

import {
  Box,
  Button,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Divider,
  HStack,
  Select,
  Text,

} from "@chakra-ui/react";

import InputField from "../../components/core/formik/InputField";
import RadioGroup from "../../components/core/formik/RadioGroupField";
import SelectField from "../../components/core/formik/SelectField";
import TextAreaField from "../../components/core/formik/TextAreaField";

import { Form, Formik } from "formik";

import * as yup from "yup";

const steps = [
  { title: 'First', description: 'Office Records' },
  { title: 'Second', description: 'Vehicle Basic details' },
  { title: 'Third', description: 'Vehicle Usage And Maintenance History' },
];

// const validationSchema = [
//   yup.object({
//     step1Field: Yup.string().required("Step 1 field is required"),
//   }),

//   yup.object({
//     step2Field: yup.string().required("Step 2 field is required"),
//   }),

//   yup.object({
//     step3Field: yup.string().required("Step 3 field is required"),
//   }),
// ];

const VehicleRegistrationForm = () => {
  const { activeStep, nextStep, prevStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (

        <Box 
          mt={6} 
          p={10} 
          maxW="800px"
          mx="auto"
          bg="white" 
          borderRadius="lg" 
          boxShadow="md"
        >

          {/* <HStack>
          <Stepper index={activeStep} mb={4}>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon color="green.500" />}
                        incomplete={<StepNumber />}
                        active={<StepNumber color="blue.500" />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle fontSize="lg" fontWeight="semibold" color="gray.800">
                        {step.title}
                      </StepTitle>
                      <StepDescription color="gray.600">{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
            </Stepper>
            
            <Divider />
          </HStack> */}
            

            <Box> 

            </Box>
          {/* Navigation Buttons */}
          {/* <Box display="flex" justifyContent="space-between" mt={6}>
            <Button onClick={prevStep} isDisabled={activeStep === 0} colorScheme="blue">
              Previous
            </Button>
            <Button onClick={nextStep} isDisabled={activeStep === steps.length - 1} colorScheme="blue">
              Next
            </Button>
          </Box> */}

          {/* Step Content (Optional) */}
          {/* <Box mt={6} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            {activeStep === 0 && <p>Step 1 Content: Contact Info</p>}
            {activeStep === 1 && <p>Step 2 Content: Date & Time</p>}
            {activeStep === 2 && <p>Step 3 Content: Select Rooms</p>}
          </Box> */}
        </Box>
  );
};

export default VehicleRegistrationForm;