import AddIcon from '@mui/icons-material/Add';
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography
} from '@mui/material';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ProjectCard } from './components/ProjectCard';
import { useProjects, useProjectsDispatch } from './hooks/ProjectsContext';
import {
  ProjectsRecucerActionType,
  projectsReducer,
  ProjectsReducerAction
} from './hooks/ProjectsReducer';

function ProjectCreateCard() {
  return (
    <Link to="/create" className="no-underline">
      <Card className="h-full">
        <CardActionArea className="h-full">
          <CardContent className="text-center">
            <AddIcon fontSize="large" className="w-8 h-8" />
            <Typography variant="h6">新增</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export function Projects(): ReactElement {
  const projects = useProjects();
  const dispatch = useProjectsDispatch();

  const handleDeleteClick = async (project: Project) => {
    const { INIT, DELETED } = ProjectsRecucerActionType;
    const action: ProjectsReducerAction = { type: DELETED, payload: project };
    const newProjects = projectsReducer(projects, action);

    dispatch({ type: INIT, payload: newProjects });
    await window.nodeCrypto.saveProjectsConfig(newProjects);
  };

  return (
    <section id="projects" className="p-8">
      <Grid container spacing={4}>
        <Grid item xs={6} sm={4} md={3}>
          <ProjectCreateCard />
        </Grid>

        {projects.map((project) => (
          <Grid minWidth={208} item xs={6} sm={4} md={3} key={project.id}>
            <ProjectCard project={project} onDelete={handleDeleteClick} />
          </Grid>
        ))}
      </Grid>
    </section>
  );
}
