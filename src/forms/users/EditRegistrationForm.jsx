import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
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
  Spinner,
  Text,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as yup from "yup";

import OfficeRecords from "../../pages/vehicleDataEntry/OfficeRecords";
import VehicleInformation from "../../pages/vehicleDataEntry/VehicleInformation";
import VehicleCondem from "../../pages/vehicleDataEntry/VehicleCondem";

import {
  useSendToDraft,
  useFetchDepartment,
  useSendToFinal,
  useFetchEditVehicle, // Your hook for fetching data to edit
} from "../../hooks/dataEntryQueries";

// --- Validation Schemas (Keep as they are) ---
const validationSchemaStep_1 = yup.object({
  registeredDistrict: yup.string().required("District Name cannot be blank"),
  rtoNo: yup.string().required("RTO No. cannot be blank"),
  vehicleRegistrationNumber: yup.string().matches(/^[A-Z]{0,2}\s*\d{1,4}$/, "Invalid format (e.g., AA 1234 or B 1234)").required("Cannot be blank"),
  financialYearCode: yup.string().required("Financial Year cannot be blank"),
  departmentCode: yup.string(),
  officeName: yup.string().required("Office Name cannot be blank"),
  officerDesignation: yup.string().required("Office Designation cannot be blank"),
  premises: yup.string().required("Premises cannot be blank"),
  address1: yup.string().nullable(), // Allow null for optional text areas
  address2: yup.string().nullable(),
  directorateLetterNo: yup.string().nullable(),
  directorateLetterDate: yup.date().nullable(true),
  forwardingLetterNo: yup.string().required("Govt. Forwarding Letter No. cannot be blank"),
  govForwardingLetterDate: yup.date().required("Govt. Forwarding Letter Date cannot be blank").typeError("Invalid date"),
});

const validationSchemaStep_2 = yup.object({
  vehicletypecode: yup.string().required("Vehicle Category cannot be blank"),
  vehicledescription: yup.string().required("Description cannot be blank"),
  vehiclemanufacturercode: yup.string().required("Manufacturer cannot be blank"),
  engineno: yup.string().required("Engine No. cannot be blank"),
  chassisno: yup.string().required("Chassis No. cannot be blank"),
  manufactureyear: yup.number().required("Year of Manufacture cannot be blank").typeError("Must be a number").integer("Must be a whole number").min(1900, "Year seems too old").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  purchasedate: yup.date().required("Date of Purchase cannot be blank").typeError("Invalid date"),
  vehicleprice: yup.number().required("Purchase Price cannot be blank").typeError("Must be a number").positive("Price must be positive"),
});

const validationSchemaStep_3 = yup.object({
  totalkms: yup.number().required("Total Km cannot be blank").typeError("Must be a number").min(0, "Cannot be negative"),
  depreciatedamount: yup.number().required("Depreciated Value cannot be blank").typeError("Must be a number").min(0, "Cannot be negative"),
  improvements: yup.string().nullable(),
  expenses: yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(), // Made nullable, adjust if strictly required
  repairexpenses: yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(), // Made nullable
  repairslastsixmonths: yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(), // Made nullable
  whetheraccident: yup.string().required("Specify if vehicle had an accident"),
  accidentcaseresolved: yup.string().when('whetheraccident', {
    is: (val) => val === 'Y',
    then: (schema) => schema.required("Specify if accident case is resolved"),
    otherwise: (schema) => schema.nullable(),
  }),
  comments: yup.string().required("Department Officer Comments cannot be blank"),
  mvireportavailable: yup.string().required("MVI Report upload cannot be blank"),
  // Conditional MVI fields validation
  battery: yup.string().when('mvireportavailable', {
    is: 'Y', then: (schema) => schema.required("Battery condition is required when MVI report is available"),
    otherwise: (schema) => schema.nullable()
  }),
  tyres: yup.string().when('mvireportavailable', {
    is: 'Y', then: (schema) => schema.required("Tyres condition is required when MVI report is available"),
    otherwise: (schema) => schema.nullable()
  }),
  accidentdamage: yup.string().when('mvireportavailable', {
    is: 'Y', then: (schema) => schema.required("Accident damage details are required when MVI report is available"),
    otherwise: (schema) => schema.nullable()
  }),
  mviprice: yup.number().when('mvireportavailable', {
    is: 'Y', then: (schema) => schema.typeError("Must be a number").min(0,"Cannot be negative").required("MVI price is required"),
    otherwise: (schema) => schema.nullable()
  }),
  mviremarks: yup.string().when('mvireportavailable', {
    is: 'Y', then: (schema) => schema.required("MVI remarks are required"),
    otherwise: (schema) => schema.nullable()
  }),
  // partsCondition might need more complex validation if its sub-fields are required conditionally
});
// --- End Validation Schemas ---

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
  const navigate = useNavigate(); // For navigation after submit
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);

  const { mutate: sendToDraftMutate, isLoading: isDraftSending } = useSendToDraft();
  const { mutate: sendToFinalMutate, isLoading: isFinalSending } = useSendToFinal();
  const { data: departmentData, isSuccess: isDepartmentSuccess, isLoading: isLoadingDepartment } = useFetchDepartment(); // Added isLoadingDepartment
  const { applicationCode: routeApplicationCode } = useParams();
  const isEditMode = !!routeApplicationCode;

  const {
    data: rawEditVehicleData, // Renamed to avoid confusion with editVehicleData.data
    isLoading: isLoadingEditVehicle,
    isError: isErrorEditVehicle,
    error: editVehicleError,
    isSuccess: isEditVehicleSuccess,
  } = useFetchEditVehicle(routeApplicationCode);

  const baseSteps = [
    { title: "Step 1", description: "Office Details", schema: validationSchemaStep_1 },
    { title: "Step 2", description: "Vehicle Information", schema: validationSchemaStep_2 },
    { title: "Step 3", description: "Vehicle Condemnation", schema: validationSchemaStep_3 },
  ];

  const renderContent = (currentStep, formikProps) => {
    let departmentNameForDisplay = 'Loading Department...';
    if (!isLoadingDepartment) {
        if (isEditMode && formikProps.values.departmentCode) {
            const dept = departmentData?.data?.find(d => String(d.departmentCode) === String(formikProps.values.departmentCode));
            departmentNameForDisplay = dept ? dept.departmentName : 'Unknown Department';
        } else if (!isEditMode && departmentData?.data?.[0]?.departmentName) {

            departmentNameForDisplay = departmentData.data[0].departmentName;
        } else {
            departmentNameForDisplay = 'N/A';
        }
    }


    switch (currentStep) {
      case 0:
        return <OfficeRecords {...formikProps} departmentName={departmentNameForDisplay} />;
      case 1:
        return <VehicleInformation {...formikProps} />;
      case 2:
        return <VehicleCondem {...formikProps} />;
      default:
        return null;
    }
  };

  const baseInitialValues = {
    applicationCode: null,
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
    forwardingLetterNo: "",
    govForwardingLetterDate: null,
    vehicletypecode: "",
    vehicledescription: "",
    vehiclemanufacturercode: "",
    engineno: "",
    chassisno: "",
    manufactureyear: "",
    purchasedate: null,
    vehicleprice: "",
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
    partsCondition: {},
    battery: "",
    tyres: "",
    accidentdamage: "",
    mviprice: "",
    mviremarks: "",
    remarks: "",
  };

  const [currentInitialValues, setCurrentInitialValues] = useState(baseInitialValues);
    // console.log("Render - currentInitialValues STATE:", JSON.stringify(currentInitialValues, null, 2));


  useEffect(() => {
    // console.log("useEffect triggered. isEditMode:", isEditMode, "isLoadingEditVehicle:", isLoadingEditVehicle, "isEditVehicleSuccess:", isEditVehicleSuccess, "isLoadingDepartment:", isLoadingDepartment, "isDepartmentSuccess:", isDepartmentSuccess);

    if (isEditMode) {
        if (isLoadingEditVehicle || isLoadingDepartment) { // Wait for both if department name relies on departmentData
            // console.log("useEffect - Edit Mode: Waiting for data (vehicle or department).");
            return; // Don't proceed if still loading critical data for edit mode
        }

        if (isEditVehicleSuccess && rawEditVehicleData?.data) {
            const fetchedData = rawEditVehicleData.data;
            // console.log("useEffect - Edit Mode: Fetched Data:", JSON.stringify(fetchedData, null, 2));

            const parseFetchedValue = (value, defaultValue = "") => (value !== null && value !== undefined) ? String(value) : defaultValue;

            const transformedData = {
                ...baseInitialValues,
                applicationCode: fetchedData.applicationCode || routeApplicationCode,
                registeredDistrict: parseFetchedValue(fetchedData.registeredDistrict),
                rtoNo: parseFetchedValue(fetchedData.rtoNo),
                vehicleRegistrationNumber: parseFetchedValue(fetchedData.vehicleRegistrationNumber),
                financialYearCode: parseFetchedValue(fetchedData.financialYearCode),
                departmentCode: parseFetchedValue(fetchedData.departmentCode),
                officeName: parseFetchedValue(fetchedData.officeName),
                officerDesignation: parseFetchedValue(fetchedData.officerDesignation),
                premises: parseFetchedValue(fetchedData.premises),
                address1: parseFetchedValue(fetchedData.address1),
                address2: parseFetchedValue(fetchedData.address2),
                directorateLetterNo: parseFetchedValue(fetchedData.directorateLetterNo),
                directorateLetterDate: fetchedData.directorateLetterDate ? new Date(fetchedData.directorateLetterDate) : null,
                forwardingLetterNo: parseFetchedValue(fetchedData.forwardingLetterNo),
                govForwardingLetterDate: fetchedData.govForwardingLetterDate ? new Date(fetchedData.govForwardingLetterDate) : null,
                vehicletypecode: parseFetchedValue(fetchedData.vehicletypecode),
                vehicledescription: parseFetchedValue(fetchedData.vehicledescription),
                vehiclemanufacturercode: parseFetchedValue(fetchedData.vehiclemanufacturercode),
                engineno: parseFetchedValue(fetchedData.engineno),
                chassisno: parseFetchedValue(fetchedData.chassisno),
                manufactureyear: parseFetchedValue(fetchedData.manufactureyear),
                purchasedate: fetchedData.purchasedate ? new Date(fetchedData.purchasedate) : null,
                vehicleprice: parseFetchedValue(fetchedData.vehicleprice),
                totalkms: parseFetchedValue(fetchedData.totalkms),
                depreciatedamount: parseFetchedValue(fetchedData.depreciatedamount),
                improvements: parseFetchedValue(fetchedData.improvements),
                expenses: parseFetchedValue(fetchedData.expenses),
                repairexpenses: parseFetchedValue(fetchedData.repairexpenses),
                repairslastsixmonths: parseFetchedValue(fetchedData.repairslastsixmonths),
                whetheraccident: parseFetchedValue(fetchedData.whetheraccident),
                accidentcaseresolved: parseFetchedValue(fetchedData.accidentcaseresolved),
                comments: parseFetchedValue(fetchedData.comments),
                mvireportavailable: parseFetchedValue(fetchedData.mvireportavailable),
                partsCondition: (fetchedData.vehiclePartsDraft || []).reduce((acc, part) => {
                    acc[String(part.vehiclepartcode)] = parseFetchedValue(part.condition);
                    return acc;
                }, {}),
                battery: parseFetchedValue(fetchedData.battery),
                tyres: parseFetchedValue(fetchedData.tyres),
                accidentdamage: parseFetchedValue(fetchedData.accidentdamage),
                mviprice: parseFetchedValue(fetchedData.mviprice),
                mviremarks: parseFetchedValue(fetchedData.mviremarks),
                remarks: parseFetchedValue(fetchedData.remarks),
            };
            // console.log("useEffect - Edit Mode: Setting currentInitialValues to (transformedData):", JSON.stringify(transformedData, null, 2));
            setCurrentInitialValues(transformedData);
        } else if (isErrorEditVehicle || (!isLoadingEditVehicle && !isEditVehicleSuccess)) {
            // console.log("useEffect - Edit Mode: Error loading draft or no data.");
            toast({
                title: "Error Loading Draft",
                description: editVehicleError?.response?.data?.message || editVehicleError?.message || "Could not load vehicle details for editing.",
                status: "error", duration: 5000, isClosable: true,
            });
            setCurrentInitialValues({ ...baseInitialValues, applicationCode: routeApplicationCode });
        }
    } else { // CREATE MODE
        if (isLoadingDepartment) {
            // console.log("useEffect - Create Mode: Waiting for department data.");
            return;
        }
        const initialCreateValues = { ...baseInitialValues };
        if (isDepartmentSuccess && departmentData?.data?.[0]?.departmentCode) {
            initialCreateValues.departmentCode = String(departmentData.data[0].departmentCode);
        }
        initialCreateValues.applicationCode = null;
        // console.log("useEffect - Create Mode: Setting currentInitialValues to (initialCreateValues):", JSON.stringify(initialCreateValues, null, 2));
        setCurrentInitialValues(initialCreateValues);
    }
  }, [
    isEditMode,
    isLoadingEditVehicle,
    isEditVehicleSuccess,
    rawEditVehicleData, // Use the raw data object here
    isErrorEditVehicle,
    editVehicleError,
    routeApplicationCode,
    isLoadingDepartment, // Add department loading state
    isDepartmentSuccess,
    departmentData,
    // No baseInitialValues if it's constant
  ]);

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
          title: "Validation Error.", description: "Please check the highlighted fields.",
          status: "error", duration: 3000, isClosable: true,
        });
      } else {
        console.error("Unexpected error during validation:", err);
        toast({
          title: "An Error Occurred.", description: "Something went wrong during validation.",
          status: "error", duration: 5000, isClosable: true,
        });
      }
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const transformValuesToDto = (formValues) => {
    // console.log("transformValuesToDto - Input formValues:", JSON.stringify(formValues, null, 2));
    const {
        financialYearCode, manufactureyear, vehicleprice, totalkms,
        depreciatedamount, expenses, repairexpenses, repairslastsixmonths, mviprice,
        partsCondition,
        applicationCode, // Destructure to handle it specifically for edit/create
        ...restOfFormikValues
    } = formValues;

    const vehiclePartsConditionDto = Object.keys(partsCondition || {}).map(partCodeStr => ({
        vehiclepartcode: parseInt(partCodeStr, 10),
        condition: (partsCondition[partCodeStr] === "" || partsCondition[partCodeStr] === undefined) ? null : partsCondition[partCodeStr], // Send null if empty string or undefined
    }));

    const parseToNumberOrNull = (value, isFloat = false) => {
        if (value === "" || value === null || value === undefined) return null;
        const num = isFloat ? parseFloat(String(value)) : parseInt(String(value), 10);
        return isNaN(num) ? null : num;
    };
    
    // Ensure all keys from baseInitialValues (excluding applicationCode for create, or including for edit)
    // are present in the DTO, defaulting to null if appropriate.
    const dto = { ...baseInitialValues }; // Start with all keys from base

    // Overwrite with form values, applying transformations
    for (const key in restOfFormikValues) {
        if (Object.hasOwnProperty.call(restOfFormikValues, key) && key !== 'applicationCode') {
             dto[key] = (restOfFormikValues[key] === "" && (key === "address1" || key === "address2" || key === "directorateLetterNo" || key === "improvements" /* add other optional strings */))
                ? null
                : restOfFormikValues[key];
        }
    }
    
    dto.financialYearCode = parseToNumberOrNull(financialYearCode);
    dto.manufactureyear = parseToNumberOrNull(manufactureyear);
    dto.vehicleprice = parseToNumberOrNull(vehicleprice, true);
    dto.totalkms = parseToNumberOrNull(totalkms);
    dto.depreciatedamount = parseToNumberOrNull(depreciatedamount, true);
    dto.expenses = parseToNumberOrNull(expenses, true);
    dto.repairexpenses = parseToNumberOrNull(repairexpenses, true);
    dto.repairslastsixmonths = parseToNumberOrNull(repairslastsixmonths, true);
    dto.mviprice = parseToNumberOrNull(mviprice, true);
    dto.vehiclePartsDraft = vehiclePartsConditionDto;

    if (isEditMode) {
        dto.applicationCode = routeApplicationCode; // Use routeApplicationCode for updates
    } else {
        delete dto.applicationCode; // Ensure no applicationCode for create
    }
    // console.log("transformValuesToDto - Output DTO:", JSON.stringify(dto, null, 2));
    return dto;
  };

  const handleSaveDraft = (values) => {
    const dtoPayload = transformValuesToDto(values);
    // console.log("Payload for Save Draft:", JSON.stringify(dtoPayload, null, 2));
    setIsSubmittingDraft(true);
    sendToDraftMutate(dtoPayload, {
        onSuccess: (responseData) => {
            toast({
                title: "Draft Saved.",
                description: `Draft ${isEditMode ? 'updated' : 'created'} successfully. ${responseData?.data?.applicationCode ? `App Code: ${responseData.data.applicationCode}` : ''}`,
                status: "success", duration: 3000, isClosable: true,
            });
            if (!isEditMode && responseData?.data?.applicationCode) {
              // If creating new and got an app code, update URL to reflect edit mode for this new draft
              navigate(`/dataentryvehicle/edit/${responseData.data.applicationCode}`, { replace: true });
            } else if (isEditMode) {
              // Potentially refetch data or update currentInitialValues if backend modifies data on save
            }
        },
        onError: (error) => {
            console.error("Error saving draft:", error);
            const apiErrorMessage = error.response?.data?.errors?.[0]?.defaultMessage || error.response?.data?.message || error.message || "Something went wrong.";
            toast({ title: "Failed to Save Draft.", description: apiErrorMessage, status: "error", duration: 5000, isClosable: true });
        },
        onSettled: () => {
            setIsSubmittingDraft(false);
        }
    });
  };

  const handleFinalSubmit = (values) => {
    const dtoPayload = transformValuesToDto(values);
    // console.log("Payload for Final Submit:", JSON.stringify(dtoPayload, null, 2));
    setIsSubmittingFinal(true);
    sendToFinalMutate(dtoPayload, {
        onSuccess: (responseData) => {
            toast({
                title: "Application Submitted.",
                description: `Application ${isEditMode ? 'updated and ' : ''}submitted successfully. ${responseData?.data?.applicationCode ? `App Code: ${responseData.data.applicationCode}` : ''}`,
                status: "success", duration: 3000, isClosable: true,
            });
            navigate('/draft-list'); // Navigate to a list or dashboard after final submit
        },
        onError: (error) => {
            console.error("Error during final submission:", error);
            const apiErrorMessage = error.response?.data?.errors?.[0]?.defaultMessage || error.response?.data?.message || error.message || "Something went wrong.";
            toast({ title: "Failed to Submit Application.", description: apiErrorMessage, status: "error", duration: 5000, isClosable: true });
        },
        onSettled: () => {
            setIsSubmittingFinal(false);
        }
    });
  };

  if (isEditMode && isLoadingEditVehicle) {
    return (
      <Flex justify="center" align="center" minHeight="calc(100vh - 200px)"> {/* Use minHeight */}
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.500" size="xl" />
        <Text ml={4} fontSize="lg">Loading vehicle details...</Text>
      </Flex>
    );
  }
  // No explicit error display here for edit fetch failure, as the useEffect handles it with a toast
  // and resets initialValues. If the form shows with base values after an error, that's the current behavior.

  return (
    <Box bg="white" shadow="md" w="auto" p={6} m={4} borderRadius="md"> {/* Changed bg to white for paper */}
      {/* <Button onClick={() => console.log("Current Formik Values:", currentInitialValues)}>Log Current Initial Values</Button> */}
      <Formik
        initialValues={currentInitialValues}
        enableReinitialize={true}
      >
        {(formikProps) => {
        //  console.log("Formik render - formikProps.values:", JSON.stringify(formikProps.values, null, 2));
          return (
          <Form>
            <Stack spacing={6}>
              <Stepper index={step} colorScheme="teal" mb={6}>
                {baseSteps.map((s, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                    </StepIndicator>
                    <Box flexShrink={0}>
                      <StepTitle>{s.title}</StepTitle>
                      <StepDescription>{s.description}</StepDescription>
                    </Box>
                    {index < baseSteps.length - 1 && <StepSeparator />}
                  </Step>
                ))}
              </Stepper>

              <Box p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
                {renderContent(step, formikProps)}
              </Box>

              <Flex mt={6} justifyContent="space-between" alignItems="center">
                <Button onClick={handlePrev} isDisabled={step === 0} variant="outline">
                  Previous
                </Button>
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
                        isDisabled={isSubmittingDraft || isSubmittingFinal || isDraftSending || isFinalSending || isLoadingEditVehicle || isLoadingDepartment}
                      >
                        Save As Draft
                      </Button>
                      <Button
                        onClick={() => handleFinalSubmit(formikProps.values)}
                        colorScheme="green"
                        isLoading={isSubmittingFinal || isFinalSending}
                        loadingText="Submitting..."
                        isDisabled={isSubmittingDraft || isSubmittingFinal || isDraftSending || isFinalSending || isLoadingEditVehicle || isLoadingDepartment}
                      >
                        Final Submit
                      </Button>
                    </>
                  )}
                </Flex>
              </Flex>
            </Stack>
          </Form>
        )}}
      </Formik>
    </Box>
  );
};

export default VehicleRegistrationForm;