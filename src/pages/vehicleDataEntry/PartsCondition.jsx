// PartsCondition.jsx

import React from 'react';
import {
    VStack,
    Text,
    Spinner, // Import Spinner for loading state
    Alert,    // Import Alert components for error state
    AlertIcon,
    Box
} from '@chakra-ui/react';
import TextAreaField from '../../components/core/formik/TextAreaField'; // Adjust path if needed
import { useFetchVehicleParts } from '../../hooks/dataEntryQueries'; // Adjust path if needed

const PartsCondition = () => {
    const vehiclePartsQuery = useFetchVehicleParts();
    const sortedVehicleParts = vehiclePartsQuery?.data?.data;
    const isLoading = vehiclePartsQuery.isLoading;
    const isError = vehiclePartsQuery.isError;
    const error = vehiclePartsQuery.error;

    if (isLoading) {
        return (
            <VStack align="stretch" spacing={4} width="100%">
                <Text fontWeight="bold" fontSize="lg" mb={2}>Parts Condition</Text>
                <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                    <Spinner size="lg" />
                </Box>
            </VStack>
        );
    }

    if (isError) {
        return (
            <VStack align="stretch" spacing={4} width="100%">
                <Text fontWeight="bold" fontSize="lg" mb={2}>Parts Condition</Text>
                <Alert status="error">
                    <AlertIcon />
                    There was an error fetching vehicle parts: {error?.message || 'Unknown error'}
                </Alert>
            </VStack>
        );
    }

    return (
        <VStack align="stretch" spacing={4} width="100%">
            <Text fontWeight="bold" fontSize="lg" mb={2}>Parts Condition</Text>
            {sortedVehicleParts && sortedVehicleParts.map((part) => (
                <TextAreaField
                    key={part.vehiclePartCode}
                    label={part.vehiclePartDescription}
                    name={`partsCondition.${part.vehiclePartCode}`}
                    isRequired={false}
                />
            ))}
        </VStack>
    );
};

export default PartsCondition;