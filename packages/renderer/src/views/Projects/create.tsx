import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from './components/ProjectForm';
import { useProject } from './hooks/Project';
import { useProjects, useProjectsDispatch } from './hooks/ProjectsContext';
import { ProjectsRecucerActionType } from './hooks/ProjectsReducer';

export function CreateProject() {
  const project = useProject();
  const projects = useProjects();
  const navigate = useNavigate();
  const dispatch = useProjectsDispatch();

  const handleSubmit = async (project: Project) => {
    const newProjets = [...projects, project];

    await window.nodeCrypto.saveProjectsConfig(newProjets);
    dispatch({ type: ProjectsRecucerActionType.ADDED, payload: project });
    navigate(`/projects/${project.id}`, { replace: true });
  };

  return <ProjectForm project={project} onSubmit={handleSubmit} />;
}
