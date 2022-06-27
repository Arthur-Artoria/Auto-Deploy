import { Box, Button, FormControl } from '@mui/material';
import React, { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AppTextField } from './AppTextField';
import { ProjectDeploys } from './ProjectDeploys';
import { ProjectFilePaths } from './ProjectFilePaths';
import { ProjectRemotePath } from './ProjectRemotePath';
import { ProjectRemoteShell } from './ProjectRemoteShell';

interface ProjectProperties {
  project: Project;
  onSubmit: (project: Project) => void;
}

/**
 *
 * @param param
 * @returns
 */
export function ProjectForm({ project, onSubmit }: ProjectProperties) {
  const methods = useForm({ defaultValues: project });
  const { control, getValues, setValue, reset } = methods;
  const deploys = useWatch({ control, name: 'deploys' });

  useEffect(() => {
    const curProject = getValues();
    if (curProject.id !== project.id) reset(project);
  }, [getValues, project, reset]);

  const handleSelectProjectPath = async () => {
    const data = await window.nodeCrypto.openFileExplorer();
    const projectPath = data.filePaths[0] || '';

    setValue('baseInfo.localPath', projectPath);
  };

  const handleSubmit = async () => {
    const project = getValues();
    onSubmit(project);
  };

  return (
    <div>
      <Link to="/">
        <Button>返回列表</Button>
      </Link>

      <FormProvider {...methods}>
        <Box component="form" className="w-600px m-auto flex flex-col">
          <AppTextField
            name="baseInfo.name"
            textFieldProps={{ label: '项目名称' }}
          />

          <AppTextField
            name="baseInfo.localPath"
            textFieldProps={{
              label: '请输入路径',
              InputProps: {
                readOnly: true,
                endAdornment: (
                  <Button onClick={handleSelectProjectPath}>浏览</Button>
                )
              }
            }}
          />

          <AppTextField
            name="build.command"
            textFieldProps={{
              label: '请输入构建命令'
            }}
          />

          {/* FilePaths */}
          <ProjectFilePaths />

          {/* Deploys */}
          <ProjectDeploys deploys={deploys} />

          <ProjectRemotePath />

          <ProjectRemoteShell />

          {/* Submit */}
          <footer className="flex justify-center">
            <FormControl margin="normal">
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </FormControl>
          </footer>
        </Box>
      </FormProvider>
    </div>
  );
}
