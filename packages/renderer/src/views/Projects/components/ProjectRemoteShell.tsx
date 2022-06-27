import React from 'react';
import { AppTextField } from './AppTextField';

export function ProjectRemoteShell() {
  return (
    <AppTextField
      name="remoteShell"
      textFieldProps={{ label: '请输入远程Shell脚本' }}
    />
  );
}
