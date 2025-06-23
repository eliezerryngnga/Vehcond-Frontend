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

import { useAddFinancialYear } from '../../../hooks/adminActions';

const validationSchema = Yup.object().shape({
    financialyearfrom: Yup.number().required('Financial Year is required'),
});

const FinancialYearForm = () => {
    const toast = useToast();
    const { mutate: addFinancialYearMutate, isLoading: isAddingFinancialYear } = useAddFinancialYear();
    const containerBg = useColorModeValue('white', 'gray.800');

    const initialValues = {
        financialyearfrom: '',
    };

    const handleSubmit = (values, formikActions) => {
        console.log("Form values to submit:", values);
        formikActions.setSubmitting(true);

        const payload = values;

        addFinancialYearMutate(payload, {
            onSuccess: (response) => {
                console.log('Financial Year inserted successfully. Server response:', response);
                toast({
                    title: "Financial Year Added",
                    description: `Financial Year "${values.roleName}" has been successfully added. ${response?.data?.message || ''}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                formikActions.resetForm();
            },
            onError: (error) => {
                console.error('Financial Year insertion failed in component:', error);
                toast({
                    title: "Error Adding Financial Year",
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
            p={{ base: 4, sm: 6, md: 8 }} // Increase padding responsively
            borderWidth="1px"
            borderRadius="md"
            bg={containerBg}
            shadow="sm"
            maxW={{base : 'md', lg: 'xl'}} // Keeps the form constrained
            mx="auto" // Centers the form
            w="100%" // Ensures it takes full width up to maxW
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
                                name="financialyearfrom"
                                label="Financial Year From"
                                placeholder="Financial Year Format(yyyy)"
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
                                    isLoading={formikProps.isSubmitting || isAddingFinancialYear} // Use Formik's isSubmitting or mutation's isLoading
                                    loadingText="Submitting..."
                                    isDisabled={formikProps.isSubmitting || isAddingFinancialYear || !formikProps.isValid || !formikProps.dirty}
                                    w={{ base: '100%', sm: 'auto' }} // Full width on base, auto on sm and up
                                >
                                    Submit
                                </Button>
                                <Button
                                    type="button"
                                    onClick={formikProps.handleReset}
                                    variant="outline"
                                    isDisabled={isAddingFinancialYear || !formikProps.dirty}
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

export default FinancialYearForm;