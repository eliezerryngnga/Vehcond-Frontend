import React, { useState } from 'react';
import {
  Box,
  useToast,
} from '@chakra-ui/react';

import EnabledUsersTable from '../../tableData/EnabledUsersTable';
import DisabledUsersTable from '../../tableData/DisabledUsersTable';

import UserCreationForm from '../dataInsertion/UserCreationForm';
import EditUserModal from '../../../components/common/EditUserModal';

// import ChangePasswordForm from '../../../forms/profile/ChangePasswordForm';
// import UpdateProfileForm from '../../../forms/profile/UpdateProfileForm'

const UserCreationPage = () => 
{

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);

  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const toast = useToast();

  const handleOpenEditModal = (userData) => {
    setCurrentUserToEdit(userData);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentUserToEdit(null);
  }


  return (
    <Box mt={5}>

      <UserCreationForm />

      <EnabledUsersTable onOpenModal={handleOpenEditModal}/>
      
      <DisabledUsersTable />

      {currentUserToEdit && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          userData={currentUserToEdit}

          // onSubmit={handleEditUserSubmit}

          isLoading={isSubmittingEdit}
        />
      )}
       
{/*       
      {currentUserToEdit && (
        <ChangePasswordModal
          isOpen={isEditPasswordModalOpen}
          onClose={handleCloseEditPasswordModal}
          userData={currentUserToEdit}

          // onSubmit={handleEditUserSubmit}

          isLoading={isSubmittingEdit}
        />
      )} */}


    </Box>
  );
};

export default UserCreationPage;