import React, { useMemo } from 'react';
import {
    Box,
    Button,
    // HStack,
    useColorModeValue,
    useToast,
    VStack,
    Spinner,
    Stack,
    Text
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import InputField from "../../../components/core/formik/InputField";
import SelectField from "../../../components/core/formik/SelectField";

import { useFetchDepartmentForSelect } from '../../../hooks/dataEntryQueries';
import { useFetchRoleForSelect } from '../../../hooks/adminActions';

const validationSchema = Yup.object().shape({
    username: Yup
        .string()
        .required('Username is required'),
    password: Yup
        .string()
        .required('Password is required'),
    name: Yup
        .string()
        .required('Name of User is required'),
    departmentCode: Yup
        .number()
        .required('Department is required'),
    rolecode: Yup
        .number()
        .required('Role is required'),
    userAccess: Yup
        .string()
        .required('User Access is required'),
});

// userAccessOptions was removed as per request.
// You will need to fetch these options from an API or define them elsewhere.

const UserCreationForm = () => {
    const toast = useToast();
    // FIXME: Replace useAddRoleNameRequest with your actual hook for creating users
    // const { mutate: addDistrictRtoMutate, isLoading: isAddingDistrictRto } = useAddRoleNameRequest();
    //const { mutate: createUserMutate, isLoading: isCreatingUser } = useCreateUserRequest(); // ASSUMPTION

    const {
        data: departmentData,
        isLoading: isLoadingDepartments,
        isError: isErrorDepartments,
        error: departmentsError
    } = useFetchDepartmentForSelect();

    const {
        data: rolesData,
        isLoading: isLoadingRoles,
        isError: isErrorRoles,
        error: rolesError
    } = useFetchRoleForSelect();

    const containerBg = useColorModeValue('white', 'gray.800');

    const sortedDepartments = useMemo(() => {
        if (departmentData?.data && Array.isArray(departmentData.data)) {
            return [...departmentData.data].sort((a, b) =>
                a.departmentName.localeCompare(b.departmentName)
            );
        }
        return [];
    }, [departmentData]);

    const sortedRoles = useMemo(() => {
        if (rolesData?.data && Array.isArray(rolesData.data)) {
            return [...rolesData.data].sort((a, b) =>
                a.role.localeCompare(b.role)
            );
        }
        return [];
    }, [rolesData]);

    const initialValues = {
        username: '',
        password: '',
        name: '',
        departmentCode: '',
        rolecode: '',
        userAccess: '',
    };

    const handleSubmit = (values, formikActions) => {
        console.log("Form values to submit:", values);
        formikActions.setSubmitting(true);

        // Construct the payload for user creation
        // FIXME: Adjust the payload structure according to your backend API requirements
        // const payload = {
        //     username: values.username,
        //     password: values.password,
        //     fullName: values.name, // Or whatever your backend expects for 'name'
        //     departmentId: values.departmentCode, // Assuming backend expects departmentId or departmentCode
        //     roleId: values.roleId,
        //     accessLevel: values.userAccess, // Or userAccess, useraccess - match backend
        // };

        // createUserMutate(payload, {
        //     onSuccess: (response) => {
        //         const selectedDepartmentObj = sortedDepartments.find(d => d.departmentCode === values.departmentCode);
        //         const departmentNameForToast = selectedDepartmentObj ? selectedDepartmentObj.departmentName : values.departmentCode;

        //         console.log('User created successfully. Server response:', response);
        //         toast({
        //             title: "User Created",
        //             description: `User "${values.username}" for department "${departmentNameForToast}" has been successfully created. ${response?.data?.message || ''}`,
        //             status: "success",
        //             duration: 5000,
        //             isClosable: true,
        //             position: "top-right",
        //         });
        //         formikActions.resetForm();
        //     },
        //     onError: (error) => {
        //         console.error('User creation failed:', error);
        //         toast({
        //             title: "Error Creating User",
        //             description: error?.response?.data?.error || error?.message || "An unexpected error occurred.",
        //             status: "error",
        //             duration: 5000,
        //             isClosable: true,
        //             position: "top-right",
        //         });
        //     },
        //     onSettled: () => {
        //         formikActions.setSubmitting(false);
        //     }
        // });
        // Simulate API call for now
        setTimeout(() => {
            console.log("Simulating API call finished for:", values);
             toast({
                 title: "Form Submitted (Simulated)",
                 description: `Data for ${values.username} was prepared. Implement actual API call.`,
                 status: "info",
                 duration: 5000,
                 isClosable: true,
                 position: "top-right",
             });
            formikActions.setSubmitting(false);
            // formikActions.resetForm(); // Uncomment if you want to reset the form after simulated submission
        }, 1000);
    };

    if (isLoadingDepartments || isLoadingRoles) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" h="200px">
                <Spinner size="xl" />
                <Text ml={3}>Loading data...</Text>
            </Box>
        );
    }
    if (isErrorDepartments) {
        return (
            <Box color="red.500" p={5} borderWidth="1px" borderRadius="md" borderColor="red.300" bg="red.50">
                <Text fontWeight="bold">Error loading departments:</Text>
                <Text>{departmentsError?.message || "An unexpected error occurred."}</Text>
            </Box>
        );
    }

    if (isErrorRoles) {
        return (
            <Box color="red.500" p={5} borderWidth="1px" borderRadius="md" borderColor="red.300" bg="red.50">
                <Text fontWeight="bold">Error loading roles:</Text>
                <Text>{rolesError?.message || "An unexpected error occurred."}</Text>
            </Box>
        );
    }

    return (
        <Box
            p={{ base: 4, sm: 6, md: 8 }}
            borderWidth="1px"
            borderRadius="md"
            bg={containerBg}
            shadow="sm"
            maxW={{ base: 'md', lg: 'xl' }}
            mx="auto"
            w="100%"
            mb={6}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {(formikProps) => (
                    <Form>
                        <VStack spacing={4} align="stretch">
                            <InputField
                                name="username"
                                label="Username"
                                placeholder="Enter a username"
                                isRequired={true}
                                size="md"
                            />
                            <InputField
                                name="password"
                                label="Password"
                                placeholder="Enter a password"
                                type="password"
                                isRequired={true}
                                size="md"
                            />
                            <InputField
                                name="name"
                                label="Name of User"
                                placeholder="Enter the full name of the user"
                                isRequired={true}
                                size="md"
                            />
                            <SelectField
                                name="departmentCode"
                                label="Department"
                                placeholder="Select Department"
                                isRequired={true}
                            >
                                {sortedDepartments?.map((department) => (
                                    <option key={department.departmentCode} value={department.departmentCode}>
                                        {department.departmentName}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                name="rolecode"
                                label="Role"
                                placeholder="Select Role"
                                isRequired={true}
                            >
                                {sortedRoles?.map((role) => (
                                    <option key={role.rolecode} value={role.rolecode}>
                                        {role.role}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                name="userAccess"
                                label="User Access"
                                placeholder="Select User Access"
                                isRequired={true}
                            >
                                <option value="true">Enable</option>
                                <option value="false">Disable</option>
                            </SelectField>

                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                spacing={3}
                                justifyContent="center"
                                width="100%"
                                pt={4}
                            >
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    isLoading={formikProps.isSubmitting
                                        // || isCreatingUser
                                    }
                                    loadingText="Submitting..."
                                    isDisabled={formikProps.isSubmitting
                                        // || isCreatingUser
                                        || !formikProps.isValid || !formikProps.dirty}
                                    w={{ base: '100%', sm: 'auto' }}
                                >
                                    Create User
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        formikProps.resetForm();
                                    }}
                                    variant="outline"
                                    isDisabled={
                                        // isCreatingUser ||
                                        !formikProps.dirty
                                    }
                                    w={{ base: '100%', sm: 'auto' }}
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

export default UserCreationForm;