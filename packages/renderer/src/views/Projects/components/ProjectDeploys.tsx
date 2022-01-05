import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import React, { useState } from 'react';
import { DeployTypes } from '../constants';
import { OSSEnvironment } from './OSSEnvironment';
import { RemoteExplorer } from './RemoteExplorer';

interface ProjectDeploysProperties {
  deploys: Project['deploys'];
}

function ProjectDeploy({ deploy }: { deploy: Project['deploys'][0] }) {
  const [deployEnvironment, setDeployEnvironment] = useState('remoteExplorer');

  const handleDeployEnvironmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeployEnvironment(event.target.value);
  };

  return (
    <li>
      <FormControl component="fieldset">
        <FormLabel component="legend">请选择部署环境</FormLabel>
        <RadioGroup value={deployEnvironment} onChange={handleDeployEnvironmentChange} row aria-label="gender">
          <FormControlLabel value="remoteExplorer" control={<Radio />} label="远程服务器" />
          <FormControlLabel value="ossEnvironment" control={<Radio />} label="页面托管平台" />
        </RadioGroup>
      </FormControl>

      {deploy.type === DeployTypes.OSS ? <OSSEnvironment /> : <RemoteExplorer />}
    </li>
  );
}

export function ProjectDeploys({ deploys }: ProjectDeploysProperties) {
  return (
    <ul>
      {deploys.map((deploy) => (
        <ProjectDeploy deploy={deploy} key={deploy.id} />
      ))}
    </ul>
  );
}
