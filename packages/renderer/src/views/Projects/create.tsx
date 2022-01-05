import React from 'react';
import { ProjectForm } from './components/ProjectForm';
import { useProject } from './hooks/Project';
import { ProjectProvider } from './ProjectProvider';

export function CreateProject() {
  const [project, updateProject] = useProject();

  return (
    <ProjectProvider initialValue={{ project, updateProject }}>
      <ProjectForm project={project} />;
    </ProjectProvider>
  );
}
