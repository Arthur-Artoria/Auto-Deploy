import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProjectsProvider } from '../views/Projects/ProjectsProvider';

export function MainContainer() {
  return (
    <ProjectsProvider>
      <div id="container">
        <Outlet />
      </div>
    </ProjectsProvider>
  );
}
