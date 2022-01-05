import { Box, Button, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectContext } from '../hooks/ProjectContext';
import { ProjectDeploys } from './ProjectDeploys';

interface ProjectProperties {
  project: Project;
}

/**20
 *
 * TODO ProjectContext ProjectDispatchContext ProjectReducer
 * TODO react-hook-form
 *
 * @param param
 * @returns
 */
export function ProjectForm({ project }: ProjectProperties) {
  const { updateProject } = useProjectContext();

  const [projectPath, setProjectPath] = useState<string>('');
  const handleSelectProjectPath = useCallback(async () => {
    const data = await window.nodeCrypto.openFileExplorer();
    setProjectPath(data.filePaths[0] || '');
  }, []);

  return (
    <div>
      <Link to="/">
        <Button>返回列表</Button>
      </Link>

      <Box component="form" className="w-600px m-auto flex flex-col">
        <TextField
          label="项目名称"
          margin="normal"
          value={project.baseInfo.name}
          onChange={(event) =>
            updateProject((draft) => {
              draft.baseInfo.name = event.target.value;
            })
          }
        />

        <TextField
          fullWidth
          label="请输入路径"
          variant="outlined"
          value={projectPath}
          margin="normal"
          onChange={(event) => setProjectPath(event.target.value)}
          InputProps={{
            readOnly: true,
            endAdornment: <Button onClick={handleSelectProjectPath}>浏览</Button>
          }}
        />

        <TextField label="请输入构建命令" variant="outlined" defaultValue="yarn build" margin="normal" fullWidth />

        <ProjectDeploys deploys={project.deploys || []} />
      </Box>
    </div>
  );
}
