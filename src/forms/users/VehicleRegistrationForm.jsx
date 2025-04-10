import {
  useEffect,
  useState
} from "react";

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
  Flex,
  useToast,
} from "@chakra-ui/react";

import { Formik, Form } from "formik";
import * as yup from "yup";

import OfficeRecords from "../../pages/vehicleDataEntry/OfficeRecords";
import VehicleInformation from "../../pages/vehicleDataEntry/VehicleInformation";
import VehicleCondem from "../../pages/vehicleDataEntry/VehicleCondem";

import { useSendToDraft, useFetchDepartment } from "../../hooks/dataEntryQueries";

const validationSchemaStep_1 = yup.object({
  // Step 1
  registeredDistrict: yup
    .string()
    .required("District Name cannot be blank"),

    rtoNo: yup
    .string()
    .required("RTO No. cannot be blank"),

    vehicleRegistrationNumber: yup
    .string()
    .matches(/^[A-Z]{2,}\s*\d{1,4}$/, "Invalid format (e.g., AA 1234 or B 1234)")
    .required("Cannot be blank"),

    financialYearCode: yup
    .string() 
    .required("Financial Year cannot be blank"),

    departmentCode: yup
    .string(),

    officeName: yup
    .string()
    .required("Office Name cannot be blank"),

    officerDesignation: yup
    .string()
    .required("Office Designation cannot be blank"),

  premises: yup
    .string()
    .required("Premises cannot be blank"),

  address1: yup
    .string(),

  address2: yup
    .string(),

    directorateLetterNo: yup
    .string(),

    directorateLetterDate: yup
    .date()
    .nullable(true),

    forwardingLetterNo: yup
    .string()
    .required("Govt. Forwarding Letter No. cannot be blank"),

    govForwardingLetterDate: yup
    .date()
    .required("Govt. Forwarding Letter Date cannot be blank")
    .typeError("Invalid date"),
});

const validationSchemaStep_2 = yup.object({
  vehicletypecode: yup
    .string()
    .required("Vehicle Category cannot be blank"),

    vehicledescription: yup
    .string()
    .required("Description cannot be blank"),

    vehiclemanufacturercode: yup
    .string()
    .required("Manufacturer cannot be blank"),

    engineno: yup
    .string()
    .required("Engine No. cannot be blank"),

    chassisno: yup
    .string()
    .required("Chassis No. cannot be blank"),

    manufactureyear: yup
    .number()
    .required("Year of Manufacture cannot be blank")
    .typeError("Must be a number")
    .integer("Must be a whole number")
    .min(1900, "Year seems too old")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"), // Allow current year + 1 for upcoming models

    purchasedate: yup
    .date()
    .required("Date of Purchase cannot be blank")
    .typeError("Invalid date"),

    vehicleprice: yup
    .number()
    .required("Purchase Price cannot be blank")
    .typeError("Must be a number")
    .positive("Price must be positive"),
});

const validationSchemaStep_3 = yup.object({

  totalkms: yup
    .number()
    .required("Total Km cannot be blank")
    .typeError("Must be a number")
    .min(0, "Cannot be negative"),

    depreciatedamount: yup
    .number()
    .required("Depreciated Value cannot be blank")
    .typeError("Must be a number")
    .min(0, "Cannot be negative"),

    improvements: yup
    .string(),

    expenses: yup
    .number()
    .required("Total POL Expenditure cannot be blank")
    .typeError("Must be a number")
    .min(0, "Cannot be negative"),

    repairexpenses: yup
    .number()
    .required("Total Maintenance Expenditure cannot be blank")
    .typeError("Must be a number")
    .min(0, "Cannot be negative"),

    repairslastsixmonths: yup
    .string()
    .required("Repairs Before Condemnation cannot be blank"),

  whetheraccident: yup
    .string()
    .required("Specify if vehicle had an accident"),

  accidentcaseresolved: yup
    .string(),

  comments: yup
    .string()
    .required("Department Officer Comments cannot be blank"),

  mvireportavailable: yup
    .string()
    .required("MVI Report upload cannot be blank"),
});

const yupErrorsToFormik = (yupError) => {
  const errors = {};
  if (yupError.inner) {
    yupError.inner.forEach((error) => {
      if (!errors[error.path]) {
        errors[error.path] = error.message;
      }
    });
  }
  return errors;
};


const VehicleRegistrationForm = () => {
  const [step, setStep] = useState(0);
  const toast = useToast();
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const { mutate: sendToDraftMutate, isLoading: isDraftSending } = useSendToDraft();

  const { data: departmentData, isSuccess: isDepartmentSuccess } = useFetchDepartment();

  const baseSteps = [
    { title: "Step 1", description: "Office Details", schema: validationSchemaStep_1 },
    { title: "Step 2", description: "Vehicle Information", schema: validationSchemaStep_2 },
    { title: "Step 3", description: "Vehicle Condemnation", schema: validationSchemaStep_3 },
  ];

  const renderContent = (currentStep, formikProps) => {
    switch (currentStep) {
      case 0:
        return <OfficeRecords {...formikProps}
        departmentName={departmentData?.data?.[0]?.departmentName || ''} />;
      case 1:
        return <VehicleInformation {...formikProps} />;
      case 2:
        return <VehicleCondem {...formikProps} />;
      default:
        return null;
    }
  };

  const baseInitialValues = {
    // Step 1
    registeredDistrict: "", 
    rtoNo: "",
    vehicleRegistrationNumber: "",
    financialYearCode: "", 
    departmentCode: "", 
    officeName: "",
    officerDesignation: "",
    premises: "",
    address1: "",
    address2: "",
    directorateLetterNo: "",
    directorateLetterDate: null,
    forwardingLetterNo: '',
    govForwardingLetterDate: null,
    // Step 2
    vehicletypecode: "",
    vehicledescription: "",
    vehiclemanufacturercode: "",
    engineno: "",
    chassisno: "",
    manufactureyear: '',
    purchasedate: '',
    vehicleprice: '',
    // Step 3
    totalkms: "",
    depreciatedamount: "",
    improvements: "",
    expenses: "",
    repairexpenses: "",
    repairslastsixmonths: "",
    whetheraccident: "",
    accidentcaseresolved: "",
    comments: "",
    mvireportavailable: "",
    partsCondition: {}, // Initialize for PartsCondition
    battery: "",
    tyres: "",
    accidentdamage: "",
    mviprice: "",
    mviremarks: "",
    remarks: "", // Added for the backend 'remarks' field
  };

  const handleNext = async (values, setErrors, setTouched) => {
    const currentSchema = baseSteps[step].schema;
    try {
      await currentSchema.validate(values, { abortEarly: false });
      setErrors({});
      const currentStepFields = Object.keys(currentSchema.fields);
      const touchedUpdates = currentStepFields.reduce((acc, field) => ({ ...acc, [field]: false }), {});
      setTouched(touchedUpdates, false);

      if (step < baseSteps.length - 1) {
        setStep(step + 1);
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const formikErrors = yupErrorsToFormik(err);
        setErrors(formikErrors);
        setTouched(
          Object.keys(formikErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
          false
        );
        toast({
          title: "Validation Error.",
          description: "Please check the highlighted fields.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error("Unexpected error during validation:", err);
        toast({
          title: "An Error Occurred.",
          description: "Something went wrong during validation.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = (values) => {

    const {
      address1,
      address2,
      directorateLetterNo,
      directorateLetterDate,
      forwardingLetterNo,
      govForwardingLetterDate,
      rtoNo, 
      vehicleRegistrationNumber,
      partsCondition,
      ...restValues
    } = values;
  
    // const locations = `${address1 || ''}|${address2 || ''}`;
  
    // const formattedDirectorateDate = directorateLetterDate ? new Date(directorateLetterDate).toISOString().slice(0,10) : '';
  
    // const directorateLetterNodate = `${directorateLetterNo || ''}|${formattedDirectorateDate}`;
  
    // const formattedGovtDate = govForwardingLetterDate ? new Date(govForwardingLetterDate).toISOString().slice(0, 10) : '';
  
    // const govtLetterNoDate = `${forwardingLetterNo || ''}|${formattedGovtDate}`;
  
    // // Combine rtoNo and vehicleRegistrationNumber for registrationNo
    // const registrationNo = `${rtoNo || ''}${vehicleRegistrationNumber ? vehicleRegistrationNumber.toUpperCase() : ''}`;
  
    const vehiclePartsConditionDraft = Object.keys(partsCondition || {}).map(partCodeStr => ({
      vehiclepartcode: parseInt(partCodeStr, 10),
      condition: partsCondition[partCodeStr],
    }));

    const updatedValues = {
      
      // locations: locations,
      // directorateLetterNodate: directorateLetterNodate,
      // govtLetterNoDate: govtLetterNoDate,
      // registrationNo: registrationNo,
      address1: address1,
      address2: address2,
      directorateLetterNo: directorateLetterNo,
      directorateLetterDate: directorateLetterDate,
      forwardingLetterNo: forwardingLetterNo,
      govForwardingLetterDate: govForwardingLetterDate,
      rtoNo: rtoNo,
      vehicleRegistrationNumber: vehicleRegistrationNumber,
      vehiclePartsDraft: vehiclePartsConditionDraft,
      ...restValues,
    };
    
    console.log("Updated Values Object:",updatedValues);

    console.log("JSON Payload:", JSON.stringify(updatedValues, null, 2));
  
    // console.log(values);
  
    setIsSubmittingDraft(true);
    sendToDraftMutate(updatedValues, {
      onSuccess: (data) => {
        setIsSubmittingDraft(false);
        toast({
          title: "Draft Saved.",
          description: `Draft saved with Application Code: ${data?.applicationCode || 'N/A'}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        setIsSubmittingDraft(false);
        console.error("Error saving draft:", error);
        toast({
          title: "Failed to Save Draft.",
          description: error?.message || "Something went wrong while saving the draft.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  const handleFinalSubmit = (values) => {
    // setIsSubmittingFinal(true);
    console.log("Final submit:", values);
    // Implement your API call for final submission here using fetch or another hook
    // fetch('/draft/final-submit', { // Replace with your actual final submit endpoint
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(values),
    // })
    // .then(response => {
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //   return response.text(); // Or response.json()
    // })
    // .then(data => {
    //   setIsSubmittingFinal(false);
    //   toast({
    //     title: "Final Submission Successful.",
    //     description: data || "Vehicle data submitted successfully.",
    //     status: "success",
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   // Optionally redirect or reset the form
    // })
    // .catch((error) => {
    //   setIsSubmittingFinal(false);
    //   console.error("Error submitting data:", error);
    //   toast({
    //     title: "Final Submission Failed.",
    //     description: error.message || "Something went wrong during final submission.",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    // });
  };

  const [currentInitialValues, setCurrentInitialValues] = useState(baseInitialValues);

  useEffect(() => {
    if (isDepartmentSuccess && departmentData?.data?.[0]?.departmentCode) {
        setCurrentInitialValues(prevValues => ({
            ...prevValues,
            departmentCode: departmentData.data[0].departmentCode,
        }));
    } else {
        setCurrentInitialValues(baseInitialValues);
    }
}, [isDepartmentSuccess, departmentData]);

  return (
    <Box bg="paper" shadow="md" w="auto" p={6} m={4} borderRadius="md">
      <Formik
        initialValues={currentInitialValues}
        enableReinitialize={true}
      >
        {(formikProps) => (
          <Form>
            <Stack spacing={6}>
              <Stepper index={step} colorScheme="teal">
                {baseSteps.map((s, index) => (
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

              {/* Fields components */}
              <Box p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor="gray.200"
              >
                {renderContent(step, formikProps)}
              </Box>

              <Flex mt={6} justifyContent="space-between">
                <Button onClick={handlePrev} isDisabled={step === 0} variant="outline">Previous</Button>
                <Flex>
                  {step < baseSteps.length - 1 ? (
                    <Button onClick={() => handleNext(formikProps.values, formikProps.setErrors, formikProps.setTouched)}>
                      Next
                    </Button>
                  ) : (
                    <>
                                            <Button
                        mr={2}
                        onClick={() => handleSaveDraft(formikProps.values)}
                        colorScheme="blue"
                        variant="outline"
                        isLoading={isSubmittingDraft || isDraftSending}
                        loadingText="Saving Draft..."
                        isDisabled={isSubmittingDraft || isDraftSending}
                      >
                        Save As Draft
                      </Button>
                      <Button
                        onClick={() => handleFinalSubmit(formikProps.values)}
                        colorScheme="green"
                        isLoading={isSubmittingFinal}
                        loadingText="Submitting..."
                        isDisabled={isSubmittingFinal}
                      >
                        Final Submit
                      </Button>
                    </>
                  )}
                </Flex>
              </Flex>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default VehicleRegistrationForm;