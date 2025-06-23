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
    applicationCode: Yup
        .string()
        .required('Application Code is required'),
    registrationNo: Yup
        .string()
        .required('Registration No. is required'),

    priceApproved: Yup
        .string()
        .required('Price Approval selection is required'),
    
    price: Yup.number().when('priceApproved', {
        is: 'Y', 
        then: (schema) => schema
            .required('Price is required when approved')
            .min(0, 'Price cannot be negative (0 is allowed)') 
            .typeError('Price must be a valid number (e.g., 15000.00 or 0.00)'),
        otherwise: (schema) => schema.nullable().optional(), 
    }),
    vccLetterNo: Yup.string().when('priceApproved', {
        is: 'Y',
        then: (schema) => schema.required('VCC Letter No. is required.'),
        otherwise: (schema) => schema.optional(), 
    }),
    vccLetterDate: Yup.date().when('priceApproved', {
        is: 'Y',
        then: (schema) => schema.required('VCC Letter Date is required').nullable(),
        otherwise: (schema) => schema.nullable().optional(), 
    }),
});

const PriceFixationModal = ({
    isOpen,
    onClose,
    vehicle,    
    onSubmit,   
    isLoading,  
}) => {

    const getInitialValues = (currentVehicle) => {

        return {
            applicationCode: currentVehicle?.applicationCode || '',
            registrationNo: currentVehicle?.registrationNo || '',
            priceApproved: '',
            price: 0,
            vccLetterNo: '',
            vccLetterDate: null,
        };
    };

     const handleFormikSubmit = (values, actions) => {
        const submissionValues = { ...values };

        if (values.priceApproved === 'Y') {
          
            submissionValues.price = Number(values.price);
        } else {
            
            submissionValues.price = null;
            submissionValues.vccLetterNo = values.vccLetterNo || null; 
            submissionValues.vccLetterDate = values.vccLetterDate || null; 
           
        }
        onSubmit(submissionValues, vehicle);
    };

    if(!isOpen || !vehicle ) 
    {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay /> 
            <ModalContent>
                <Formik
                    initialValues={getInitialValues(vehicle)}
                    validationSchema={validationSchema}
                    onSubmit={handleFormikSubmit}
                    enableReinitialize 
                >
                    {({ handleSubmit, isSubmitting, values }) => ( 

                        <Form onSubmit={handleSubmit}>
                            <ModalHeader bg="lightblue">
                               Fixation Details
                            </ModalHeader>

                            <ModalCloseButton isDisabled={isLoading || isSubmitting} />
                            
                            <ModalBody pb={6}>
                                <VStack spacing={4}>

                                    <InputField 
                                        name = "applicationCode"
                                        label= "Application Code"
                                        placeholder="e.g. F12412"
                                        isRequired = {true}
                                        size = "sm"
                                        isReadOnly = {true}
                                        bg="gray.300"
                                    />
                                    <InputField 
                                        name = "registrationNo"
                                        label= "Registration No"
                                        placeholder="e.g. ML 02 A 0234"
                                        isRequired = {true}
                                        size = "sm"
                                        isReadOnly = {true}
                                        bg="gray.300"
                                    />
                                    <SelectField
                                        name = "priceApproved"
                                        label = "Price Approval"
                                        placeholder="Select an option"
                                        isRequired={true}
                                        size="sm"
                                    >
                                        <option value='Y'>Yes</option>
                                        <option value = 'N'>No</option>
                                    </SelectField>

                                    {values.priceApproved === 'Y' && (
                                        <>
                                            <InputField
                                                name = "price"
                                                label = "Price to be Fixed"
                                                placeholder = "Price"
                                                isRequired={true}
                                                size="sm"
                                            />

                                            <InputField 
                                                name = "vccLetterNo"
                                                label= "VCC Letter no"
                                                placeholder="letter no"
                                                isRequired = {true}
                                                size = "sm"
                                            />
                                            <DatePickerField
                                                name = "vccLetterDate"
                                                label= "VCC Letter date"
                                                isRequired = {true}
                                                size = "sm"
                                            />
                                        </>
                                    )};
                                </VStack>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme="green"
                                    mr={3}
                                    type="submit"

                                    isLoading={isLoading || isSubmitting}
                                    // isDisabled={isLoading || isSubmitting || !dirty || !isValid}
                                    size="sm"
                                >
                                    Priced
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

export default PriceFixationModal;