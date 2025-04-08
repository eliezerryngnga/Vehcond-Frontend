import React, {
    useState,
    useEffect
} from "react";

import {
    HStack,
    Stack
} from "@chakra-ui/react";

import SelectField from "../../components/core/formik/SelectField";
import InputField from "../../components/core/formik/InputField";
import TextAreaField from "../../components/core/formik/TextAreaField";
import DatePickerField from "../../components/core/formik/DatePickerField";

import {
    useFetchDistrictName,
    useFetchDistrictRto,
    useFetchFinancialYear,
    useFetchDepartment
} from "../../hooks/dataEntryQueries";

const OfficeRecords = ({ values, errors, touched, setFieldValue, handleChange }) => {
    const [selectedDistrict, setSelectedDistrict] = useState(values.districtName);
    const [filteredRto, setFilteredRto] = useState([]);

    const district = useFetchDistrictName();
    const sortedDistrict = district?.data?.data;

    const districtRto = useFetchDistrictRto();
    const sortedDistrictRto = districtRto?.data?.data;

    const financialYears = useFetchFinancialYear();
    const sortedFinancial = financialYears?.data?.data;

    const department = useFetchDepartment();
    const sortedDepartment = department?.data?.data;

    useEffect(() => {
        if (selectedDistrict && sortedDistrictRto) {
            const filtered = sortedDistrictRto.filter((rto) => rto.districtCode === parseInt(selectedDistrict));
            setFilteredRto(filtered);
            if(!filtered.find(rto => rto.rtoCode === values.rtoNo))
            {
                setFieldValue('rtoNo','');
            }
        } else {
            setFilteredRto([]);
            setFieldValue('rtoNo','');
        }
    }, [selectedDistrict, sortedDistrictRto, setFieldValue, values.rtoNo]);

    useEffect(() => {
        setSelectedDistrict(values.districtName);
    }, [values.districtName]);

    const handleDistrictChange = (e) => {
        const value = e.target.value;
        setSelectedDistrict(value);
        setFieldValue('districtName', value);
    };

    return (
        <Stack spacing={4}>
            {/* District Field */}
            <SelectField
                name="districtName"
                label="District where vehicle was registered"
                onChange={handleDistrictChange}
                placeholder="Select District Name"
            >
                {sortedDistrict?.map((district) => (
                    <option key={district.districtCode} value={district.districtCode}>
                        {district.districtName}
                    </option>
                ))}
            </SelectField>

            {/* RTO Code and Vehicle Number */}
            <HStack align="flex-end">
                <SelectField
                    name="rtoNo"
                    label="RTO Code"
                    placeholder="Select RTO"
                >
                    {filteredRto?.map((rto) => (
                        <option key={rto.districtRtoCode} value={rto.rtoCode}>
                            {rto.rtoCode}
                        </option>
                    ))}
                </SelectField>

                <InputField
                    name="vehicleRegistrationNumber"
                    label="Vehicle Number. Example (AA 1023)"
                    isRequired={false}
                    onChange={(e) => setFieldValue('vehicleRegistrationNumber', e.target.value.toUpperCase())}
                    placeholder = "Vehicle Number. Example (AA 1023)"
                />
            </HStack>

            {/* Financial Year */}
            <SelectField
                name="financialYear"
                label="Financial Year"
                placeholder="Select Financial Year"
            >
                {sortedFinancial?.map((financialYear) => (
                    <option key={financialYear.financialYearCode} value={financialYear.financialYearCode}>
                        {financialYear.financialYearFrom} - {financialYear.financialYearTo}
                    </option>
                ))}
            </SelectField>

            {/* Department Name */}
            <SelectField
                name="departmentName"
                label="Name of Departments to which vehicle belongs to"
                isDisabled
                bg="gray.300"
            >
                {sortedDepartment?.map((departmentName) => (
                    <option key={departmentName.departmentCode} value={departmentName.departmentCode}>
                        {departmentName.departmentName}
                    </option>
                ))}
            </SelectField>

            {/* Office Name */}
            <InputField
                name="officeName"
                label="Name of the office to which the vehicle belongs"
            />

            {/* Office Designation */}
            <InputField
                name="officerDesignation"
                label="Designation of officer to which the vehicle is allocated"
            />

            {/* Premises */}
            <TextAreaField
                name="premises"
                label="Premises"
            />

            {/* Address 1 */}
            <TextAreaField
                name="address1"
                label="Address 1"
            />

            {/* Address 2 */}
            <TextAreaField
                name="address2"
                label="Address 2"
                isRequired={false}
            />

            {/* Directorate Letter Number */}
            <InputField
                name="directorateLetterNo"
                label="Directorate letter no"
            />

            {/* Directorate Letter Date */}
            <DatePickerField
                name="directorateLetterDate"
                label="Directorate letter Date"
            />

            {/* Government Forwarding Letter Number */}
            <InputField
                name="forwardingLetterNo"
                label="Govt. forwarding letter no"
            />

            {/* Government Forwarding Letter Date */}
            <DatePickerField
                name="govForwardingLetterDate"
                label="Govt. forwarding letter date"
            />
        </Stack>
    );
};

export default OfficeRecords;