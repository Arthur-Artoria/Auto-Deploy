import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { DeployTypes } from '../constants';
import {
  ProjectDeployContext,
  useProjectDeployContext
} from '../hooks/ProjectDeploy.context';
import { FormField } from './FormField';
import { OSSEnvironment } from './OSSEnvironment';
import { RemoteExplorer } from './RemoteExplorer';

interface ProjectDeploysProperties {
  deploys: Project['deploys'];
}

function ProjectDeploy() {
  const { deploy, index } = useProjectDeployContext();
  const { setValue, control } = useFormContext<Project>();
  const name: `deploys.${number}` = `deploys.${index}`;
  const deployType = useWatch({ control, name: `${name}.type` });

  useEffect(() => {
    const SSHContent: SSHEnvironment = { host: '', username: '' };
    const OSSContent: OSSEnvironment = {
      accessKeyId: '',
      accessKeySecret: '',
      roleArn: '',
      endpoint: ''
    };

    const content: ProjectDeploy['content'] =
      deployType === DeployTypes.SSH ? SSHContent : OSSContent;

    setValue(`${name}.content`, content);
  }, [deployType]);

  return (
    <li>
      <FormControl margin="normal" fullWidth component="fieldset">
        <FormLabel component="legend">请选择部署环境</FormLabel>

        <FormField
          name={`deploys.${index}.type`}
          render={({ field }) => (
            <RadioGroup {...field} row aria-label="gender">
              <FormControlLabel
                value={DeployTypes.SSH}
                control={<Radio />}
                label="远程服务器"
              />
              <FormControlLabel
                value={DeployTypes.OSS}
                control={<Radio />}
                label="页面托管平台"
              />
            </RadioGroup>
          )}
        />
      </FormControl>

      {deploy.type === DeployTypes.OSS ? (
        <OSSEnvironment />
      ) : (
        <RemoteExplorer />
      )}
    </li>
  );
}

export function ProjectDeploys({ deploys }: ProjectDeploysProperties) {
  return (
    <ul>
      {deploys.map((deploy, index) => (
        <ProjectDeployContext.Provider
          value={{ deploy, index }}
          key={deploy.id}
        >
          <ProjectDeploy />
        </ProjectDeployContext.Provider>
      ))}
    </ul>
  );
}
