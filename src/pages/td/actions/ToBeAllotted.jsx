import React, { useState } from 'react';
import {
  Box,
  Divider,
  position,
  useToast,
} from '@chakra-ui/react';

import ToBeAllottedTable from '../../tableData/ToBeAllottedTable';

// Import the modal component
import AllotmentModal from '../../../components/common/AllotmentModal'; 
import TenderAndScrapModal from '../../../components/common/TenderAndScrapModal';

// Import mutation hooks
import { useAllotingVehicle, useTenderingVehicle } from '../../../hooks/transportActions'; 

import AllotmentLetterPDFModal from '../../../components/common/AllotmentLetterPDFModal';


const ToBeAllotted = () => 
{
  // --- Shared Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [actionType, setActionType] = useState(null);

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedRowForPdf, setSelectedRowForPdf] = useState(null);


  // --- Initialize Chakra UI Toast ---
  const toast = useToast(); // Call the hook

  const { mutate: allotMutate, isLoading: isAllotting } = useAllotingVehicle();
  const { mutate: tenderMutate, isLoading: isTendering } = useTenderingVehicle();

  const isAllotmentProcessLoading = isAllotting;

  const handleOpenModal = (vehicle, type) => {
    console.log(`Opening modal for ${type} action on vehicle:`, vehicle.applicationCode);
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

    const mutationVariables = {
        applicationCode: vehicleData.applicationCode,
        data: formValues
    };

    const mutationOptions = {
        onSuccess: (data, variables) => {
            handleCloseModal(); 
            
            toast({
                title: `Vehicle ${actionType === 'allot' ? 'Allotted' : 'Tendered'}`,
                description: `Vehicle ${variables.applicationCode} was successfully ${actionType === 'allot' ? 'allotted' : 'tendered'}.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right", 
            });

            if(actionType === 'allot')
            {

              setSelectedRowForPdf({
                appNo: variables.applicationCode,
                letterNo : data.letterNo,
              });
              setIsPdfModalOpen(true);
            }
          },
          onError: (error, variables) => { 
            console.error(`${actionType} failed (parent):`, error);
            toast({
                title: `${actionType === 'allot' ? 'Allottment' : 'Tendered'} Failed`,
                description: error?.message || `An unexpected error occurred while trying to ${actionType} vehicle ${variables.applicationCode}. Please try again.`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
    };

    if (actionType === 'allot') {
        console.log("Calling approve mutation hook...");
        allotMutate(mutationVariables, mutationOptions);

    } else if (actionType === 'tender') {

      console.log("Calling tender mutation hook...")  
        tenderMutate(mutationVariables, mutationOptions);
    }
  };

  return (
    <Box mt={5}>

        <ToBeAllottedTable onOpenModal={handleOpenModal} />

        {actionType === 'allot' && (
          <AllotmentModal
            isOpen={isModalOpen && actionType === 'allot'}
            onClose={handleCloseModal}
            vehicle={selectedVehicle}
            actionType={actionType}
            onSubmit={handleModalSubmitAction}
            isLoading={isAllotmentProcessLoading}
          />
        )}

        {actionType === 'tender' && (
          <TenderAndScrapModal
            isOpen={isModalOpen && actionType === 'tender'}
            onClose={handleCloseModal}
            vehicle={selectedVehicle}
            actionType={actionType}
            onSubmit={handleModalSubmitAction}
            isLoading={isTendering}
          />
        )}

        <AllotmentLetterPDFModal
          isOpen={isPdfModalOpen}
          onClose={() => {
            setIsPdfModalOpen(false);
            setSelectedRowForPdf(null);
          }}
          rowState={selectedRowForPdf}
          // autoDownload={true}
        />
    </Box>
  );
};

export default ToBeAllotted;