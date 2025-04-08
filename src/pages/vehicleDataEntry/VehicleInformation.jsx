import React from 'react';
import { Stack } from "@chakra-ui/react";

import SelectField from '../../components/core/formik/SelectField';
import InputField from '../../components/core/formik/InputField';
import TextAreaField from '../../components/core/formik/TextAreaField';

import { useFetchVehicleType, useFetchVehicleManufacturer } from "../../hooks/dataEntryQueries";
import DatePickerField from '../../components/core/formik/DatePickerField';

const VehicleInformation = () => {

    const vehicleType = useFetchVehicleType();
    const sortedVehicleType = vehicleType?.data?.data;
    
    const vehicleManufacturers = useFetchVehicleManufacturer();
    const sortedVehicleManufacturer = vehicleManufacturers?.data?.data;

    return (
        <Stack>
            <SelectField
                name="vehicleCategory"
                label="Vehicle Category"
                placeholder="Select Vehicle Type"
            >
                {/* <option value="">Select Vehicle Type</option> */}
                {sortedVehicleType?.map((vehicleCategory) => (
                    <option key={vehicleCategory.vehicleTypeCode} value={vehicleCategory.vehicleTypeCode}>
                        {vehicleCategory.vehicletypedescription}
                    </option>
                ))}
            </SelectField>

            <TextAreaField 
                name="descriptionOfVehicle" 
                label="Description of Vehicle" 
            />

            <SelectField
                name="vehicleManufacturer"
                label="Vehicle Manufacturer"

                placeholder="Vehicle Manufacturer Name"
            >
                {/* <option value="">Vehicle Manufacturer Name</option> */}
                {sortedVehicleManufacturer?.map((vehicleManufacturer) => (
                    <option key={vehicleManufacturer.vehicleManufacturerCode} value={vehicleManufacturer.vehicleManufacturerCode}>
                        {vehicleManufacturer.vehicleManufacturerName}
                    </option>
                ))}
            </SelectField>

            <InputField 
                name="engineNumber" 
                label="Engine Number" 
                placeholder="Max 10 characters Eg. GFTY123V56" 
             />
            <InputField 
                name="chassisNumber" 
                label="Chassis Number" 
                placeholder="Max 17 characters Eg. A1B2C3" 
            />

            <InputField 
                name="yearOfManufacturer" 
                label="Year of manufacturer" 
            />

            <DatePickerField
                name="dateOfPurchase" 
                label="Date of purchase" 
            />

            <InputField 
                name="vehiclePurchasePrice" 
                label="Vehicle purchase price" 
            />
        </Stack>
    );
};

export default VehicleInformation;