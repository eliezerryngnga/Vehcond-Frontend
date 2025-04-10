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

            {/* Total Km Logged */}
            <InputField
                name="totalkms"
                label="Total Kilometers logged"
            />


            {/* Depreciated Value  */}
            <InputField
                name="depreciatedamount"
                label="Depreciated value of the vehicle"
            />

            <TextAreaField
                name="improvements"
                label="Improvement or additional fitments made, if any, and cost thereof"
                isRequired={false}
            />

            <InputField
                name="expenses"
                label="Total expenditure incurred in respect of P.O.L, if borne by the Government"
                isRequired={false}
            />

            <InputField
                name="repairexpenses"
                label="Total expenditure incurred on maintenance till now"
                isRequired={false}
            />

            <InputField
                name="repairslastsixmonths"
                label="Repairs(costing over Rs. 1,000) undertaken during the last 6(six) months before the proposal for condemnation or before the vehicle was shut down"
                isRequired={false}
            />

            <RadioGroupField
                name="whetheraccident"
                label="Whether the vehicle has met with an accident"
                isRequired={false}
            >
                <HStack>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                </HStack>
            </RadioGroupField>

            <RadioGroupField
                name="accidentcaseresolved"
                label="If yes, whether the case in connection with the accident has been settled"
                isRequired={false}
            >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
            </RadioGroupField>

            <TextAreaField
                name="comments"
                label="Views/Comments of the Departmental officer"
                isRequired={false}
            />

            <RadioGroupField
                name="mvireportavailable"
                label="Is MVI Report Available? (Y/N)"
                onChange={(event) => handleMviReportChange(event.target.value)} // Ensure the event value is passed
            >
                <HStack>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                </HStack>
            </RadioGroupField>

            {values.mvireportavailable === 'yes' && (
                <>
                    <PartsCondition />

                    <InputField
                        name="battery"
                        label="Battery Condition"
                        isRequired={false}
                    />
                    <InputField
                        name="tyres"
                        label="Tyres Condition"
                        isRequired={false}
                    />

                    <TextAreaField
                        name="accidentdamage"
                        label="Accident damage of vehicle (from history sheet)"
                        isRequired={false}
                    />

                    <InputField
                        name="mviprice"
                        label="MVI's assessment of current value"
                        isRequired={false}
                    />

                    <TextAreaField
                        name="mviremarks"
                        label="Views/Comments of the MVI officer"
                        isRequired={false}
                    />
                </>
            )}
        </Stack>
    );
};

export default VehicleCondem;