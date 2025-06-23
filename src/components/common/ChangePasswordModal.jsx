// import React from 'react';
// import {
//     Modal,
//     ModalOverlay,
//     ModalContent,
//     ModalHeader,
//     ModalFooter,
//     ModalBody,
//     ModalCloseButton,
//     Button,
//     VStack,
  
// } from '@chakra-ui/react';

// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';

// import InputField from '../core/formik/InputField'; 
// import SelectField from '../core/formik/SelectField';

// import PasswordField from '../core/formik/PasswordField';

// import { useFetchDepartmentForSelect } from '../../hooks/dataEntryQueries';
// import { useFetchRoleForSelect } from '../../hooks/adminActions';

// const getValidationSchema = () => {
//     return Yup.object({
//         username: Yup.string(),

//         name: Yup
//             .string()
//             .required('Registration No. is required'),
        
//         password: Yup
//             .string()
//             .required('New Password is required')
//     });
// };

// const ChangePasswordModal = ({
//     isOpen,
//     onClose,
//     userData,

//     onSubmit,   
//     isLoading : isSubmittingParent,  
// }) => {

//         const {
//             data: departmentResponse,
//             isLoading: isLoadingDepartments,
//             isError: isErrorDepartments,
//             error: departmentsError
//         } = useFetchDepartmentForSelect();

//         const departments = departmentResponse?.data || [];
    
//         const {
//             data: rolesResponse,
//             isLoading: isLoadingRoles,
//             isError: isErrorRoles,
//             error: rolesError
//         } = useFetchRoleForSelect();

//         const roles = rolesResponse?.data || [];

//     const getInitialValues = (currentUser) => {
//             return {
//                 username: currentUser?.username || '',
//                 name: currentUser?.name || '',
//                 password: ''
//             };
//         }; 
    
//     const handleFormikSubmit = (values) => {
//         onSubmit(values, userData);
//     };

//     if (!isOpen  || !userData) {
//         return null;
//     }

//     return (
//         <Modal isOpen={isOpen} onClose={onClose} isCentered>
//             <ModalOverlay /> 
//             <ModalContent>
//                 <Formik
//                     initialValues={getInitialValues(userData)}

//                     validationSchema={getValidationSchema()}

//                     onSubmit={handleFormikSubmit}
//                     enableReinitialize 
//                 >
//                     {({ handleSubmit, isSubmitting, dirty, isValid }) => ( 

//                         <Form onSubmit={handleSubmit}>
//                             <ModalHeader bg="lightblue">
//                                 Update Password
//                             </ModalHeader>

//                             <ModalCloseButton isDisabled={isSubmittingParent || isSubmitting} />
                            
//                             <ModalBody pb={6}>
//                                 <VStack spacing={4}>

//                                     <InputField 
//                                         name = "name"
//                                         label= "Name of User"
//                                         placeholder="Name of user"
//                                         isRequired = {true}
//                                         size = "sm"
//                                     />

//                                     <InputField 
//                                         name = "username"
//                                         label= "Username"
//                                         placeholder="Username"
//                                         isRequired = {false}
//                                         size = "sm"
//                                         isReadOnly = {true}
//                                         bg="gray.300"
//                                     />

//                                     <PasswordField 
//                                         name = "password"
//                                         label = "User Password"
//                                         place = "Enter new password"
//                                         isRequired = {true}
//                                         size = "sm"
//                                     />
                                        
//                                 </VStack>
//                             </ModalBody>

//                             <ModalFooter>
//                                 <Button
//                                     colorScheme={'green'}
//                                     mr={3}
//                                     type="submit"

//                                     // isLoading={isLoading || isSubmitting}

//                                     isLoading = {isSubmittingParent || isSubmitting}

//                                     isDisabled = {isSubmittingParent || isSubmitting || !dirty || !isValid}
//                                     // isDisabled={isLoading || isSubmitting || !dirty || !isValid} // Optional: disable if form not touched or invalid
//                                     size="sm"
//                                 >
//                                     Update
//                                 </Button>
//                                 <Button onClick={onClose} size="sm" variant="ghost" isDisabled={isSubmittingParent || isSubmitting}>
//                                     Cancel
//                                 </Button>
//                             </ModalFooter>
//                         </Form>
//                     )}
//                 </Formik>
//             </ModalContent>
//         </Modal>
//     );
// };

// export default ChangePasswordModal;