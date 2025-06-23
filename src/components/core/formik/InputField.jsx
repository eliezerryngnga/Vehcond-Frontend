import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Field } from "formik";

const InputField = ({ name, label, isRequired = true, ...others }) => {
  return (
    <Field name={name}>
      {({ field, meta, form }) => (
        <FormControl
          isRequired={isRequired}
          isInvalid={meta.error && meta.touched}
        >
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <Input
            type="text"
            // variant="brand"
            id={name}
            {...field}
            {...others}
            onFocus={(e) => {
              if (e.target.value === "0") {
                form.setFieldValue(name, "");
              }
            }}
          />
          <FormErrorMessage>{meta.error}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

export default InputField;
