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
import TextAreaField from '../core/formik/TextAreaField'
import DatePickerField from '../core/formik/DatePickerField';


const getValidationSchema = (actionType) => {

    const commonFields = {
        applicationCode: Yup.string().required('Application Code is required'),
        registrationNo: Yup.string().required('Registration No. is required'),
    };


    if (actionType === 'reject') {
        return Yup.object({
            ...commonFields,
            remarks: Yup.string()
                .required('Rejection remarks are required')
                //.min(10, 'Remarks must be at least 10 characters long'),
        });
    } 
    else if (actionType === 'forward') {
        return Yup.object({
            ...commonFields,
            vccLetterNo: Yup.string()
                .required('VCC Letter No. is required.'),
            vccLetterDate: Yup.date()
                .required('VCC Letter Date is required')
                //.nullable(),
        });
    }
    return Yup.object(commonFields );
};

const PlacementModal = ({
    isOpen,
    onClose,
    vehicle,    
    actionType, 
    onSubmit,   
    isLoading,  
}) => {

    const getInitialValues = (type, currentVehicle) => {

        const baseValues = {
            applicationCode: currentVehicle?.applicationCode || '',
            registrationNo: currentVehicle?.registrationNo || '',
        };

        if (type === 'forward') 
        {
            return { 
                ...baseValues,
                vccLetterNo: '',
                vccLetterDate: '',
            };

        } else if (type === 'reject') 
        {
            return { ...baseValues, remarks: '' };
        }
        return baseValues;
    };


    // Handler for Formik's submission
    const handleFormikSubmit = (values, actions) => {

        onSubmit(values, vehicle);
    };

    if (!isOpen || !vehicle || !actionType) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay /> 
            <ModalContent>
                <Formik
                    initialValues={getInitialValues(actionType, vehicle)}
                    validationSchema={getValidationSchema(actionType)}
                    onSubmit={handleFormikSubmit}
                    enableReinitialize 
                >
                    {({ handleSubmit, isSubmitting }) => ( 

                        <Form onSubmit={handleSubmit}>
                            <ModalHeader bg="lightblue">
                                {actionType === 'forward' ? 'Forward Vehicle' : 'Reject Vehicle'}
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

                                    {/* --- Conditional Fields --- */}
                                    {actionType === 'forward' && (
                                        <>
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
                                    )}

                                    {actionType === 'reject' && (
                                        <>                                            
                                            <TextAreaField
                                                name="remarks"
                                                label="Rejection Remarks"
                                                placeholder="Enter reasons for rejection..."
                                                isRequired={true} 
                                                size="sm"        
                                                rows={4}        
                                            />
                        
                                        </>
                                    )}
                                </VStack>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme={actionType === 'forward' ? 'green' : 'red'}
                                    mr={3}
                                    type="submit"

                                    isLoading={isLoading || isSubmitting}
                                    // isDisabled={isLoading || isSubmitting || !dirty || !isValid} // Optional: disable if form not touched or invalid
                                    size="sm"
                                >
                                    {actionType === 'forward' ? 'Confirm Forward' : 'Confirm Rejection'}
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

export default PlacementModal;