import React, { useState } from 'react';
import {
  Box,
  Divider,
  useToast,
} from '@chakra-ui/react';

import PriceFixationTable from '../../tableData/PriceFixationTable';

// Import the modal component
import PriceFixationModal from '../../../components/common/PriceFixationModal'; 

// Import mutation hooks
import { usePriceVehicle } from '../../../hooks/transportActions'; 

const PriceFixed = () => 
{
  // --- Shared Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // --- Initialize Chakra UI Toast ---
  const toast = useToast(); // Call the hook

  const { mutate: priceVehicleMutate, isLoading: isPricingVehicle } = usePriceVehicle();

  // --- Modal Handling Callbacks (handleOpenModal, handleCloseModal remain the same) ---
  const handleOpenModal = (vehicle) => {

    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setSelectedVehicle(null);
    }, 300);
  };

  // --- Modal Submission Handler (with Toasts) ---
  const handleModalSubmitAction = (formValues, vehicleData) => {

    if (!vehicleData)
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

    const mutationVariables = {
        applicationCode: vehicleData.applicationCode,
        data: formValues
    };

    const mutationOptions = {
        onSuccess: (data, variables) => { 
            handleCloseModal(); 

            // --- Success Toast ---
            toast({
                title: `Price Fixation Successful`,
                description: `Vehicle ${variables.applicationCode} was successfully priced.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        },
       onError: (error, variables) => {
        console.error(`Price fixation failed (parent):`, error);
        let errorMessage = "An unexpected error occurred. Please try again.";
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        toast({
          title: "Price Fixation Failed",
          description: `Failed to price vehicle ${variables.applicationCode}: ${errorMessage}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      },
    };

    // --- Trigger the mutation ---
    priceVehicleMutate(mutationVariables, mutationOptions);
  };

  return (
    <Box mt={5}>

        <PriceFixationTable onOpenModal={handleOpenModal} />
       
        
        {/* Shared modal */}
      {selectedVehicle && (
          <PriceFixationModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            vehicle={selectedVehicle}
          
            onSubmit={handleModalSubmitAction}
            isLoading={isPricingVehicle}
        />
      )}       
    </Box>
  );
};

export default PriceFixed;