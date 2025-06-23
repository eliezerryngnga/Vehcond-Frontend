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

import { useAddVehicleType } from '../../../hooks/adminActions';

const validationSchema = Yup.object().shape({
    vehicleTypeDescription: Yup.string().required('Vehicle Type is required'),
});

const VehicleTypeForm = () => {
    const toast = useToast();
    const { mutate: addVehicleTypeMutate, isLoading: isAddingVehicleType } = useAddVehicleType();
    const containerBg = useColorModeValue('white', 'gray.800');

    const initialValues = {
        vehicleTypeDescription: '',
    };

    const handleSubmit = (values, formikActions) => {
        console.log("Form values to submit:", values);
        formikActions.setSubmitting(true);

        const payload = values;

        addVehicleTypeMutate(payload, {
            onSuccess: (response) => {
                console.log('Vehicle Type inserted successfully. Server response:', response);
                toast({
                    title: "Vehicle Type Added",
                    description: `Vehicle Type "${values.roleName}" has been successfully added. ${response?.data?.message || ''}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                formikActions.resetForm();
            },
            onError: (error) => {
                console.error('Vehicle Type insertion failed in component:', error);
                toast({
                    title: "Error Adding Vehicle Type",
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
                                name="vehicleTypeDescription"
                                label="Vehicle Type Name"
                                placeholder="Enter Vehicle Type Name"
                                isRequired={true}
                                size="md"
                            
                            />

                            {/* Responsive Button Stack */}
                            <Stack
                                direction={{ base: 'column', sm: 'row' }} // Column on small, Row on sm and up
                                spacing={3}
                                justifyContent="center" // Aligns to the right when in row
                                width="100%" // Ensures Stack takes full width for column layout
                            >
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    isLoading={formikProps.isSubmitting || isAddingVehicleType} // Use Formik's isSubmitting or mutation's isLoading
                                    loadingText="Submitting..."
                                    isDisabled={formikProps.isSubmitting || isAddingVehicleType || !formikProps.isValid || !formikProps.dirty}
                                    w={{ base: '100%', sm: 'auto' }} // Full width on base, auto on sm and up
                                >
                                    Submit
                                </Button>
                                <Button
                                    type="button"
                                    onClick={formikProps.handleReset}
                                    variant="outline"
                                    isDisabled={isAddingVehicleType || !formikProps.dirty}
                                    w={{ base: '100%', sm: 'auto' }} // Full width on base, auto on sm and up
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

export default VehicleTypeForm;