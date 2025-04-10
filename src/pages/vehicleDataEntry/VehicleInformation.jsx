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

            {/* Vehicle Category */}
            <SelectField
                name="vehicletypecode"
                label="Vehicle Category"
                placeholder="Select Vehicle Type"
            >
                {sortedVehicleType?.map((vehicleCategory) => (
                    <option key={vehicleCategory.vehicleTypeCode} value={vehicleCategory.vehicleTypeCode}>
                        {vehicleCategory.vehicletypedescription}
                    </option>
                ))}
            </SelectField>

            {/* Vehicle Description */}
            <TextAreaField 
                name="vehicledescription" 
                label="Description of Vehicle" 
            />


            {/* Vehicle Manufacturer */}
            <SelectField
                name="vehiclemanufacturercode"
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

            {/* Engine Number */}
            <InputField 
                name="engineno" 
                label="Engine Number" 
                placeholder="Max 10 characters Eg. GFTY123V56" 
             />

             {/* Chassis Number */}
            <InputField 
                name="chassisno" 
                label="Chassis Number" 
                placeholder="Max 17 characters Eg. A1B2C3" 
            />

            {/* Year of Manufacturer */}
            <InputField 
                name="manufactureyear" 
                label="Year of manufacturer" 
            />

            {/* Date of purchase */}
            <DatePickerField
                name="purchasedate" 
                label="Date of purchase" 
            />

            {/* Vehicle Price */}
            <InputField 
                name="vehicleprice" 
                label="Vehicle purchase price" 
            />
        </Stack>
    );
};

export default VehicleInformation;