import React, { useState } from 'react';
import {
  Box,
  Divider,
  useToast,
} from '@chakra-ui/react';

import NonLiftedTable from '../../tableData/NonLiftedTable';

// Import the modal component
import AllotmentModal from '../../../components/common/AllotmentModal';
import TenderAndScrapModal from '../../../components/common/TenderAndScrapModal'; 

// Import mutation hooks
import {useAllotingVehicle, useTenderingVehicle, useScrapingVehicle } from '../../../hooks/transportActions'; 

const NonLifted = () => 
{
  // --- Shared Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [actionType, setActionType] = useState(null);

  // --- Initialize Chakra UI Toast ---
  const toast = useToast();

  const{ mutate: allotMutate, isLoading: isAlloting} = useAllotingVehicle();
  const { mutate: tenderMutate, isLoading: isTendering } = useTenderingVehicle();
  const { mutate: scrapMutate, isLoading: isScraping } = useScrapingVehicle();
  const isMutating = isAlloting || isTendering || isScraping;

 
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

    let currentActionVerb = '';
    let currentActionPastTense = '';

    switch(actionType)
    {
      case 'allot':
        currentActionVerb = 'Allot';
        currentActionPastTense = 'Allotted';
        break;
      case 'tender':
        currentActionVerb = 'Tender';
        currentActionPastTense = 'Tendered';
        break;
      case 'scrap':
        currentActionVerb = 'Scrap';
        currentActionPastTense = 'Scrapped';
        break;
      default:
        console.error("Unknown action type:", actionType);
        return;
    }
    // --- Define common mutation options with toasts ---
    const mutationOptions = {
        onSuccess: (data, variables) => {
            //console.log(`${actionType} successful (parent):`, data);
            handleCloseModal(); 

       
            toast({
                title: `Vehicle ${currentActionPastTense}`,
                description: `Vehicle ${variables.applicationCode} was successfully ${currentActionPastTense.toLowerCase()}.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right", 
            });
        },
        onError: (error, variables) => { 
            console.error(`${actionType} failed (parent):`, error);
           
            toast({
                title: `${currentActionVerb} Failed`,
                // Attempt to get a meaningful message from the error object
                description: error?.response?.data?.message || error?.message || `An unexpected error occurred while trying to ${currentActionVerb.toLowerCase()} vehicle ${variables.applicationCode}. Please try again.`,
                status: "error",
                duration: 5000, // Longer duration for errors
                isClosable: true,
                position: "top-right",
            });
        },
    };

    // --- Trigger the mutation ---
    if(actionType === 'allot')
    {
      allotMutate(mutationVariables, mutationOptions);
    }
    else if (actionType === 'tender') {
        //console.log("Calling approve mutation hook...");
        tenderMutate(mutationVariables, mutationOptions);

    } else if (actionType === 'scrap') {
        //console.log("Calling reject mutation hook...");
        scrapMutate(mutationVariables, mutationOptions);
    }
  };

  return (
    <Box mt={5}>
        {/* Pass the modal opener function */}
        <NonLiftedTable onOpenModal={handleOpenModal} />

        
        {/* Shared modal */}
        {actionType === 'allot' && selectedVehicle &&(
          <AllotmentModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            vehicle={selectedVehicle}
            actionType={actionType}
            onSubmit={handleModalSubmitAction}
            isLoading={isAlloting}
          />
        )}

        {(actionType === 'tender' || actionType === 'scrap') && selectedVehicle &&(
          <TenderAndScrapModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            vehicle={selectedVehicle}
            actionType={actionType}
            onSubmit={handleModalSubmitAction}
            isLoading={isTendering || isScraping}
          />
        )}

    </Box>
  );
};

export default NonLifted;