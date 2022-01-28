import { Button } from '@mui/material';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from './hooks/ProjectsContext';

export function Projects(): ReactElement {
  const projects = useProjects();

  return (
    <div id="projects">
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`}>{project.baseInfo.name}</Link>
          </li>
        ))}
      </ul>

      <Link to="/create">
        <Button variant="contained">创建</Button>
      </Link>
    </div>
  );
}
