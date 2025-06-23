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


    if (actionType === 'tender') {
        return Yup.object({
            ...commonFields,

            letterNo: Yup
                .string()
                .required('VCC Letter No. is required.'),
            
            letterDate: Yup
                .date()
                .required('VCC Letter Date is required'),
                //.nullable(),
        });
    } 
    else if (actionType === 'scrap') {
        return Yup.object({
            ...commonFields,
            
            letterNo: Yup
                .string()
                .required('VCC Letter No. is required.'),
            
            letterDate: Yup
                .date()
                .required('VCC Letter Date is required'),
                //.nullable(),
            
            price: Yup
              .number()
              .required('Price is required'),

            remarks: Yup
              .string()
        });
    }
    return Yup.object(commonFields );
};

const TenderAndScrapModal = ({
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

        if (type === 'scrap') 
        {
            return { 
                ...baseValues,
                letterNo: '',
                letterDate: '',
                price: '',
                remarks: '',
            };

        } else if (type === 'tender') 
        {
            return { 
              ...baseValues, 
              letterNo: '',
                letterDate: '',
            };
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
                                {actionType === 'scrap' ? 'scrap Vehicle' : 'Tender Vehicle'}
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
                                    {actionType === 'scrap' && (
                                        <>
                                            <InputField 
                                                name = "letterNo"
                                                label= "VCC Letter no"
                                                placeholder="letter no"
                                                isRequired = {true}
                                                size = "sm"
                                            />
                                            <DatePickerField
                                                name = "letterDate"
                                                label= "VCC Letter date"
                                                isRequired = {true}
                                                size = "sm"
                                            />
                                            <InputField 
                                                name = "price"
                                                label= "Price to be fixed"
                                                placeholder="Price"
                                                isRequired = {true}
                                                size = "sm"
                                            />
                                            <TextAreaField
                                                name="remarks"
                                                label="Reason for declaring as scrap"
                                                isRequired={false} 
                                                size="sm"        
                                                rows={4}   
                                            />
                                        </>
                                    )}

                                    {actionType === 'tender' && (
                                        <> 
                                            <InputField 
                                                name = "letterNo"
                                                label= "Letter No"
                                                placeholder="Letter no"
                                                isRequired = {true}
                                                size = "sm"
                                            />
                                            <DatePickerField
                                                name = "letterDate"
                                                label= "Letter date"
                                                isRequired = {true}
                                                size = "sm"
                                            />     
                                        </>
                                    )}
                                </VStack>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme={actionType === 'scrap' ? 'red' : 'green'}
                                    mr={3}
                                    type="submit"

                                    isLoading={isLoading || isSubmitting}
                                    // isDisabled={isLoading || isSubmitting || !dirty || !isValid} // Optional: disable if form not touched or invalid
                                    size="sm"
                                >
                                    {actionType === 'scrap' ? 'Confirm Scraping' : 'Confirm Tendering'}
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

export default TenderAndScrapModal;