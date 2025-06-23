import React from 'react';
import { Stack } from "@chakra-ui/react";

import SelectField from '../../components/core/formik/SelectField';
import InputField from '../../components/core/formik/InputField';
import TextAreaField from '../../components/core/formik/TextAreaField';
import DatePickerField from '../../components/core/formik/DatePickerField'; // Corrected import name

import {
    useFetchVehicleType,
    useFetchVehicleManufacturer
} from "../../hooks/dataEntryQueries";

// Destructure Formik props if needed, though custom field components might handle them internally
const VehicleInformation = (/* { values, errors, touched, setFieldValue, handleChange } */) => {

    const { data: vehicleTypeData, isLoading: isLoadingVehicleType } = useFetchVehicleType();
    // Assuming data structure is { data: { data: [...] } } or similar, adjust as per your hook's return
    const sortedVehicleType = vehicleTypeData?.data;

    const { data: vehicleManufacturersData, isLoading: isLoadingManufacturer } = useFetchVehicleManufacturer();
    const sortedVehicleManufacturer = vehicleManufacturersData?.data;

    return (
        <Stack spacing={4}> {/* Added spacing to Stack for consistency */}

            {/* Vehicle Category */}
            <SelectField
                name="vehicletypecode"
                label="Vehicle Category"
                placeholder="Select Vehicle Type"
                // isRequired prop visual cue, Yup handles actual validation
            >
                {isLoadingVehicleType && <option value="">Loading types...</option>}
                {!isLoadingVehicleType && sortedVehicleType?.map((vehicleCategory) => (
                    <option key={vehicleCategory.vehicleTypeCode} value={vehicleCategory.vehicleTypeCode}>
                        {vehicleCategory.vehicletypedescription}
                    </option>
                ))}
            </SelectField>

            {/* Vehicle Description */}
            <TextAreaField
                name="vehicledescription"
                label="Description of Vehicle"
                // isRequired prop visual cue
            />

            {/* Vehicle Manufacturer */}
            <SelectField
                name="vehiclemanufacturercode"
                label="Vehicle Manufacturer"
                placeholder="Select Vehicle Manufacturer" // Changed placeholder
                // isRequired prop visual cue
            >
                {isLoadingManufacturer && <option value="">Loading manufacturers...</option>}
                {!isLoadingManufacturer && sortedVehicleManufacturer?.map((vehicleManufacturer) => (
                    <option key={vehicleManufacturer.vehicleManufacturerCode} value={vehicleManufacturer.vehicleManufacturerCode}>
                        {vehicleManufacturer.vehicleManufacturerName}
                    </option>
                ))}
            </SelectField>

            {/* Engine Number */}
            <InputField
                name="engineno"
                label="Engine Number"
                placeholder="Max 10 characters e.g. GFTY123V56" // Corrected placeholder grammar
                // isRequired prop visual cue
             />

             {/* Chassis Number */}
            <InputField
                name="chassisno"
                label="Chassis Number"
                placeholder="Max 17 characters e.g. A1B2C3D4E5F6G7H8I" // More accurate placeholder
                // isRequired prop visual cue
            />

            {/* Year of Manufacturer */}
            <InputField
                name="manufactureyear"
                label="Year of manufacturer"
                type="number" // Good to specify type for browser behavior/validation
                // isRequired prop visual cue
            />

            {/* Date of purchase */}
            <DatePickerField
                name="purchasedate"
                label="Date of purchase"
                // isRequired prop visual cue
            />

            {/* Vehicle Price */}
            <InputField
                name="vehicleprice"
                label="Vehicle purchase price"
                type="number" // Good to specify type
                // isRequired prop visual cue
            />
        </Stack>
    );
};

export default VehicleInformation;