import React from 'react'

import { Stack } from "@chakra-ui/react";

import { Form, Formik } from "formik";

import * as yup from "yup";
import SelectField from '../../components/core/formik/SelectField';
import InputField from '../../components/core/formik/InputField';
import TextAreaField from '../../components/core/formik/TextAreaField';
const VehicleInformation = () => {

    const initialValues = {
        vehicleCategory : "",
        descriptOfVehicle : "",
        vehicleManufacturer : "",
        engineNumber : "",
        chassisNumber : "",
        yearOfManufacturer : "",
        dateOfPurchase : "",
        vehiclePurchasePrice : "",
    }

    const vehInfoValidation = yup.object ({
        vehicleCategory : yup
              .string()
              .required("Cannot be blank"),
        descriptOfVehicle : yup
              .string()
              .required("Cannot be blank"),
        vehicleManufacturer : yup
              .string()
              .required("Cannot be blank"),
        engineNumber : yup
                .string()
                .required("Cannot be blank"),
        chassisNumber : yup
            .string()
            .required("Cannot be blank"),
        yearOfManufacturer : yup
            .string()
            .required("Cannot be blank"),
        dateOfPurchase : yup
            .string()
            .required("Cannot be blank"),
        vehiclePurchasePrice : yup
            .string()
            .required("Cannot be blank"),
    })
    
  return (
    <Formik
        initialValues={initialValues}
        validationSchema={vehInfoValidation}
    >
        <Stack as={Form}>
            <SelectField name="vehicleCategory" label="Vehicle Category">

            </SelectField>

            <TextAreaField name="descriptOfVehicle" label="Description of Vehicle"/>

            <SelectField name="vehicleManufacturer" label="Vehicle Manufacturer">

            </SelectField>

            <InputField name="engineNumber" label="Engine Number" placeholder="Max 10 characters Eg. GFTY123V56" />

            <InputField name="chassisNumber" label="Chassis Number" placeholder="Max 17 characters Eg. A1B2C3" />

            <InputField name="yearOfManufacturer" label="Year of manufacturer"/>

            <InputField name="dateOfPurchase" label="Date of purchase"/>

            <InputField name="vehiclePurchasePrice" label="Vehicle purchase price" />
        </Stack>
    </Formik>
  )
}

export default VehicleInformation
