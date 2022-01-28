export enum ProjectsRecucerActionType {
  INIT = 'INIT',
  ADDED = 'ADDED',
  CHANGED = 'CHANGED',
  DELETED = 'DELETED'
}
interface ProjectsAction<T extends ProjectsRecucerActionType, P = unknown> {
  type: T;
  payload: P;
}

export type ProjectsReducerAction =
  | ProjectsAction<
      | ProjectsRecucerActionType.CHANGED
      | ProjectsRecucerActionType.ADDED
      | ProjectsRecucerActionType.DELETED,
      Project
    >
  | ProjectsAction<ProjectsRecucerActionType.INIT, Project[]>;

export function projectsReducer(
  projects: Project[],
  action: ProjectsReducerAction
): Project[] {
  switch (action.type) {
    case ProjectsRecucerActionType.INIT: {
      return [...action.payload];
    }

    case ProjectsRecucerActionType.ADDED: {
      return [...projects, action.payload];
    }

    case ProjectsRecucerActionType.CHANGED: {
      const project = action.payload;
      return projects.map((item) => {
        return item.baseInfo?.name === project.baseInfo?.name ? project : item;
      });
    }

    default: {
      throw Error(`未知的 操作：${action.type}`);
    }
  }
}

export const initialProjects: Project[] = [];
