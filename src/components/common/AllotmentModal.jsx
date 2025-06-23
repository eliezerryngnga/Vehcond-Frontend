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


const getValidationSchema = () => {
    return Yup.object({
        applicationCode: Yup.string().required('Application Code is required'),
        registrationNo: Yup.string().required('Registration No. is required'),
        
        letterNo: Yup
            .string()
            .trim()
            .required('Letter No. is required.')
            .min(3, 'Letter No. must be at least 3 characters long.')
            .max(50, 'Letter No. cannot be longer than 50 characters.')
            .matches(/^[a-z0-9\/-]+$/i, 'Letter No. can only contain letters, numbers, slashes, and hyphens.'),

        letterDate: Yup.date()
            .required('Letter Date is required.')
            .typeError('Please enter a valid date.') 
            .max(new Date(), 'Letter Date cannot be in the future.'),
        
       allotmentDate: Yup.date()
            .required('Allotment Date is required.')
            .typeError('Please enter a valid date.')
            .max(new Date(), 'Allotment Date cannot be in the future.')
            // VERY USEFUL: Ensure allotmentDate is on or after letterDate
            .min(
                Yup.ref('letterDate'), // References the 'letterDate' field
                'Allotment Date cannot be before the Letter Date.'
            ),

        
        allotteesName: Yup.string()
            .trim()
            .required('Allottees Name is required.')
            .min(2, 'Name must be at least 2 characters long.')
            .max(100, 'Name cannot be longer than 100 characters.')
            .matches(/^[a-zA-Z\s.-]+$/, 'Name can only contain letters, spaces, dots, and hyphens.'),
        
        allotteesAddress: Yup.string()
            .trim()
            .max(255, 'Address cannot be longer than 255 characters.')
            .nullable(),
    });
};

const AllotmentModal = ({
    isOpen,
    onClose,
    vehicle,    
    actionType, 
    onSubmit,   
    isLoading,  
}) => {

     console.log("AllotmentModal - vehicle prop:", vehicle);
    console.log("AllotmentModal - isOpen:", isOpen);  

    const getInitialValues = (currentVehicle) => {
         console.log("AllotmentModal - getInitialValues - currentVehicle:", currentVehicle);

            return {
                applicationCode: currentVehicle?.applicationCode || '',
                registrationNo: currentVehicle?.registrationNo || '',
                letterNo: '',
                letterDate: null,
                allotmentDate: null,
                allotteesName: '',
                allotteesAddress: '',
            };
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
                    initialValues={getInitialValues(vehicle)}
                    validationSchema={getValidationSchema(actionType)}
                    onSubmit={handleFormikSubmit}
                    enableReinitialize 
                >
                    {({ handleSubmit, isSubmitting }) => ( 

                        <Form onSubmit={handleSubmit}>
                            <ModalHeader bg="lightblue">
                                Allot Vehicle
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
                                    <DatePickerField
                                        name = "allotmentDate"
                                        label= "Allotment date"
                                        isRequired = {true}
                                        size = "sm"
                                    />
                                    <InputField 
                                        name = "allotteesName"
                                        label= "Allottees Name"
                                        placeholder="Allottees Name"
                                        isRequired = {true}
                                        size = "sm"
                                    />
                                    <TextAreaField
                                        name="allotteesAddress"
                                        label="Allottees Address"
                                        
                                        isRequired={false} 
                                        size="sm"        
                                        rows={4}   
                                    />
                                </VStack>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme={'green'}
                                    mr={3}
                                    type="submit"

                                    isLoading={isLoading || isSubmitting}
                                    // isDisabled={isLoading || isSubmitting || !dirty || !isValid} // Optional: disable if form not touched or invalid
                                    size="sm"
                                >
                                    Confirm Allotment
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

export default AllotmentModal;