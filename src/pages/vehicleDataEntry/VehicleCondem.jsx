import React from 'react';

import {
    Stack,
    Radio,
    HStack
} from '@chakra-ui/react';

import InputField from '../../components/core/formik/InputField';
import TextAreaField from '../../components/core/formik/TextAreaField';
import RadioGroupField from '../../components/core/formik/RadioGroupField';

// Assuming PartsCondition is another component you've created
import PartsCondition from './PartsCondition'; // Adjust the import path

const VehicleCondem = ({ values, handleMviReportChange }) => {
    return (
        <Stack spacing={4}>
            <InputField
                name="totalKmLogged"
                label="Total Kilometers logged"
            />

            <InputField
                name="dpreciatedValueOfVeh"
                label="Depreciated value of the vehicle"
            />

            <TextAreaField
                name="improvFilmentmade"
                label="Improvement or additional fitments made, if any, and cost thereof"
                isRequired={false}
            />

            <InputField
                name="totalExpendOfPol"
                label="Total expenditure incurred in respect of P.O.L, if borne by the Government"
            />

            <InputField
                name="totalExpendMaintenance"
                label="Total expenditure incurred on maintenance till now"
            />

            <InputField
                name="repairsBeforeCondem"
                label="Repairs(costing over Rs. 1,000) undertaken during the last 6(six) months before the proposal for condemnation or before the vehicle was shut down"
            />

            <RadioGroupField
                name="vehicleHasAccident"
                label="Whether the vehicle has met with an accident"
            >
                <HStack>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                </HStack>
            </RadioGroupField>

            {values.vehicleHasAccident === 'yes' && (
                <RadioGroupField
                    name="caseInAccident"
                    label="If yes, whether the case in connection with the accident has been settled"
                >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                </RadioGroupField>
            )}

            <TextAreaField
                name="commentsOfDeptOfficer"
                label="Views/Comments of the Departmental officer"
            />

            <RadioGroupField
                name="MviReport"
                label="Is MVI Report Available? (Y/N)"
                onChange={(event) => handleMviReportChange(event.target.value)} // Ensure the event value is passed
            >
                <HStack>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                </HStack>
            </RadioGroupField>

            {values.MviReport === 'yes' && (
                <>
                    <PartsCondition />

                    <InputField
                        name="battery"
                        label="Battery Condition"
                    />
                    <InputField
                        name="tyres"
                        label="Tyres Condition"
                    />

                    <TextAreaField
                        name="accidentDamage"
                        label="Accident damage of vehicle (from history sheet)"
                        isRequired={false}
                    />

                    <InputField
                        name="mviPrice"
                        label="MVI's assessment of current value"
                    />

                    <TextAreaField
                        name="mviRemarks"
                        label="Views/Comments of the MVI officer"
                    />
                </>
            )}
        </Stack>
    );
};

export default VehicleCondem;