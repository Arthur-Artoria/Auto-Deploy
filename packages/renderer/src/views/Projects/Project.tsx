import React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectForm } from './components/ProjectForm';
import { useProject } from './hooks/Project';
import { useProjects, useProjectsDispatch } from './hooks/ProjectsContext';
import {
  ProjectsRecucerActionType,
  projectsReducer,
  ProjectsReducerAction
} from './hooks/ProjectsReducer';
import { useToast } from '/@/hooks/useToast';

export function Project() {
  const projects = useProjects();
  const params = useParams();
  const dispatch = useProjectsDispatch();
  const projectId = params.id || '';
  const project = useProject(projectId);
  const { enqueueSnackbar } = useToast();

  const handleSubmit = async (project: Project) => {
    const action: ProjectsReducerAction = {
      type: ProjectsRecucerActionType.CHANGED,
      payload: project
    };
    const nextProjects = projectsReducer(projects, action);

    await window.nodeCrypto.saveProjectsConfig(nextProjects);

    enqueueSnackbar.success('保存成功！');
    dispatch({ type: ProjectsRecucerActionType.INIT, payload: nextProjects });
  };

  return project && <ProjectForm project={project} onSubmit={handleSubmit} />;
}
