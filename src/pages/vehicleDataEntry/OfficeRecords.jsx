import React, { useState, useEffect, useMemo } from "react";
import { HStack, Stack } from "@chakra-ui/react";

// Ensure these paths are correct for your project structure
import SelectField from "../../components/core/formik/SelectField";
import InputField from "../../components/core/formik/InputField";
import TextAreaField from "../../components/core/formik/TextAreaField";
import DatePickerField from "../../components/core/formik/DatePickerField";

import {
  useFetchDistrictName,
  useFetchDistrictRto,
  useFetchFinancialYear,
} from "../../hooks/dataEntryQueries"; // Ensure this path is correct

const OfficeRecords = ({
  values, // Formik values
  setFieldValue, // Formik's setFieldValue
  departmentName,
}) => {
  // Local state to track the selected district code, initialized from Formik values
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(values.registeredDistrict || "");

  const { data: districtData, isLoading: isLoadingDistricts } = useFetchDistrictName();
  const sortedDistrict = districtData?.data; // Assuming data structure is { data: [...] }

  // isLoadingRtos is crucial for the fix
  const { data: districtRtoData, isLoading: isLoadingRtos } = useFetchDistrictRto();
  const allFetchedRtos = districtRtoData?.data; // Assuming data structure is { data: [...] }

  const { data: financialYearsData, isLoading: isLoadingFinancialYears } = useFetchFinancialYear();
  const sortedFinancial = financialYearsData?.data; // Assuming data structure is { data: [...] }

  // Static RTO options, always available
  const staticRtoOptions = useMemo(() => [
    { districtRtoCode: "ML01_STATIC_KEY", rtoCode: "ML 01" }, // Use unique keys
    { districtRtoCode: "ML02_STATIC_KEY", rtoCode: "ML 02" },
  ], []);

  // Effect to synchronize local selectedDistrictCode with Formik's values.registeredDistrict
  // This is important if values.registeredDistrict can be changed externally or by other effects.
  useEffect(() => {
    if (values.registeredDistrict !== selectedDistrictCode) {
      setSelectedDistrictCode(values.registeredDistrict || "");
    }
  }, [values.registeredDistrict]);

  // Memoized derivation of RTO options based on selected district and fetched data
 // baseRtoOptions: These are the options derived from static list + fetched dynamic list (once loaded)
  const baseRtoOptions = useMemo(() => {
    let dynamicRtos = [];
    if (!isLoadingRtos && selectedDistrictCode && allFetchedRtos && Array.isArray(allFetchedRtos)) {
      dynamicRtos = allFetchedRtos.filter(rto => {
        const rtoDistrictCode = rto.district?.districtCode;
        return rtoDistrictCode !== undefined && String(rtoDistrictCode) === String(selectedDistrictCode);
      });
    }
    const combined = [...staticRtoOptions];
    dynamicRtos.forEach(dynamicRto => {
      if (!staticRtoOptions.some(staticRto => staticRto.rtoCode === dynamicRto.rtoCode)) {
        // Ensure dynamicRto has a unique key, like 'districtRtoCode' or an 'id' from the API
        // For example, if API gives { id: 1, code: 'X01'}, map to { districtRtoCode: `dyn_${1}`, rtoCode: 'X01'}
        combined.push(dynamicRto); 
      }
    });
    return combined;
  }, [selectedDistrictCode, allFetchedRtos, staticRtoOptions, isLoadingRtos]);
  // useEffect to validate and potentially clear rtoCode if it becomes invalid
  useEffect(() => {
    if (!values.rtoCode) { // If no rtoCode is set in Formik, nothing to validate/clear here
      return;
    }
    // IMPORTANT: Defer validation if a district is selected AND its RTOs are still loading
    if (selectedDistrictCode && isLoadingRtos) {
      return; 
    }

    // Proceed with validation once RTOs are loaded (or if no district is selected)
    const currentRtoIsValid = baseRtoOptions.some(
      (option) => option.rtoCode === values.rtoCode
    );
    if (!currentRtoIsValid) {
      setFieldValue('rtoCode', ''); // Clear if invalid
    }
  }, [selectedDistrictCode, values.rtoCode, baseRtoOptions, isLoadingRtos, setFieldValue]);

  // displayRtoOptions: These are the options actually rendered in the SelectField.
  // It ensures that the current `values.rtoCode` (from Formik/server) is always present
  // as an <option>, allowing the SelectField to correctly display it.
  const displayRtoOptions = useMemo(() => {
    const optionMap = new Map();

    // Add options from baseRtoOptions (static or fully loaded dynamic)
    baseRtoOptions.forEach(opt => {
      if (opt.rtoCode) { // Ensure rtoCode is not null/undefined
        optionMap.set(opt.rtoCode, opt);
      }
    });

    // If Formik has an rtoCode and it's not yet in our map (e.g., dynamic RTOs still loading),
    // add it so the SelectField can display the current server value.
    if (values.rtoCode && !optionMap.has(values.rtoCode)) {
      optionMap.set(values.rtoCode, { 
        // Create a unique key for this temporarily added option for React's list rendering
        districtRtoCode: `formik_value_holder_${values.rtoCode}`, 
        rtoCode: values.rtoCode 
      });
    }
    
    return Array.from(optionMap.values());
  }, [baseRtoOptions, values.rtoCode]);


  const handleDistrictChange = (e) => {
    const newDistrictCode = e.target.value;
    setSelectedDistrictCode(newDistrictCode); 
    setFieldValue('registeredDistrict', newDistrictCode); 
    
    // If district is cleared by user, and current rtoCode is not a static one, clear rtoCode.
    // The main validation useEffect will handle other cases (e.g., when a new district is selected).
    if (!newDistrictCode) {
        if (values.rtoCode && !staticRtoOptions.some(opt => opt.rtoCode === values.rtoCode)) {
            setFieldValue('rtoCode', '');
        }
    }
  };

  return (
    <Stack spacing={4}>
      {/* District Field */}
      <SelectField
        name="registeredDistrict"
        label="District where vehicle was registered"
        onChange={handleDistrictChange}
        placeholder="Select District Name"
      >
        {isLoadingDistricts && <option value="">Loading districts...</option>}
        {!isLoadingDistricts && sortedDistrict?.map((district) => (
          <option key={district.districtCode} value={district.districtCode}>
            {district.districtName}
          </option>
        ))}
      </SelectField>

      {/* RTO Code and Vehicle Number */}
      <HStack align="flex-end" spacing={4}>
        <SelectField
          name="rtoCode"
          label="RTO Code"
          placeholder="Select RTO" // This placeholder is usually part of your SelectField component
        >
          {/* 1. Show a "Loading..." option if a district is selected and its RTOs are being fetched */}
          {selectedDistrictCode && isLoadingRtos && (
            <option value="">Loading RTOs for selected district...</option>
          )}

          {/* 2. Render the actual selectable options from displayRtoOptions.
               This list (displayRtoOptions) is guaranteed to contain an option
               for `values.rtoCode` if `values.rtoCode` is set. */}
          {displayRtoOptions.map((rto) => (
            // Ensure each option has a unique key. `rto.districtRtoCode` should be unique.
            // If not, use `opt-${rto.rtoCode}` or a combination if rtoCode itself might not be unique across different (districtRtoCode) entities.
            // However, rto.rtoCode (the value) should be unique for selection purposes.
            <option key={rto.districtRtoCode || `opt_key_${rto.rtoCode}`} value={rto.rtoCode}>
              {rto.rtoCode}
            </option>
          ))}
        </SelectField>

        <InputField
          name="vehicleRegistrationNumber"
          label="Vehicle Number (e.g., AA 1234)"
          onChange={(e) => {
            setFieldValue('vehicleRegistrationNumber', e.target.value.toUpperCase());
          }}
          placeholder="e.g., AA 1234"
        />
      </HStack>

      {/* Financial Year */}
      <SelectField
        name="financialYearCode"
        label="Financial Year"
        placeholder="Select Financial Year"
      >
        {isLoadingFinancialYears && <option value="">Loading financial years...</option>}
        {!isLoadingFinancialYears && sortedFinancial?.map((financialYear) => (
          <option
            key={financialYear.financialyearcode}
            value={financialYear.financialyearcode}
          >
            {financialYear.financialYearFrom} - {financialYear.financialYearTo}
          </option>
        ))}
      </SelectField>

      <InputField
        name="departmentNameDisplay"
        label="Department to which vehicle belongs to"
        value={departmentName}
        isReadOnly
        bg="gray.100"
      />

      <InputField 
        name = "departmentCode"
        type="hidden"
        isRequired = {false}
      />

      <InputField
        name="officeName"
        label="Name of the office to which the vehicle belongs"
      />
      <InputField
        name="officerDesignation"
        label="Designation of officer to which the vehicle is allocated"
      />
      <TextAreaField name="premises" label="Premises" />
      <TextAreaField name="address1" label="Address 1" />
      <TextAreaField name="address2" label="Address 2" isRequired={false} />
      <InputField
        name="directorateLetterNo"
        label="Directorate letter no."
        isRequired={false}
      />
      <DatePickerField
        name="directorateLetterDate"
        label="Directorate letter Date"
        isRequired={false}
      />
      <InputField
        name="forwardingLetterNo"
        label="Govt. forwarding letter no."
      />
      <DatePickerField
        name="govForwardingLetterDate"
        label="Govt. forwarding letter date"
      />
    </Stack>
  );
};

export default OfficeRecords;