import React, { useState, useCallback } from 'react';
import {
    Box,
    useToast, // Make sure to import useToast
} from '@chakra-ui/react';

import RoleTable from '../../tableData/RoleTable';
import RoleForm from '../dataInsertion/RoleForm';
import PageAssignmentModal from '../../../components/common/PageAssignmentModal';

// Assuming useFetchPageUrl hook is available at this path
// You might need to adjust the import path for useFetchPageUrl if it's located elsewhere
import { useFetchPageUrl } from '../../../hooks/dataEntryQueries'; // <--- Adjust this path

// TODO: Import your actual mutation hook (e.g., from react-query)
// import { useAssignPagesToRoleMutation } from '../../../hooks/adminMutations';

const RolePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [checkboxStates, setCheckboxStates] = useState({});
    const [isAssigning, setIsAssigning] = useState(false); // For modal's assign button loading state
    // const [initialCheckboxStates, setInitialCheckboxStates] = useState({}); // For tracking changes

    const toast = useToast(); // Initialize toast

    // Fetch all available pages for assignment
    // This hook will run when the RolePage component mounts.
    // The data will be available when the modal needs it.
    const {
        data: pageUrlResponse,
        isLoading: isLoadingPages, // Loading state for all available pages
    } = useFetchPageUrl(); // Assuming this hook doesn't need parameters or fetches all
    const allAvailablePages = pageUrlResponse?.data || [];

    // TODO: Initialize your actual mutation hook
    // const assignPagesMutation = useAssignPagesToRoleMutation();


    const handleOpenModal = useCallback((roleFromTable) => {
        // roleFromTable is the 'row' from RoleTable
        if (!roleFromTable || !allAvailablePages) {
            toast({
                title: "Cannot Open Modal",
                description: "Role data or available pages are not ready.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const currentRoleAssignments = {};
        // const initialAssignments = {}; // For tracking changes

        allAvailablePages.forEach(page => {
            // ASSUMPTION: roleFromTable.assignedPages (or similar) is an array of urlCodes
            // If not, you need to fetch the role's specific permissions here or ensure RoleTable provides them.
            // For now, let's assume roleFromTable might have a property like 'permissions' (array of urlCodes)
            const isAssigned = roleFromTable.permissions?.includes(page.urlCode) || false;
            currentRoleAssignments[page.urlCode] = isAssigned;
            // initialAssignments[page.urlCode] = isAssigned;
        });

        setSelectedRole(roleFromTable);
        setCheckboxStates(currentRoleAssignments);
        // setInitialCheckboxStates(initialAssignments);
        setIsModalOpen(true);
    }, [allAvailablePages, toast]); // Add toast to dependencies

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedRole(null);
            setCheckboxStates({});
            // setInitialCheckboxStates({});
        }, 300); // Match modal close animation (if any)
    };

    const handleCheckboxChange = (urlCode, isChecked) => {
        setCheckboxStates(prevStates => ({
            ...prevStates,
            [urlCode]: isChecked,
        }));
    };

    // TODO: Handle Modal submission.
    const handleAssignPagesSubmit = async () => {
        if (!selectedRole) return;
        setIsAssigning(true);

        const selectedUrlCodes = Object.entries(checkboxStates)
            .filter(([/* urlCode */, isSelected]) => isSelected)
            .map(([urlCode /*, isSelected */]) => urlCode);

        const payload = {
            // Use the identifier from your role object (e.g., rolecode, id)
            roleIdentifier: selectedRole?.rolecode || selectedRole?.id,
            urlCodes: selectedUrlCodes,
        };

        console.log("Submitting payload:", payload);

        // --- Replace with your actual API call logic using a mutation hook ---
        try {
            // Example with a placeholder mutation or direct API call:
            // await assignPagesMutation.mutateAsync(payload);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: 'Pages Assigned Successfully',
                description: `Assigned ${payload.urlCodes.length} pages to role ${payload.roleIdentifier}.`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
            handleCloseModal();
            // TODO: Optionally refetch roles in RoleTable if needed after successful assignment
            // e.g., by calling a refetch function exposed by useFetchAllRoles or invalidating a query cache.
        } catch (error) {
            console.error("Error assigning pages:", error);
            toast({
                title: 'Assignment Failed',
                description: error.message || 'An error occurred while assigning pages.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsAssigning(false);
        }
        // --- End API call logic ---
    };

    // const hasChanges = JSON.stringify(checkboxStates) !== JSON.stringify(initialCheckboxStates);

    return (
        <Box mt={5}>
            <RoleForm />
            <RoleTable onOpenModal={handleOpenModal} />

            {/*
                Modal is rendered only when a role is selected.
                The `allAvailablePages` and `isLoadingPages` come from the hook run on RolePage mount.
            */}
            {selectedRole && isModalOpen && (
                <PageAssignmentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    role={selectedRole} // The role object from RoleTable
                    allPages={allAvailablePages}
                    checkboxStates={checkboxStates}
                    onCheckboxChange={handleCheckboxChange}
                    onAssignClick={handleAssignPagesSubmit}
                    isAssigning={isAssigning}
                    isLoadingPages={isLoadingPages && allAvailablePages.length === 0} // Show loading if pages not yet loaded
                    // Consider passing 'hasChanges' if you want to disable assign button based on it
                    // isDisabled={!hasChanges || isAssigning || (isLoadingPages && allAvailablePages.length === 0)}
                />
            )}
        </Box>
    );
};

export default RolePage;