import React, { useState } from 'react';
import {
  Box,
  Divider,
  useToast,
} from '@chakra-ui/react';

import PlaceBeforeVcc from '../../tableData/PlaceBeforeVcc';

// Import the modal component
import PlacementModel from '../../../components/common/PlacementModal'; 

// Import mutation hooks
import { usePlaceVehicleBeforeVcc, useRejectVehicle } from '../../../hooks/transportActions'; 

const ToBePlaced = () => 
{
  // --- Shared Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [actionType, setActionType] = useState(null);

  // --- Initialize Chakra UI Toast ---
  const toast = useToast(); 

  const { mutate: placeMutate, isLoading: isPlacing } = usePlaceVehicleBeforeVcc();
  //   onSuccess: () => {
  //     handleCloseModal();
  //   },
  // });

  const { mutate: rejectMutate, isLoading: isRejecting } = useRejectVehicle();

  const isMutating = isPlacing || isRejecting;

  // --- Modal Handling Callbacks (handleOpenModal, handleCloseModal remain the same) ---
  const handleOpenModal = (vehicle, type) => {
    // console.log(`Opening modal for ${type} action on vehicle:`, vehicle.applicationCode);
    
    // resetPlace();
    // resetReject();

    setSelectedVehicle(vehicle);
    setActionType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setSelectedVehicle(null);
        setActionType(null);
        // resetPlace();
        // resetReject();
    }, 300);
  };

  // --- Modal Submission Handler (with Toasts) ---
  const handleModalSubmitAction = (formValues, vehicleData) => {

    if (!vehicleData || !actionType)
    {
        console.error("Missing vehicle data or action type for submission");
        // Optional: Show error toast if this happens unexpectedly
        toast({
        title: "Submission Error",
        description: "Cannot process action: Missing vehicle data or action type.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
        })
        return;
    }

    // Prepare data for the mutation hook's 'variables' argument
    const mutationVariables = {
        applicationCode: vehicleData.applicationCode,
        data: formValues
    };

    // --- Define common mutation options with toasts ---
    const mutationOptions = {
        onSuccess: (data, variables) => { // Receive data and variables
            console.log(`${actionType} successful (parent):`, data);
            handleCloseModal(); // Close modal on success

            // --- Success Toast ---
            toast({
                title: `Vehicle ${actionType === 'forward' ? 'Forwarded' : 'Rejected'}`,
                description: `Vehicle ${variables.applicationCode} was successfully ${actionType === 'forward' ? 'forwarded' : 'rejected'}.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right", // Or your preferred position
            });
        },
        onError: (error, variables) => { // Receive error and variables
            console.error(`${actionType} failed (parent):`, error);
            // Don't necessarily close modal on error, user might want to retry/fix input

            // --- Error Toast ---
            toast({
                title: `${actionType === 'forward' ? 'Forwarded' : 'Rejection'} Failed`,
                // Attempt to get a meaningful message from the error object
                description: error?.message || `An unexpected error occurred while trying to ${actionType} vehicle ${variables.applicationCode}. Please try again.`,
                status: "error",
                duration: 5000, // Longer duration for errors
                isClosable: true,
                position: "top-right",
            });
        },
    };

    // --- Trigger the mutation ---
    if (actionType === 'forward') {
        console.log("Calling approve mutation hook...");
        placeMutate(mutationVariables, mutationOptions);

    } else if (actionType === 'reject') {
        // Optional: Add specific validation for reject data if needed
        if (!mutationVariables.data || !mutationVariables.data.remarks) {
             console.error("Remarks are required for rejection.");
             toast({
                title: "Validation Error",
                description: "Remarks are required to reject a vehicle.",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top-right",
             })
             return; // Prevent API call
        }
        console.log("Calling reject mutation hook...");
        rejectMutate(mutationVariables, mutationOptions);
    }
  };

  return (
    <Box mt={5}>
        {/* Pass the modal opener function */}
        <PlaceBeforeVcc onOpenModal={handleOpenModal} />
       
        
        {/* Shared modal */}
        
        <PlacementModel
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            vehicle={selectedVehicle}
            actionType={actionType}
            onSubmit={handleModalSubmitAction}
            isLoading={isMutating} // Pass combined loading state
        />
       
    </Box>
  );
};

export default ToBePlaced;