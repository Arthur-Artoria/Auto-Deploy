import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from './components/ProjectForm';
import { useProject } from './hooks/Project';
import { useProjects, useProjectsDispatch } from './hooks/ProjectsContext';
import { ProjectsRecucerActionType, projectsReducer, ProjectsReducerAction } from './hooks/ProjectsReducer';
import { useToast } from '/@/hooks/useToast';

export function CreateProject() {
  const project = useProject();
  const projects = useProjects();
  const navigate = useNavigate();
  const dispatch = useProjectsDispatch();
  const { enqueueSnackbar } = useToast();

  const handleSubmit = async (project: Project) => {
    const action: ProjectsReducerAction = {
      type: ProjectsRecucerActionType.ADDED,
      payload: project
    };

    const newProjets = projectsReducer(projects, action);

    await window.nodeCrypto.saveProjectsConfig(newProjets);

    enqueueSnackbar.success('创建成功！');
    dispatch({ type: ProjectsRecucerActionType.INIT, payload: newProjets });
    navigate(`/projects/${project.id}`, { replace: true });
  };

  return <ProjectForm project={project} onSubmit={handleSubmit} />;
}
