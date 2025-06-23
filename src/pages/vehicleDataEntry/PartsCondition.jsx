import React from 'react';
import {
    VStack,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle, // Added for better error display
    AlertDescription, // Added for better error display
    Box
} from '@chakra-ui/react';
import TextAreaField from '../../components/core/formik/TextAreaField'; // Adjust path if needed
import { useFetchVehicleParts } from '../../hooks/dataEntryQueries'; // Adjust path if needed

// No Formik props needed here if TextAreaField is Formik-aware and uses the 'name' prop correctly
const PartsCondition = () => {
    const {
        data: vehiclePartsData, // Renamed for clarity
        isLoading,
        isError,
        error
    } = useFetchVehicleParts();

    // Adjust data access based on your hook's actual return structure
    const sortedVehicleParts = vehiclePartsData?.data;

    if (isLoading) {
        return (
            <VStack align="stretch" spacing={4} width="100%" mt={4}> {/* Added mt={4} for spacing */}
                <Text fontWeight="bold" fontSize="lg" mb={2}>Parts Condition Details</Text> {/* Slightly more descriptive title */}
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px"> {/* Added minHeight */}
                    <Spinner size="xl" color="teal.500" thickness="4px" /> {/* Enhanced spinner */}
                </Box>
            </VStack>
        );
    }

    if (isError) {
        return (
            <VStack align="stretch" spacing={4} width="100%" mt={4}>
                <Text fontWeight="bold" fontSize="lg" mb={2}>Parts Condition Details</Text>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box flex="1"> {/* Allow text to wrap */}
                        <AlertTitle>Error Fetching Vehicle Parts!</AlertTitle>
                        <AlertDescription display="block"> {/* Ensure message is on new line */}
                            {error?.response?.data?.message || error?.message || 'An unknown error occurred.'}
                        </AlertDescription>
                    </Box>
                </Alert>
            </VStack>
        );
    }

    // Handle case where data might be successfully fetched but empty or not in expected format
    if (!isLoading && !isError && (!sortedVehicleParts || sortedVehicleParts.length === 0)) {
        return (
            <VStack align="stretch" spacing={4} width="100%" mt={4}>
                <Text fontWeight="bold" fontSize="lg" mb={2}>Parts Condition Details</Text>
                <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <AlertDescription>No vehicle parts information available to list conditions.</AlertDescription>
                </Alert>
            </VStack>
        );
    }

    return (
        <VStack align="stretch" spacing={4} width="100%" mt={4}> {/* Added mt={4} for consistent spacing */}
            <Text fontWeight="bold" fontSize="lg" mb={2}>Parts Condition Details</Text>
            {sortedVehicleParts && sortedVehicleParts.map((part) => (
                <TextAreaField
                    key={part.vehiclePartCode}
                    label={part.vehiclePartDescription || `Condition for Part Code ${part.vehiclePartCode}`} // Fallback label
                    name={`partsCondition.${part.vehiclePartCode}`} // This correctly nests under partsCondition in Formik
                    // isRequired prop could be set to true if every part's condition is mandatory
                    // isRequired={true} // Example: if all parts are required
                    // The actual validation for these being filled when mvireportavailable === 'Y'
                    // is (or should be) handled in VehicleRegistrationForm's Yup schema for partsCondition
                    placeholder={`Describe condition of ${part.vehiclePartDescription.toLowerCase()}`}
                />
            ))}
        </VStack>
    );
};

export default PartsCondition;