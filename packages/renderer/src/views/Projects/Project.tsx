import React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectForm } from './components/ProjectForm';
import { useProject } from './hooks/Project';

export function Project() {
  const params = useParams();
  const projectId = params.id || '';

  const project = useProject(projectId);

  const handleSubmit = (project: Project) => {
    console.log(project);
  };

  return project && <ProjectForm project={project} onSubmit={handleSubmit} />;
}
