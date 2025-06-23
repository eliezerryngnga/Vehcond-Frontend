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
    else if (actionType === 'approve') {
        return Yup.object({
            ...commonFields,
        });
    }
    return Yup.object({});
};

const ActionModal = ({
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

        if (type === 'approve') 
        {
            return { ...baseValues };

        } else if (type === 'reject') 
        {
            return { ...baseValues, remarks: '' };
        }
        return {};
    };


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
                                {actionType === 'approve' ? 'Approve Vehicle' : 'Reject Vehicle'}
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
                                    colorScheme={actionType === 'approve' ? 'green' : 'red'}
                                    mr={3}
                                    type="submit"
                                    isLoading={isLoading || isSubmitting}
                                    size="sm"
                                >
                                    {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
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

export default ActionModal;