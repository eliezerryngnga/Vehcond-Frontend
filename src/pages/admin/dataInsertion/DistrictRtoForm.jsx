// DistrictRtoForm.js

import React, { useMemo } from 'react';
import {
    Box,
    Button,
    // HStack, // Not directly used
    useColorModeValue,
    useToast,
    VStack,
    Spinner,
    Stack,
    Text
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import InputField from "../../../components/core/formik/InputField";
import SelectField from "../../../components/core/formik/SelectField";

import { useAddDistrictRtos } from '../../../hooks/adminActions';
import { useFetchDistrictName } from '../../../hooks/dataEntryQueries';

// 1. VALIDATION SCHEMA: Validate 'districtCode' (the value from the select)
const validationSchema = Yup.object().shape({
    districtCode: Yup.string().required('District selection is required'), // Changed from districtName
    rtoCode: Yup.string().required('RTO code is required'),
});

const DistrictRtoForm = () => {
    const toast = useToast();
    const { mutate: addDistrictRtoMutate, isLoading: isAddingDistrictRto } = useAddDistrictRtos();

    const {
        data: districtsData,
        isLoading: isLoadingDistricts,
        isError: isErrorDistricts,
        error: districtsError
    } = useFetchDistrictName();

    const containerBg = useColorModeValue('white', 'gray.800');

    const sortedDistricts = useMemo(() => {
        if (districtsData?.data && Array.isArray(districtsData.data)) {
            return [...districtsData.data].sort((a, b) =>
                a.districtName.localeCompare(b.districtName)
            );
        }
        return [];
    }, [districtsData]);

    // 2. INITIAL VALUES: Already correct with districtCode
    const initialValues = {
        districtCode: '', // This will store the selected district's code
        rtoCode: ''
    };

    const handleSubmit = (values, formikActions) => {
        // values will now contain { districtCode: "selected_code", rtoCode: "entered_rto" }
        console.log("Form values to submit:", values);
        formikActions.setSubmitting(true);

        // 4. PAYLOAD: Use values.districtCode
        const payload = {
            districtCode: values.districtCode,
            rtoCode: values.rtoCode,
        };

        addDistrictRtoMutate(payload, {
            onSuccess: (response) => {
                // 5. TOAST MESSAGE: Use values.districtCode to find the name
                // Ensure type-safe comparison if districtCode can be number from API vs string from form
                const selectedDistrictObj = sortedDistricts.find(
                    d => String(d.districtCode) === String(values.districtCode)
                );
                const districtNameForToast = selectedDistrictObj ? selectedDistrictObj.districtName : values.districtCode;

                console.log('District RTO inserted successfully. Server response:', response);
                toast({
                    title: "District RTO Added",
                    description: `RTO code "${values.rtoCode}" for district "${districtNameForToast}" has been successfully added. ${response?.data?.message || ''}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                formikActions.resetForm();
            },
            onError: (error) => {
                console.error('District RTO insertion failed in component:', error);
                toast({
                    title: "Error Adding District RTO",
                    description: error?.response?.data?.error || error?.message || "An unexpected error occurred.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
            },
            onSettled: () => {
                formikActions.setSubmitting(false);
            }
        });
    };

    if (isLoadingDistricts) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" h="200px">
                <Spinner size="xl" />
                <Text ml={3}>Loading districts...</Text>
            </Box>
        );
    }

    if (isErrorDistricts) {
        return (
            <Box color="red.500" p={5} borderWidth="1px" borderRadius="md" borderColor="red.300" bg="red.50">
                <Text fontWeight="bold">Error loading districts:</Text>
                <Text>{districtsError?.message || "An unexpected error occurred."}</Text>
            </Box>
        );
    }

    return (
        <Box
            p={{ base: 4, sm: 6, md: 8 }}
            borderWidth="1px"
            borderRadius="md"
            bg={containerBg}
            shadow="sm"
            maxW={{ base: 'md', lg: 'xl' }}
            mx="auto"
            w="100%"
            mb={6}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                // enableReinitialize // Can often be removed if initialValues don't change dynamically after first render
            >
                {(formikProps) => (
                    <Form>
                        <VStack spacing={4} align="stretch">
                            {/* 3. SELECTFIELD NAME: Change to 'districtCode' */}
                            <SelectField
                                name="districtCode" // Changed from registeredDistrict
                                label="District where vehicle was registered"
                                placeholder="Select District Name"
                                isRequired={true} // For visual consistency
                            >
                                {/* Add an empty option if placeholder is shown but field is required */}
                                {/* <option value="" disabled>Select District Name</option> */}
                                {sortedDistricts?.map((district) => (
                                    <option key={district.districtCode} value={district.districtCode}>
                                        {district.districtName}
                                    </option>
                                ))}
                            </SelectField>

                            <InputField
                                name="rtoCode"
                                label="RTO Code"
                                placeholder="RTO Code (Eg: ML 01)"
                                isRequired={true}
                                size="md"
                            />


                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                spacing={3}
                                justifyContent="center"
                                width="100%"
                            >
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    isLoading={formikProps.isSubmitting || isAddingDistrictRto}
                                    loadingText="Submitting..."
                                    // Formik's isValid and dirty flags should now work correctly
                                    isDisabled={formikProps.isSubmitting || isAddingDistrictRto || !formikProps.isValid || !formikProps.dirty}
                                    w={{ base: '100%', sm: 'auto' }}
                                >
                                    Submit
                                </Button>
                                <Button
                                    type="button"
                                    onClick={formikProps.handleReset}
                                    variant="outline"
                                    isDisabled={isAddingDistrictRto || !formikProps.dirty}
                                    w={{ base: '100%', sm: 'auto' }}
                                >
                                    Reset
                                </Button>

                            </Stack>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default DistrictRtoForm;