import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DeployTypes } from '../constants';
import {
  ProjectDeployContext,
  useProjectDeployContext
} from '../hooks/ProjectDeploy.context';
import {
  DeployReducerActionType,
  useDeployReducer
} from '../hooks/ProjectDeploy.reducer';
import { FormField } from './FormField';
import { OSSEnvironment } from './OSSEnvironment';
import { RemoteExplorer } from './RemoteExplorer';

interface ProjectDeploysProperties {
  deploys: Project['deploys'];
}

function ProjectDeploy() {
  const { deploy, index } = useProjectDeployContext();
  const { setValue, getValues } = useFormContext<Project>();
  const [deployContentCache, dispatch] = useDeployReducer(deploy);
  const name: `deploys.${number}` = `deploys.${index}`;

  const handleDeployEnvironmentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const deploy = getValues(`${name}`);
    const nextDeployType: DeployTypes = event.target.value as DeployTypes;
    const nextDeployContent = deployContentCache.get(nextDeployType);

    dispatch({ type: DeployReducerActionType.SET, payload: deploy });
    if (!nextDeployContent) return;

    const nextDeploy = {
      id: deploy.id,
      type: nextDeployType,
      content: nextDeployContent
    };

    setValue(`${name}`, nextDeploy as ProjectDeploy);
  };

  return (
    <li>
      <FormControl margin="normal" fullWidth component="fieldset">
        <FormLabel component="legend">请选择部署环境</FormLabel>

        <FormField
          name={`deploys.${index}.type`}
          render={({ field }) => (
            <RadioGroup
              {...field}
              row
              aria-label="gender"
              onChange={handleDeployEnvironmentChange}
            >
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
