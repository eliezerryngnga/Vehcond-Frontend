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

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import InputField from '../core/formik/InputField'; 
import SelectField from '../core/formik/SelectField';

import { useFetchDepartmentForSelect } from '../../hooks/dataEntryQueries';
import { useFetchRoleForSelect } from '../../hooks/adminActions';

const getValidationSchema = () => {
    return Yup.object({
        username: Yup.string(),

        name: Yup
            .string()
            .required('Registration No. is required'),
        
        departmentCode: Yup
            .number()
            .required('Department is required'),
        
        // roleName: Yup
        //     .string()
        //     .required('Role name is required'),

        role: Yup
            .string()
            .required('Role is required')
    });
};

const EditUserModal = ({
    isOpen,
    onClose,
    userData,

    onSubmit,   
    isLoading : isSubmittingParent,  
}) => {

    console.log("EditUserModal userData:", JSON.stringify(userData, null, 2)); // For detailed view
    console.log("EditUserModal userData.departmentCode:", userData?.departmentCode);
    console.log("EditUserModal userData.roleCode:", userData?.roleCode);

        const {
            data: departmentResponse,
            isLoading: isLoadingDepartments,
            isError: isErrorDepartments,
            error: departmentsError
        } = useFetchDepartmentForSelect();

        const departments = departmentResponse?.data || [];
    
        const {
            data: rolesResponse,
            isLoading: isLoadingRoles,
            isError: isErrorRoles,
            error: rolesError
        } = useFetchRoleForSelect();

        const roles = rolesResponse?.data || [];

    const getInitialValues = (currentUser) => {
            return {
                username: currentUser?.username || '',
                name: currentUser?.name || '',
                departmentCode: currentUser?.departmentCode ?? '',
                role: currentUser?.role ?? '',
            };
        }; 
    
    const handleFormikSubmit = (values) => {
        onSubmit(values, userData);
    };

    if (!isOpen  || !userData) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay /> 
            <ModalContent>
                <Formik
                    initialValues={getInitialValues(userData)}

                    validationSchema={getValidationSchema()}

                    onSubmit={handleFormikSubmit}
                    enableReinitialize 
                >
                    {({ handleSubmit, isSubmitting, dirty, isValid }) => ( 

                        <Form onSubmit={handleSubmit}>
                            <ModalHeader bg="lightblue">
                                Edit User Details
                            </ModalHeader>

                            <ModalCloseButton isDisabled={isSubmittingParent || isSubmitting} />
                            
                            <ModalBody pb={6}>
                                <VStack spacing={4}>

                                    <InputField 
                                        name = "username"
                                        label= "Username"
                                        placeholder="Username"
                                        isRequired = {false}
                                        size = "sm"
                                        isReadOnly = {true}
                                        bg="gray.300"
                                    />
                                    <InputField 
                                        name = "name"
                                        label= "Name of User"
                                        placeholder="Name of user"
                                        isRequired = {true}
                                        size = "sm"
                                    />

                                    <SelectField
                                        name="departmentCode"
                                        label="Department"
                                        placeholder={isLoadingDepartments ? "Loading departments..." : "Select Department" }
                                        isRequired={true}
                                    >
                                        {departments?.map((department) => (
                                            <option key={department.departmentCode} value={department.departmentCode}>
                                                {department.departmentName}
                                            </option>
                                        ))}
                                    </SelectField>

                                    <SelectField
                                        name="role"
                                        label="Role"
                                        placeholder={isLoadingRoles ? "Loading Roles...": "Select Role"}
                                        isRequired={true}
                                    >
                                        {roles?.map((role) => (
                                            <option key={role.role} value={role.role}>
                                                {/* {role.role} */}

                                                {role.description}
                                            </option>
                                        ))}
                                    </SelectField>
                                    
                                </VStack>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme={'green'}
                                    mr={3}
                                    type="submit"

                                    // isLoading={isLoading || isSubmitting}

                                    isLoading = {isSubmittingParent || isSubmitting}

                                    isDisabled = {isSubmittingParent || isSubmitting || !dirty || !isValid}
                                    // isDisabled={isLoading || isSubmitting || !dirty || !isValid} // Optional: disable if form not touched or invalid
                                    size="sm"
                                >
                                    Update
                                </Button>
                                <Button onClick={onClose} size="sm" variant="ghost" isDisabled={isSubmittingParent || isSubmitting}>
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

export default EditUserModal;