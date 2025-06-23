import React, { useState } from 'react';
import {
  Box,
  Divider,
  useToast,
} from '@chakra-ui/react';

import HeavyVehiclesTable from '../../tableData/HeavyVehiclesTable';

// Import the modal component
import TenderAndScrapModal from '../../../components/common/TenderAndScrapModal'; 

// Import mutation hooks
import { useTenderingVehicle, useScrapingVehicle } from '../../../hooks/transportActions'; 

const TenderHeavyVehicles = () => 
{
  // --- Shared Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [actionType, setActionType] = useState(null);

  // --- Initialize Chakra UI Toast ---
  const toast = useToast(); // Call the hook

  const { mutate: tenderMutate, isLoading: isTendering } = useTenderingVehicle();
  const { mutate: scrapMutate, isLoading: isScraping } = useScrapingVehicle();
  const isMutating = isTendering || isScraping;

  // --- Modal Handling Callbacks (handleOpenModal, handleCloseModal remain the same) ---
  const handleOpenModal = (vehicle, type) => {
    //console.log(`Opening modal for ${type} action on vehicle:`, vehicle.applicationCode);
    setSelectedVehicle(vehicle);
    setActionType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setSelectedVehicle(null);
        setActionType(null);
    }, 300);
  };


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
            //console.log(`${actionType} successful (parent):`, data);
            handleCloseModal(); // Close modal on success

            // --- Success Toast ---
            toast({
                title: `Vehicle ${actionType === 'tender' ? 'Tendered' : 'Scrapped'}`,
                description: `Vehicle ${variables.applicationCode} was successfully ${actionType === 'tender' ? 'tendered' : 'scrapped'}.`,
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
                title: `${actionType === 'tender' ? 'Tender' : 'Scrapped'} Failed`,
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
    if (actionType === 'tender') {
        //console.log("Calling approve mutation hook...");
        tenderMutate(mutationVariables, mutationOptions);

    } else if (actionType === 'scrap') {
        // Optional: Add specific validation for reject data if needed
        // if (!mutationVariables.data || !mutationVariables.data.remarks) {
        //      console.error("Remarks are required for rejection.");
        //      toast({
        //         title: "Validation Error",
        //         description: "Remarks are required to reject a vehicle.",
        //         status: "warning",
        //         duration: 4000,
        //         isClosable: true,
        //         position: "top-right",
        //      })
        //      return; // Prevent API call
        // }
        //console.log("Calling reject mutation hook...");
        scrapMutate(mutationVariables, mutationOptions);
    }
  };

  return (
    <Box mt={5}>
        {/* Pass the modal opener function */}
        <HeavyVehiclesTable onOpenModal={handleOpenModal} />

        
        {/* Shared modal */}
        
        <TenderAndScrapModal
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

export default TenderHeavyVehicles;