import _ from 'lodash';
import React from 'react';
import { useProjectDeployContext } from '../hooks/ProjectDeploy.context';
import { AppTextField } from './AppTextField';

const deployFormFieldStyle = {
  width: 'calc(50% - 8px)'
};

const deployContentKeys: (keyof OSSEnvironment)[] = [
  'accessKeyId',
  'accessKeySecret',
  'endpoint',
  'roleArn'
];

const deployTextFields = (deployIndex: number) =>
  deployContentKeys.map((key) => (
    <AppTextField
      name={`deploys.${deployIndex}.content.${key}`}
      key={key}
      textFieldProps={{ label: _.upperFirst(key), style: deployFormFieldStyle }}
    />
  ));

export function OSSEnvironment() {
  const { index } = useProjectDeployContext();
  return (
    <section className="flex flex-wrap justify-between">
      {deployTextFields(index)}
    </section>
  );
}
