import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface ProjectCardProperties {
  project: Project;
  onDelete: (project: Project) => void;
}
export function ProjectCard({ project, onDelete }: ProjectCardProperties) {
  const handleDeleteClick = () => onDelete(project);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {project.baseInfo.name}
        </Typography>
        <Typography className="overflow-ellipsis" variant="body2">
          {project.baseInfo.localPath}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">部署</Button>
        <Link className="no-underline" to={`/projects/${project.id}`}>
          <Button size="small">编辑</Button>
        </Link>
        <Button size="small" onClick={handleDeleteClick}>
          删除
        </Button>
      </CardActions>
    </Card>
  );
}
