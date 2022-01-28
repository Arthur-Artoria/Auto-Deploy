import { createContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useCustomContext } from '/@/tools/common';

export const FormContext = createContext<UseFormReturn<Project> | null>(null);

export const useFormContext = () => useCustomContext(FormContext);
