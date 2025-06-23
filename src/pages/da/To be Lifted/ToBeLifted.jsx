import React, { useState } from 'react';
import {
  Box,
  Divider,
  useToast,
} from '@chakra-ui/react';

import LiftTable from '../../tableData/LiftTable';

// Import the modal component
import LiftingVehicleModal from '../../../components/common/LiftingVehicleModal'; 

// Import mutation hooks
import { useLifitngVehicle } from '../../../hooks/transportActions'; 

const ToBeLifted = () => 
{
  // --- Shared Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // --- Initialize Chakra UI Toast ---
  const toast = useToast(); // Call the hook

  const { mutate: liftingVehicleMutate, isLoading: isLiftingVehicle } = useLifitngVehicle;

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
                title: `Lifting Successful`,
                description: `Vehicle ${variables.applicationCode} was successfully lifted.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        },
       onError: (error, variables) => {
        console.error(`Lfiting failed (parent):`, error);
        let errorMessage = "An unexpected error occurred. Please try again.";
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        toast({
          title: "Lifting Failed",
          description: `Failed to lift vehicle ${variables.applicationCode}: ${errorMessage}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      },
    };

    // --- Trigger the mutation ---
    liftingVehicleMutate(mutationVariables, mutationOptions);
  };

  return (
    <Box mt={5}>

        <LiftTable onOpenModal={handleOpenModal} />
       
        
        {/* Shared modal */}
      {selectedVehicle && (
          <LiftingVehicleModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            vehicle={selectedVehicle}
          
            onSubmit={handleModalSubmitAction}
            isLoading={isLiftingVehicle}
        />
      )}       
    </Box>
  );
};

export default ToBeLifted;