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

const validationSchemaStep_1 = yup.object({
  // Step 1
  districtName: yup
    .string()
    .required("District Name cannot be blank"),

  rtoNo: yup
    .string()
    .required("RTO No. cannot be blank"),

  vehicleRegistrationNumber: yup
    .string()
    .matches(/^[A-Z]{2,}\s*\d{1,4}$/, "Invalid format (e.g., AA 1234 or B 1234)")
    .required("Cannot be blank"),

  financialYear: yup
    .number()
    .required("Financial Year cannot be blank"),

  departmentName: yup
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
    .string()
    .required("Address Line 1 cannot be blank"),

  address2: yup
    .string(),

  directorateLetterNo: yup
    .string()
    .required("Directorate Letter No. cannot be blank"),

  directorateLetterDate: yup
    .date()
    .required("Directorate Letter Date cannot be blank")
    .typeError("Invalid date"),

  forwardingLetterNo: yup
    .string()
    .required("Govt. Forwarding Letter No. cannot be blank"),

  govForwardingLetterDate: yup
    .date()
    .required("Govt. Forwarding Letter Date cannot be blank")
    .typeError("Invalid date"),
});

const validationSchemaStep_2 = yup.object({
  vehicleCategory: yup
    .string()
    .required("Vehicle Category cannot be blank"),
  descriptionOfVehicle: yup
    .string()
    .required("Description cannot be blank"),
  vehicleManufacturer: yup
    .string()
    .required("Manufacturer cannot be blank"),
  engineNumber: yup
    .string()
    .required("Engine No. cannot be blank"),
  chassisNumber: yup
    .string()
    .required("Chassis No. cannot be blank"),
  yearOfManufacturer: yup
    .number()
    .required("Year of Manufacture cannot be blank")
    .typeError("Must be a number")
    .integer("Must be a whole number")
    .min(1900, "Year seems too old")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"), // Allow current year + 1 for upcoming models

  dateOfPurchase: yup
    .date()
    .required("Date of Purchase cannot be blank")
    .typeError("Invalid date"),
  vehiclePurchasePrice: yup
    .number()
    .required("Purchase Price cannot be blank")
    .typeError("Must be a number")
    .positive("Price must be positive"),
});

const validationSchemaStep_3 = yup.object({

  totalKmLogged: yup
    .number()
    .required("Total Km cannot be blank")
    .typeError("Must be a number")
    .min(0, "Cannot be negative"),

  dpreciatedValueOfVeh: yup
    .number()
    .required("Depreciated Value cannot be blank")
    .typeError("Must be a number")
    .min(0, "Cannot be negative"),

  improvFilmentmade: yup
    .string(),

  totalExpendOfPol: yup
    .number()
    .required("Total POL Expenditure cannot be blank")
    .typeError("Must be a number")
    .min(0, "Cannot be negative"),

  totalExpendMaintenance: yup
    .number()
    .required("Total Maintenance Expenditure cannot be blank")
    .typeError("Must be a number")
    .min(0, "Cannot be negative"),

  repairsBeforeCondem: yup
    .string()
    .required("Repairs Before Condemnation cannot be blank"),

  vehicleHasAccident: yup
    .string()
    .required("Specify if vehicle had an accident"),

  // Conditional validation: caseInAccident required only if vehicleHasAccident is 'Yes'
  caseInAccident: yup
    .string()
    .when("vehicleHasAccident", {
      is: (val) => val && val.toLowerCase() === 'yes', // Adjust condition based on actual value ('Yes', true, etc.)
      then: (schema) => schema.required("Case details required if accident occurred"),
      otherwise: (schema) => schema.optional(),
    }),

  commentsOfDeptOfficer: yup
    .string()
    .required("Department Officer Comments cannot be blank"),

  MviReport: yup
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

  const baseSteps = [
    { title: "Step 1", description: "Office Details", schema: validationSchemaStep_1 },
    { title: "Step 2", description: "Vehicle Information", schema: validationSchemaStep_2 },
    { title: "Step 3", description: "Vehicle Condemnation", schema: validationSchemaStep_3 },
  ];

  const renderContent = (currentStep, formikProps) => {
    switch (currentStep) {
      case 0:
        return <OfficeRecords {...formikProps} />;
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
    districtName: "",
    rtoNo: "",
    vehicleRegistrationNumber: "",
    financialYear: "",
    departmentName: "",
    officeName: "",
    officerDesignation: "",
    premises: "",
    address1: "",
    address2: "",
    directorateLetterNo: "",
    directorateLetterDate: '',
    forwardingLetterNo: '',
    govForwardingLetterDate: '',
    // Step 2
    vehicleCategory: "",
    descriptionOfVehicle: "",
    vehicleManufacturer: "",
    engineNumber: "",
    chassisNumber: "",
    yearOfManufacturer: '',
    dateOfPurchase: '',
    vehiclePurchasePrice: '',
    totalKmLogged: "",
    // Step 3
    dpreciatedValueOfVeh: "",
    improvFilmentmade: "",
    totalExpendOfPol: "",
    totalExpendMaintenance: "",
    repairsBeforeCondem: "",
    vehicleHasAccident: "",
    caseInAccident: "",
    commentsOfDeptOfficer: "",
    MviReport: "",
    partsCondition: {}, // Initialize for PartsCondition
    battery: "",
    tyres: "",
    accidentDamage: "",
    mviPrice: "",
    mviRemarks: "",
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
    console.log("Form saved as Draft:", values);
  }

  const handleFinalSubmit = (values) => {
    console.log("Final submit:", values);
  }

  const [currentInitialValues, setCurrentInitialValues] = useState(baseInitialValues);

  useEffect(() => {
    setCurrentInitialValues(baseInitialValues); // Initialize with base values on component mount
  }, []);

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
                      >
                        Save As Draft
                      </Button>
                      <Button
                        onClick={() => handleFinalSubmit(formikProps.values)}
                        colorScheme="green"
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