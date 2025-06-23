import React, { useEffect, useState } from "react";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Center,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFetchAllotmentLetter } from "../../hooks/reportQueries";
import PdfViewer from "../core/PDFViewer";

const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const AllotmentLetterPDFModal = ({ rowState, isOpen, onClose, 
  // autoDownload = false 
}) => {

  const [pdfURL, setPdfURL] = useState('');
  const toast = useToast();

  const {
    data: pdfBlob, 
    isLoading,
    isError,
    error,
  } = useFetchAllotmentLetter(
    {
      applicationCode: rowState?.appNo, 
      letterNo: rowState?.letterNo,
    },
    // 2. Options for the query
    {
      // This combines with the hook's internal check.
      // The query will only run if params exist AND the modal is open.
      enabled: isOpen,
      // enabled: isOpen && !!rowState,
      // Optional: Handle errors with a toast
      onError: (err) => {
        toast({
          title: 'Error Loading PDF',
          description: err.response?.data?.detail || 'An unexpected error occurred.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    }
  );

  useEffect(() => {
    if (pdfBlob) {
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfURL(url);

      return () => {
        window.URL.revokeObjectURL(url);
        setPdfURL(''); 
      };
    }
  }, [pdfBlob]); 

  // useEffect(() => {
  //   if(autoDownload && pdfBlob) {
  //     const filename = `Allotment-Letter-${rowState.appNo}.pdf`;
  //     downloadFile(pdfBlob, filename);
  //   }
  // }, [pdfBlob, autoDownload, rowState]);

  const handleDownload = () => {
    if (pdfBlob) {
      const filename = `Allotment-Letter-${rowState.appNo}.pdf`;
      downloadFile(pdfBlob, filename);
    }
  };

  // Helper to render the content based on the query state
  const renderContent = () => {
    if (isLoading) {
      return (
        <Center h="100%" bg="gray.50" borderRadius="md">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text fontSize="lg" color="gray.600" fontWeight="medium">
                Loading Letter...
            </Text>
          </VStack>
        </Center>
      );
    }
    if (isError) {
      return (
        <Center h="100%" bg="red.50" borderRadius="md" p={6}>
          <VStack spacing={3}>
            
            <Text fontSize="xl" color="red.600" fontWeight="bold">
              Failed to Load PDF
            </Text>
            <Text color="red.500">Please close this window and try again.</Text>
          </VStack>
        </Center>
      );
    }
    if (pdfURL) {
      // Assuming PdfViewer is a component that takes a URL
      return <PdfViewer pdfFile={pdfURL} />;
    }
    return null; // Or some initial state message
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)"/>
      <ModalContent bg="white"
        boxShadow="2xl"
        borderRadius="xl"
        overflow="hidden">
        <ModalHeader bg="gray.50"
          borderBottom="1px"
          borderColor="gray.200"
          p={4}
          fontSize="lg"
          fontWeight="bold"
          color="gray.700"><HStack>
         
            <Text>Allotment Letter</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton top={3} right={3} />

        <ModalBody p={4} bg="gray.100" h="80vh">{renderContent()}</ModalBody>

        <ModalFooter as={HStack} bg="gray.50"
          borderTop="1px"
          borderColor="gray.200"
          p={3}>
          <Button
            colorScheme="blue"
            onClick={handleDownload}
            isDisabled={!pdfBlob || isLoading}
          >
            Download
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AllotmentLetterPDFModal;
