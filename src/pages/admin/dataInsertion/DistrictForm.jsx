import React from 'react';
import {
    Box,
    Button,
    HStack, // Still useful for larger screens
    useColorModeValue,
    useToast,
    VStack,
    // Stack is good for responsive layouts that can switch direction
    Stack,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import InputField from "../../../components/core/formik/InputField";

import { useAddDistricts } from '../../../hooks/adminActions';

const validationSchema = Yup.object().shape({
    lgdCode: Yup
        .number()
        .required('LGD code is required'),
    districtName: Yup
        .string()
        .required('District name is required'),
});

const DistrictForm = () => {
    
    const toast = useToast();

    const { mutate: addDistrictMutate, isLoading: isAddingDistrict } = useAddDistricts();
    
    const containerBg = useColorModeValue('white', 'gray.800');

    const initialValues = {
        lgdCode: 0,
        districtName: '',
    };

    const handleSubmit = (values, formikActions) => {
        console.log("Form values to submit:", values);
        formikActions.setSubmitting(true); 

        const payload = values;

        addDistrictMutate(payload, {
            onSuccess: (response) => {
                console.log('District inserted successfully. Server response:', response);
                toast({
                    title: "District Added",
                    description: `District "${values.districtName}" has been successfully added. ${response?.data?.message || ''}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                formikActions.resetForm();
            },
            onError: (error) => {
                console.error('District insertion failed in component:', error);
                toast({
                    title: "Error Adding District",
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

    return (
        <Box
            p={{ base: 4, sm: 6, md: 8 }} 
            borderWidth="1px"
            borderRadius="md"
            bg={containerBg}
            shadow="sm"
            maxW={{base : 'md', lg: 'xl'}} 
            mx="auto" 
            w="100%" 
            mb = {6}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(formikProps) => (
                    <Form>
                        <VStack spacing={4} align="stretch">
                            <InputField
                                name="districtName"
                                label="District Name"
                                placeholder="Enter new district name"
                                isRequired={true}
                                size="md"
                            />
                            <InputField
                                name="lgdCode"
                                label="LGD Code(3-digit only)"
                                placeholder="Enter new LGD Code"
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
                                    isLoading={formikProps.isSubmitting || isAddingDistrict}
                                    loadingText="Submitting..."
                                    isDisabled={formikProps.isSubmitting || isAddingDistrict || !formikProps.isValid || !formikProps.dirty}
                                    w={{ base: '100%', sm: 'auto' }} 
                                >
                                    Submit
                                </Button>
                                <Button
                                    type="button"
                                    onClick={formikProps.handleReset}
                                    variant="outline"
                                    isDisabled={isAddingDistrict || !formikProps.dirty}
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

export default DistrictForm;