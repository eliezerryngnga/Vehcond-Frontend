import { 
  Stepper, 
  Step, 
  StepIndicator, 
  StepSeparator, 
  StepTitle, 
  StepDescription, 
  StepIcon, 
  StepNumber, 
  StepStatus, 
  Button,
  Box,
  Stack,
} from "@chakra-ui/react";

import OfficeRecords from "./OfficeRecords";
import  VehicleInformation from "./VehicleInformation";
import VehicleCondem from "./VehicleCondem";

import { useState } from "react";

const VehicleRegistrationForm = () => {
  const [step, setStep] = useState(0);

    const steps = [
        { title: "Step 1", description: "This is step 1" },
        { title: "Step 2", description: "This is step 2" },
        { title: "Step 3", description: "This is step 3" },
    ];

    const handleNext = () => {
        setStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrev = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const renderContent = (currentStep) => {
      switch(currentStep)
      {
        case 0:
          return <OfficeRecords />
        case 1:
          return <VehicleInformation />
        case 2:
          return <VehicleCondem />
        default:
          return 
      }
    }

    return (
          <Box
            bg="paper "
            w="auto"
            p={6} 
            m={4} 
            borderRadius="md"
          >
            <Stack> 
            <Stepper index={step}>
                {steps.map((s, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                            />
                        </StepIndicator>
                          <Box flexShrink={0}>
                            <StepTitle>{s.title}</StepTitle>
                            <StepDescription>{s.description}</StepDescription>
                          </Box>
                        <StepSeparator />
                    </Step>
                ))}

                
                    
            </Stepper>

                <Box mt={4}>{renderContent(step)}</Box>

                <Box>
                  <Button onClick={handlePrev} isDisabled={step === 0}>
                      Previous
                  </Button>
                  <Button onClick={handleNext} isDisabled={step === steps.length - 1}>
                    Save & Next
                  </Button>
                </Box>
            </Stack>
          </Box>
    );
};


export default VehicleRegistrationForm;