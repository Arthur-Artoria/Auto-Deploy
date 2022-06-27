import React from 'react';
import { AppTextField } from './AppTextField';

export function ProjectRemotePath() {
  return (
    <AppTextField
      name="remotePath"
      textFieldProps={{ label: '请输入远端路径' }}
    />
  );
}
