import { Button } from '@mui/material';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ProjectsProvider } from './ProjectsProvider';

export function Projects(): ReactElement {
  return (
    <ProjectsProvider>
      <div id="projects">
        <Link to="/create">
          <Button variant="contained">创建</Button>
        </Link>
      </div>
    </ProjectsProvider>
  );
}
