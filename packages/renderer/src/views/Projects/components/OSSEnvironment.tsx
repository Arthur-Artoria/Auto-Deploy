import { TextField } from '@mui/material';
import React from 'react';

export function OSSEnvironment() {
  return (
    <>
      <TextField required label="AccessKeyId" margin="normal" />
      <TextField required label="AccessKeySecret" margin="normal" />
      <TextField required label="Endpoint" margin="normal" />
      <TextField label="RoleArn" margin="normal" />
    </>
  );
}
