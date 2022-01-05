export enum ProjectsRecucerActionType {
  ADDED = 'ADDED',
  CHANGED = 'CHANGED',
  DELETED = 'DELETED'
}

export interface Action {
  type: ProjectsRecucerActionType;
  project: Project;
}

export function projectsReducer(projects: Project[], action: Action): Project[] {
  const { type, project } = action;
  switch (type) {
    case ProjectsRecucerActionType.ADDED:
      return [...projects, project];

    case ProjectsRecucerActionType.CHANGED:
      return projects.map((item) => {
        return item.baseInfo?.name === project.baseInfo?.name ? project : item;
      });

    default: {
      throw Error(`未知的 操作：${action.type}`);
    }
  }
}

export const initialProjects: Project[] = [];
