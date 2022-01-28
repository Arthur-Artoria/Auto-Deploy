import React from 'react';
import { Controller, ControllerProps, useFormContext } from 'react-hook-form';

type FormFiledProperties = ControllerProps<Project>;

export function FormField({ ...props }: FormFiledProperties) {
  const { control } = useFormContext<Project>();

  return <Controller control={control} {...props} />;
}
