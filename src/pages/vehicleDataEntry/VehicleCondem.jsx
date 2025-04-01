import React from 'react'

import {Form, Formik} from "formik";
import * as yup from "yup";
import InputField from '../../components/core/formik/InputField';
import { Input, Radio } from '@chakra-ui/react';
import TextAreaField from '../../components/core/formik/TextAreaField';
import RadioGroupField from '../../components/core/formik/RadioGroupField';

const VehicleCondem = () => {

    const officeDetails = yup.object({
        totalKmLogged: yup
            .string()
            .required("Cannot be blank"),
        dpreciatedValueOfVeh: yup
    .string()
    .required("Cannot be blank"),
        improvFilmentmade: yup
    .string()
    .required("Cannot be blank"),
        totalExpendOfPol: yup
    .string()
    .required("Cannot be blank"),
        totalExpendMaintenance: yup
    .string()
    .required("Cannot be blank"),
        repairsBeforeCondem: yup
    .string()
    .required("Cannot be blank"),
        vehicleHasAccident: yup
    .string()
    .required("Cannot be blank"),
        caseInAccident: yup
    .string()
    .required("Cannot be blank"),
        commentsOfDeptOfficer: yup
    .string()
    .required("Cannot be blank"),
        MviReport: yup
    .string()
    .required("Cannot be blank"),
      });
    
      const initialValues = {
        totalKmLogged: "",
        dpreciatedValueOfVeh: "",
        improvFilmentmade: "",
        totalExpendOfPol: "",
        totalExpendMaintenance: "",
        repairsBeforeCondem: "",
        vehicleHasAccident: "",
        caseInAccident: "",
        commentsOfDeptOfficer: "",
        MviReport: "",
      }
  return (
    <Formik>
        <Form>
            <InputField name="totalKmLogged" label="Total Kilometers logged"/>
            <InputField name="dpreciatedValueOfVeh" label="Depreciated value of the vehicle"/>
            
            <TextAreaField
                name="improvFilmentmade"
                label="Improvement or additional fitments made, if any, and cost thereof"/>

            <InputField name="totalExpendOfPol" label="Total expenditure incurred in respect of P.O.L, if borne by the Government" />

            <InputField name="totalExpendMaintenance" label="Total expenditure incurred on maintenance till now"/>

            <InputField name="repairsBeforeCondem" label="Repairs(costing over Rs. 1,000) undertaken during the last 6(six) months before the proposal for condemnation or before the vehicle was shut down"/>

            <RadioGroupField name="vehicleHasAccident" label="Whether the vehicle has met with an accident">
                <Radio value='yes'>Yes</Radio>
                <Radio value='no'>No</Radio>
            </RadioGroupField>
            
            <RadioGroupField name="caseInAccident" label="If yes, whether the case in connection with the accident has been settled">
                <Radio value='yes'>Yes</Radio>
                <Radio value='no'>No</Radio>
            </RadioGroupField>

            <TextAreaField name="commentsOfDeptOfficer" label="Views/Comments of the Departmental officer"/>

            <RadioGroupField name="MviReport" label="Is MVI Report Available? (Y/N)">
                <Radio value='yes'>Yes</Radio>
                <Radio value='no'>No</Radio>
            </RadioGroupField>
        </Form>
    </Formik>
  )
}

export default VehicleCondem
