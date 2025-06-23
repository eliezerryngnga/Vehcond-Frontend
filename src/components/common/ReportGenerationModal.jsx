import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    FormControl,    
    FormErrorMessage, 
} from '@chakra-ui/react';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import InputField from '../core/formik/InputField'; 
import DatePickerField from '../core/formik/DatePickerField';
import SelectField from '../core/formik/SelectField';

const validationSchema = Yup.object({
    year: Yup
        .number()
        .required('Year is required'),
    month: Yup
        .number()
        .required('Month is required'),

    day: Yup
        .number()
        .required('Day is required'),
});

const ReportGenerationModal = ({
    isOpen,
    onClose,
    onSubmit,   
    isLoading,  
}) => {

    const getInitialValues = () => {

        return {
            year: '',
            month: '',
            day: '',
        };
    };

     const handleFormikSubmit = (values, actions) => {
        const submissionValues = { ...values };

        onSubmit(submissionValues);
    };

    if(!isOpen ) 
    {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay /> 
            <ModalContent>
                <Formik
                    initialValues={getInitialValues()}
                    validationSchema={validationSchema}
                    onSubmit={handleFormikSubmit}
                    enableReinitialize 
                >
                    {({ handleSubmit, isSubmitting, values }) => ( 

                        <Form onSubmit={handleSubmit}>
                            <ModalHeader bg="lightblue">
                                Report Details
                            </ModalHeader>

                            <ModalCloseButton isDisabled={isLoading || isSubmitting} />
                            
                            <ModalBody pb={6}>
                                <VStack spacing={4}>

                                    <SelectField
                                        name = "year"
                                        label = "Year"
                                        placeholder="Select a Year"
                                        isRequired={false}
                                        size="sm"
                                    >
                                        <option value=''>{'N/A'}</option>
                                        <option value = ''>{'N/A'}</option>
                                    </SelectField>
                                    <SelectField
                                        name = "month"
                                        label = "Month"
                                        placeholder="Select a Month"
                                        isRequired={false}
                                        size="sm"
                                    >
                                        <option value=''>{'N/A'}</option>
                                        <option value = ''>{'N/A'}</option>
                                    </SelectField>

                                    <SelectField
                                        name = "day"
                                        label = "Day"
                                        placeholder="Select a Day"
                                        isRequired={false}
                                        size="sm"
                                    >
                                        <option value=''>{'N/A'}</option>
                                        <option value = ''>{'N/A'}</option>
                                    </SelectField>
                                   
                                </VStack>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme="green"
                                    mr={3}
                                    type="submit"

                                    isLoading={isLoading || isSubmitting}
                                    size="sm"
                                >
                                    Generate
                                </Button>

                                <Button onClick={onClose} size="sm" variant="ghost" isDisabled={isLoading || isSubmitting}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    );
};

export default ReportGenerationModal;