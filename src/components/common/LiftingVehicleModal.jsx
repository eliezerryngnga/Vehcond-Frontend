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

    liftMode: Yup
        .string()
        .required('Lift Approval selection is required'),
    
    liftersName: Yup
        .string()
        .when('liftMode', {
            is: 'Y', 
            then: (schema) => schema
                .required('Lifters Name is is required when approved'),
            otherwise: (schema) => schema.nullable().optional(), 
        }),

    liftersAddress: Yup
        .string()
        .when('liftMode', {
            is: 'Y', 
            then: (schema) => schema
                .required('Lifters Address is required when approved'),
            otherwise: (schema) => schema.nullable().optional(), 
        }),
    forwardingLetterNo: Yup
        .string()
        .when('liftMode', {
            is: 'Y',
            then: (schema) => schema.required('Forwarding Letter No. is required.'),
            otherwise: (schema) => schema.optional(), 
        }),
    forwardingLetterDate: Yup
        .date()
        .when('liftMode', {
            is: 'Y',
            then: (schema) => schema.required('Forwarding Letter Date is required').nullable(),
            otherwise: (schema) => schema.nullable().optional(), 
        }),
    liftedDate: Yup
        .date()
        .when('liftMode', {
            is: 'Y',
            then: (schema) => schema.required('Lifted Date is required').nullable(),
            otherwise: (schema) => schema.nullable().optional(), 
        }),
});

const LiftingVehicleModal = ({
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
            liftMode: '',
            liftersName: currentVehicle?.allotteesname || '',
            liftersAddress: currentVehicle?.allotteesaddress || '',
            forwardingLetterNo: '',
            forwardingLetterDate: null,
            liftedDate: null,
        };
    };

     const handleFormikSubmit = (values, actions) => {
        onSubmit(values);
    };

    if(!isOpen || !vehicle ) 
    {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior='inside'>
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
                               Lifting Vehicle
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
                                        name = "liftMode"
                                        label = "Lift"
                                        placeholder="Select an option"
                                        isRequired={true}
                                        size="sm"
                                    >
                                        <option value='Y'>Yes</option>
                                        <option value = 'N'>No</option>
                                    </SelectField>

                                    {values.liftMode === 'Y' && (
                                        <>
                                            <InputField
                                                name = "liftersName"
                                                label = "Lifter's Name"
                                                
                                                isRequired={true}
                                                size="sm"
                                                isReadOnly={true}
                                                bg="gray.300"
                                            />

                                            <InputField 
                                                name = "liftersAddress"
                                                label= "Lifters Address"
                                                isRequired = {true}
                                                size = "sm"
                                                isReadOnly={true}
                                                bg="gray.300"
                                            />
                                            <InputField 
                                                name = "forwardingLetterNo"
                                                label= "Forwarding Letter No"
                                                placeholder = "Forwarding Letter no"
                                                isRequired = {true}
                                                size = "sm"
                                            />
                                            <DatePickerField
                                                name = "forwardingLetterDate"
                                                label= "Forwarding Letter Date"
                                                isRequired = {true}
                                                size = "sm"
                                            />
                                            <DatePickerField
                                                name = "liftedDate"
                                                label= "Lifted Date"
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
                                    Submit
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

export default LiftingVehicleModal;