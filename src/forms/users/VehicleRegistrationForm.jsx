import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  Text
} from "@chakra-ui/react";

import { Formik, Form } from "formik";
import * as yup from "yup";
import dayjs from 'dayjs';

import OfficeRecords from "../../pages/vehicleDataEntry/OfficeRecords";
import VehicleInformation from "../../pages/vehicleDataEntry/VehicleInformation";
import VehicleCondem from "../../pages/vehicleDataEntry/VehicleCondem";

import {
  useSendToDraft,
  useFetchDepartment,
  useSendToFinal,
  useFetchDraftByCode,
} from "../../hooks/dataEntryQueries";

const maxToday = dayjs().endOf('day').toDate();

const validationSchemaStep_1 = yup.object({
  registeredDistrict: yup
    .string()
    .required("District Name cannot be blank"),
  rtoCode: yup
    .string()
    .required("RTO No. cannot be blank"),
  vehicleRegistrationNumber: yup
    .string()
    .matches(/^[A-Z]{0,2}\s*\d{1,4}$/,"Invalid format (e.g., AA 1234 or B 1234)")
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
    .nullable(true)
    .max(maxToday, "Directorate Letter Date cannot be in the future")
    .typeError("Invalid date for Directorate Letter"),
  forwardingLetterNo: yup
    .string()
    .required("Govt. Forwarding Letter No. cannot be blank"),
  govForwardingLetterDate: yup
    .date()
    .required("Govt. Forwarding Letter Date cannot be blank")
    .max(maxToday, "Forwarding Letter Date cannot be in the future")
    .typeError("Invalid date format for Govt. Forwarding Letter Date"),
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
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  purchasedate: yup
    .date()
    .required("Date of Purchase cannot be blank")
    .max(maxToday, "Purchase date cannot be in the future")
    .typeError("Invalid date format for Date of Purchase"),
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
    .number()
    .required("Repairs Before Condemnation cannot be blank")
    .typeError("Repairs Before Condemnation must be a number")
    .min(0, "Value cannot be negative"),
  whetheraccident: yup
    .string()
    .required("Specify if vehicle had an accident"),
  accidentcaseresolved: yup
    .string().when("whetheraccident", {
    is: "Y",
    then: (schema) => schema
    .required("Specify if accident case has been resolved"),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  comments: yup
    .string()
    .required("Department Officer Comments cannot be blank"),
  mvireportavailable: yup
    .string()
    .required("MVI Report availability cannot be blank"),
  partsCondition: yup.object().when("mvireportavailable", {
    is: "Y",
    then: (schema) => schema.test(
        'parts-condition-check',
        'Condition for each listed part must be specified when MVI report is available.',
        (value) => {
            if (!value || typeof value !== 'object' || Object.keys(value).length === 0) return true;
            return Object.values(value).every(condition => typeof condition === 'string' && condition.trim() !== '');
        }
    ).default({}),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  battery: yup
    .string().when("mvireportavailable", {
    is: "Y",
    then: (schema) => schema
    .required("Battery Condition cannot be blank"),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  tyres: yup
    .string().when("mvireportavailable", {
    is: "Y",
    then: (schema) => schema
    .required("Tyres Condition cannot be blank"),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  accidentdamage: yup
    .string().when("mvireportavailable", {
    is: "Y",
    then: (schema) => schema
    .required("Accident damage description cannot be blank"),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  mviprice: yup.number().when("mvireportavailable", {
    is: "Y",
    then: (schema) =>
      schema
    .required("MVI's assessment of current value cannot be blank")
        .typeError("MVI's assessment must be a number")
        .min(0, "MVI's assessment cannot be negative"),
    otherwise: (schema) => schema.optional().nullable().transform(() => 0),
  }),
  mviremarks: yup
    .string().when("mvireportavailable", {
    is: "Y",
    then: (schema) => schema
    .required("MVI officer comments cannot be blank"),
    otherwise: (schema) => schema.optional().nullable(),
  }),
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
  
  const { draftId } = useParams();

  const navigate = useNavigate();
  const toast = useToast();

  const toastShownRef = useRef(false);

  const [step, setStep] = useState(0);

  const [applicationCode, setApplicationCode] = useState(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(!!draftId);

  const { mutateAsync: sendToDraftMutateAsync, isLoading: isDraftSending } = useSendToDraft();
  const { mutate: sendToFinalMutate, isLoading: isFinalSending } = useSendToFinal();
  const { data: departmentData, isSuccess: isDepartmentSuccess } = useFetchDepartment();

  const { data: draftData, isSuccess: isDraftLoaded, isError: isDraftError } = useFetchDraftByCode(draftId);

  const baseSteps = [
    { title: "Step 1", description: "Office Details", schema: validationSchemaStep_1 },
    { title: "Step 2", description: "Vehicle Information", schema: validationSchemaStep_2 },
    { title: "Step 3", description: "Vehicle Condemnation", schema: validationSchemaStep_3 },
  ];

  const baseInitialValues = {
    //STEP 1
    registeredDistrict: "", 
    rtoCode: "", 
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
    //STEP 2
    vehicletypecode: "",
    vehicledescription: "", 
    vehiclemanufacturercode: "", 
    engineno: "", 
    chassisno: "",
    manufactureyear: "", 
    purchasedate: null, 
    vehicleprice: "", 
    //STEP 3 
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

  useEffect(() => {
    if (isDraftLoaded && draftData?.data && !toastShownRef.current) {

      toastShownRef.current = true;

      const fetched = draftData.data;
      
      const transformedValues = {
        ...baseInitialValues,
        ...fetched,
        // --- Transform data to match what the form expects ---
        directorateLetterDate: fetched.directorateLetterDate ? new Date(fetched.directorateLetterDate) : null,
        govForwardingLetterDate: fetched.govForwardingLetterDate ? new Date(fetched.govForwardingLetterDate) : null,
        purchasedate: fetched.purchasedate ? new Date(fetched.purchasedate) : null,
        
      officeName: fetched.officeName || "",
      officerDesignation: fetched.officerDesignation || "",
      premises: fetched.premises || "",
      address1: fetched.address1 || "",
      address2: fetched.address2 || "",
      directorateLetterNo: fetched.directorateLetterNo || "",
      forwardingLetterNo: fetched.forwardingLetterNo || "",
      rtoCode: fetched.rtoCode || "",
      vehicleRegistrationNumber: fetched.vehicleRegistrationNumber || "",
      vehicledescription: fetched.vehicledescription || "",
      engineno: fetched.engineno || "",
      chassisno: fetched.chassisno || "",
      improvements: fetched.improvements || "",
      comments: fetched.comments || "",
      battery: fetched.battery || "",
      tyres: fetched.tyres || "",
      accidentdamage: fetched.accidentdamage || "",
      mviremarks: fetched.mviremarks || "",
      remarks: fetched.remarks || "",

      // --- Number Fields (coalesce null to "" because input type="number" wants a string) ---
      manufactureyear: fetched.manufactureyear || "",
      vehicleprice: fetched.vehicleprice || "",
      totalkms: fetched.totalkms || "",
      depreciatedamount: fetched.depreciatedamount || "",
      expenses: fetched.expenses || "",
      repairexpenses: fetched.repairexpenses || "",
      repairslastsixmonths: fetched.repairslastsixmonths || "",
      mviprice: fetched.mviprice || "",

      // --- Select Fields (coalesce null to "" to match the placeholder value) ---
      financialYearCode: String(fetched.financialYearCode || ""),
      departmentCode: String(fetched.departmentCode || ""),
      registeredDistrict: String(fetched.registeredDistrict || ""),
      vehicletypecode: String(fetched.vehicletypecode || ""),
      vehiclemanufacturercode: String(fetched.vehiclemanufacturercode || ""),
      whetheraccident: fetched.whetheraccident || "",
      accidentcaseresolved: fetched.accidentcaseresolved || "",
      mvireportavailable: fetched.mvireportavailable || "",


        partsCondition: (fetched.vehiclePartsDraft || []).reduce((acc, part) => {
          acc[part.vehiclepartcode] = part.condition;
          return acc;
        }, {}),
      };

      setCurrentInitialValues(transformedValues);
      setApplicationCode(fetched.applicationCode);
      setIsLoadingDraft(false);

      toast({
        title: "Draft Loaded",
        description: `Resuming application ${fetched.applicationCode}.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else if (isDraftError) {
      setIsLoadingDraft(false); 
      toast({
        title: "Error Loading Draft",
        description: "Could not find the requested draft. You have been redirected.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/da/listvehicledraft"); // Redirect away
    }
  }, [isDraftLoaded, draftData, isDraftError, navigate, toast]);

  // Effect: Set department code for new forms
  useEffect(() => {
    if (!draftId && isDepartmentSuccess && departmentData?.data?.[0]?.departmentCode) {
      const fetchedDeptCode = String(departmentData.data[0].departmentCode);
      setCurrentInitialValues((prevValues) => {
          if (prevValues.departmentCode === "" || prevValues.departmentCode !== fetchedDeptCode) {
            return { ...prevValues, departmentCode: fetchedDeptCode };
          }
          return prevValues;
      });
    }
  }, [draftId, isDepartmentSuccess, departmentData]);

    // 7. ADD A LOADING SPINNER FOR THE ENTIRE COMPONENT
  if (isLoadingDraft) {
    return (
      <Box bg="white" shadow="md" w="auto" p={{ base: 3, md: 6 }} m={{ base: 2, md: 4 }} borderRadius="md">
        <Flex justify="center" align="center" height="400px">
          <Spinner thickness="4px" speed="0.65s" color="teal.500" size="xl" />
          <Text ml={4} fontSize="lg" color="gray.600">Loading your draft...</Text>
        </Flex>
      </Box>
    );
  }

  const handleMviReportChangeCallback = (value, setFieldValueFunc) => {
    setFieldValueFunc('mvireportavailable', value);
    if (value === 'N') {
        setFieldValueFunc('partsCondition', {});
        setFieldValueFunc('battery', '');
        setFieldValueFunc('tyres', '');
        setFieldValueFunc('accidentdamage', '');
        setFieldValueFunc('mviprice', '');
        setFieldValueFunc('mviremarks', '');
    }
  };

  const renderContent = (currentStep, formikProps) => {
    switch (currentStep) {
      case 0: return <OfficeRecords {...formikProps} values={formikProps.values} departmentName={departmentData?.data?.[0]?.departmentName || ""} />;
      case 1: return <VehicleInformation {...formikProps} values={formikProps.values} />;
      case 2: return <VehicleCondem {...formikProps} values={formikProps.values} handleMviReportChange={(v) => handleMviReportChangeCallback(v, formikProps.setFieldValue)} />;
      default: return null;
    }
  };

  const handleNext = async (values, setErrors, setTouched) => {
    const currentSchema = baseSteps[step].schema;
    try {
      await currentSchema.validate(values, { abortEarly: false });
      setErrors({});
      const currentStepFields = Object.keys(currentSchema.fields);
      const touchedUpdates = currentStepFields.reduce((acc, field) => ({ ...acc, [field]: false }),{});
      setTouched(touchedUpdates, false);

      const submissionValues = prepareSubmitValues(values);

      const payload = { ...submissionValues, applicationCode: applicationCode};

      toast({
        title: "Saving step...",
        status: "info",
        duration: 1500
      });

      const result = await sendToDraftMutateAsync(payload);

      const newAppCode = result?.data?.applicationCode;

      if(!applicationCode && newAppCode)
      {
        setApplicationCode(newAppCode);

        console.log("Draft created with Application Code: ", newAppCode);
      }
      toast.closeAll();
      toast({
        title:  `Step ${step + 1} Saved`,
        status: "success",
        duration: 2000
      })

      if (step < baseSteps.length - 1)
      {
        setStep(step + 1);
      } 
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const formikErrors = yupErrorsToFormik(err);
        setErrors(formikErrors);
        setTouched(Object.keys(formikErrors).reduce((acc, key) => ({ ...acc, [key]: true }),{}), false);
        toast({ title: "Validation Error.", description: "Please check the highlighted fields.", status: "error", duration: 3000, isClosable: true });
      } else {
        
        console.error("Error during step save: ", err);
        const errorMessage = err?.response?.data?.message || "Could not save progress to server.";

        toast({ title: "Save Failed.", description: errorMessage, status: "error", duration: 5000, isClosable: true });
      }
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const safeParseInt = (value, defaultValue = null) => {
      if (value === null || value === undefined || String(value).trim() === "") return defaultValue;
      const parsed = parseInt(String(value).trim(), 10);
      return isNaN(parsed) ? defaultValue : parsed;
  };
  
  const safeParseFloat = (value, defaultValue = null) => {
    if (value === null || value === undefined || String(value).trim() === "") return defaultValue;
    const numValue = String(value).replace(/,/g, ''); 
    const parsed = parseFloat(numValue);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const prepareSubmitValues = (values) => {
    const { partsCondition, ...restValues } = values;
    const vehiclePartsConditionSubmit = Object.keys(partsCondition || {}).map(
      (partCodeStr) => ({
        vehiclepartcode: parseInt(partCodeStr, 10),
        condition: partsCondition[partCodeStr],
      })
    ).filter(part => !isNaN(part.vehiclepartcode));

    const formatDateForApi = (dateValue) => {
      if(dayjs(dateValue).isValid())
      {
        return dayjs(dateValue).format('YYYY-MM-DD');
      }
      return null;
    };

    return {
      ...restValues,
      directorateLetterDate: formatDateForApi(values.directorateLetterDate),
      govForwardingLetterDate: formatDateForApi(values.govForwardingLetterDate),
      purchasedate: formatDateForApi(values.purchasedate),
      
      manufactureyear: safeParseInt(values.manufactureyear),
      vehicleprice: safeParseFloat(values.vehicleprice),
      totalkms: safeParseInt(values.totalkms),
      depreciatedamount: safeParseFloat(values.depreciatedamount),
      expenses: safeParseFloat(values.expenses),
      repairexpenses: safeParseFloat(values.repairexpenses),
      repairslastsixmonths: safeParseFloat(values.repairslastsixmonths),
      mviprice: values.mvireportavailable === 'Y' ? safeParseFloat(values.mviprice) : 0,
      financialYearCode: safeParseInt(values.financialYearCode),
      departmentCode: safeParseInt(values.departmentCode),
      registeredDistrict: safeParseInt(values.registeredDistrict),
      vehicletypecode: safeParseInt(values.vehicletypecode),
      vehiclemanufacturercode: safeParseInt(values.vehiclemanufacturercode),
      vehiclePartsDraft: vehiclePartsConditionSubmit,
    };
  };

  const handleSaveDraft = (values) => {
    const submissionValues = prepareSubmitValues(values);

    const payload = { ...submissionValues, applicationCode: applicationCode};

    sendToDraftMutateAsync(payload, {
      onSuccess: (data) => {
        const appCodeFromResult = data?.data?.applicationCode || data?.applicationCode;
        toast({
          title: "Draft Saved.",
          description: `Draft progress saved. Application Code: ${appCodeFromResult}`,
          status: "success", duration: 3000, isClosable: true,
        });
        // setCurrentInitialValues(baseInitialValues);
        // setStep(0);
        navigate("/da/listvehicledraft");
      },
      onError: (error) => {
        toast({
          title: "Failed to Save Draft.",
          description: error?.response?.data?.message || error?.message || "An error occurred.",
          status: "error", duration: 5000, isClosable: true,
        });
      },
    });
  };

  const handleFinalSubmit = async (values, setErrors, setTouched) => {
    let allValid = true;
    const allErrors = {};
    const allTouched = {};
    for (const s of baseSteps) {
        try { await s.schema.validate(values, { abortEarly: false }); } catch (err) {
            if (err instanceof yup.ValidationError) {
                const stepErrors = yupErrorsToFormik(err);
                Object.assign(allErrors, stepErrors);
                Object.keys(stepErrors).forEach(key => allTouched[key] = true);
                allValid = false;
            }
        }
    }
    if (!allValid) {
        setErrors(allErrors); setTouched(allTouched, false);
        toast({ title: "Validation Error.", description: "Please review all steps for errors.", status: "error", duration: 4000, isClosable: true });
        return;
    }
    setErrors({});

    const submissionValues = {...prepareSubmitValues(values), applicationCode: applicationCode};

    sendToFinalMutate(submissionValues, {
      onSuccess: (data) => {
        const appCodeFromResult = data?.data?.applicationCode || data?.applicationCode;
        toast({
          title: "Final Submission Successful.",
          description: `Application submitted. App Code: ${appCodeFromResult}`,
          status: "success", duration: 3000, isClosable: true,
        });
        setCurrentInitialValues(baseInitialValues);
        setStep(0);
        navigate("/da/dataentryvehicle");
      },
      onError: (error) => {
        toast({
          title: "Final Submission Failed.",
          description: error?.response?.data?.message || error?.message || "An error occurred.",
          status: "error", duration: 5000, isClosable: true,
        });
      },
    });
  };

  const resetTheForm = (formikProps) => {
    formikProps.resetForm({ values: baseInitialValues });
    setCurrentInitialValues(baseInitialValues);
    setStep(0);
    setApplicationCode(null); // <-- VERY IMPORTANT
    toast({ title: "Form Reset", description: "Form cleared for new entry.", status: "info", duration: 3000, isClosable: true });
  }

  return (
    <Box bg="white" shadow="md" w="auto" p={{ base: 3, md: 6 }} m={{ base: 2, md: 4 }} borderRadius="md">
      <Formik
        key={ currentInitialValues.applicationCode || 'new-vehicle-form'}
        initialValues={currentInitialValues}
        enableReinitialize={true}
      >
        {(formikProps) => (
            <Form>
              <Stack spacing={6}>
                <Stepper index={step} colorScheme="teal" size="sm">
                  {baseSteps.map((s, index) => (
                    <Step key={index} onClick={() => setStep(index)} style={{ cursor: 'pointer' }}>
                      <StepIndicator>
                        <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                      </StepIndicator>
                      <Box flexShrink={0} textAlign="left">
                        <StepTitle>{s.title}</StepTitle>
                        <StepDescription>{s.description}</StepDescription>
                      </Box>
                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>

                <Box p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
                  {renderContent(step, formikProps)}
                </Box>

                <Flex mt={4} justifyContent="flex-end" display={{ base: "none", md: "flex" }}>
                  <Button
                    onClick={() => {
                      resetTheForm(formikProps)
                    }}
                    variant="ghost" colorScheme="red" size="sm" mr="auto"
                  >
                    Clear & Reset Form
                  </Button>
                </Flex>

                <Flex mt={2} justifyContent="space-between" direction={{ base: "column-reverse", sm: "row" }} gap={2}>
                   <Button
                    onClick={() => resetTheForm(formikProps)}
                    variant="ghost" colorScheme="red" size="sm" 
                    display={{ base: "block", md: "none" }} width="full"
                  >
                    Clear Form
                  </Button>

                  <Button onClick={handlePrev} isDisabled={step === 0} variant="outline" size="sm">Previous</Button>
                  <Flex gap={2}>
                    {step < baseSteps.length - 1 ? (
                      <Button 
                      onClick={() => handleNext(formikProps.values, formikProps.setErrors, formikProps.setTouched)}
                      size="sm"
                      isLoading={isDraftSending}
                      loadingText="Saving..."
                      >
                        Next
                      </Button>
                    ) : (
                      <>
                        <Button
                          mr={{ base: 0, sm: 2}}
                          onClick={() => handleSaveDraft(formikProps.values)}
                          colorScheme="blue" variant="outline" isLoading={isDraftSending}
                          loadingText="Saving..."
                          isDisabled={isDraftSending || isFinalSending}
                          size="sm"
                        >
                          Save As Draft
                        </Button>
                        <Button
                          onClick={() => handleFinalSubmit(formikProps.values, formikProps.setErrors, formikProps.setTouched)}
                          colorScheme="green" isLoading={isFinalSending} loadingText="Submitting..."
                          isDisabled={isDraftSending || isFinalSending}
                          size="sm"
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