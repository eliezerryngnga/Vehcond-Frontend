
import React, { useRef } from 'react'

import { 
  Box, 
  Input, 
  Text,
  Textarea,
  useToast, 
} from '@chakra-ui/react'

import { Form, Formik} from "formik";
import * as yup from "yup";

import TextAreaField from '../../components/core/formik/TextAreaField';
import InputField from '../../components/core/formik/InputField';

import SelectField from "../../components/core/formik/SelectField";

import CheckBoxField from "../../components/core/formik/CheckBoxField";

const OfficeRecorsds = () => {

  const formikRef = useRef();
  // const toast = useToast();

  const officeDetails = yup.object({
    districtName: yup
      .string()
      .required("Cannot be blank"),

    rtoNo: yup
    .string()
    .required("Cannot be blank"),

    vehicleRegistrationNumber: yup
      .string()
      .transform((value) => value.toUpperCase())
      .required("Cannot be blank"),

    // financialYear: yup.string().required("this is required"),
    // departmentName: yup.string().required("this is required"),
    // officeName: yup.string().required("this is required"),
    // officerDesignation: yup.string().required("this is required"),
    // premises: yup.string().required("this is required"),
    // address1: yup.string().required("this is required"),
    // address2: yup.string().required("this is required"),
    // directorateLetterNo: yup.string().required("this is required"),
    // directorateLetterDate: yup.string().required("this is required"),
    // govForwardingLetterNo: yup.string().required("this is required"),
    // govForwardingLetterDate : yup.string().required("this is required"),
  });

  const initialValues = {
    districtName: "",
    rtoNo: "",
    vehicleRegistrationNumber: "",
    // financialYear: "",
    // departmentName: "",
    // officeName: "",
    // officerDesignation: "",
    // premises: "",
    // address1: "",
    // address2: "",
    // directorateLetterNo: "",
    // directorateLetterDate: "",
    // govForwardingLetterNo: "",
    // govForwardingLetterDate : "",
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={officeDetails}
      // onSubmit={handleSubmit}
    >
      <Form>
        <Box>
          <Box>
              <SelectField name="districtName" label="District where vehicle was registered">
                <option value="">Select District Name</option>
                <option value="2022">2022</option>
              </SelectField>

              <SelectField name="rtoNo" label="Vehicle Registration Number">
              <option value="">Select District </option>
              </SelectField> 
              
              <InputField name="vehicleRegistrationNumber" isRequired={false} />
              
              <SelectField name="financilaYear" label="Financial Year">
                <option value="">Select Financial Year</option>
              </SelectField>
              
              <SelectField name="departmentName" label="Name of Departments to which vehicle belongs to">

              </SelectField>
              
              <InputField name="officeName" label="Name of the office to which the vehicle belongs" />
              
              <InputField name="officerDesignation" label="Designation of officer to which the vehicle is alloted"/>

              <TextAreaField name="premises" label="Premises"/>

              <TextAreaField name="address1" label="Address 1"/>

              <TextAreaField name="address2" label="Address 2" />

              <InputField name="directorateLetterNo" label="Directorate letter no"/>

              <InputField name="directorateLetterDate" label="Directorate letter Date"/>
              
              <InputField name="govForwardingLetterNo" label="Govt. forwarding letter no"/>
              
              <InputField name="govForwardingLetterDate" label="Govt. forwarding letter date"/>
          </Box>
        </Box>
      </Form>
    </Formik>
  )
}

export default OfficeRecorsds;
