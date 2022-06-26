import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { UseControllerProps } from 'react-hook-form';
import { FormField } from './FormField';

interface AppTextFieldProperties extends UseControllerProps<Project> {
  textFieldProps?: TextFieldProps;
}

export function AppTextField({ textFieldProps = {}, ...props }: AppTextFieldProperties) {
  return (
    <FormField
      defaultValue=""
      {...props}
      render={({ field }) => <TextField margin="normal" {...{ ...field, ...textFieldProps }} />}
    />
  );
}
