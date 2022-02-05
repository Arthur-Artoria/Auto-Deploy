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
      | ProjectsRecucerActionType.ADDED
      | ProjectsRecucerActionType.DELETED
      | ProjectsRecucerActionType.CHANGED,
      Project
    >
  // | ProjectsAction<ProjectsRecucerActionType.ADDED, Project>
  // | ProjectsAction<ProjectsRecucerActionType.DELETED, Project>
  // | ProjectsAction<ProjectsRecucerActionType.CHANGED, Project>
  | ProjectsAction<ProjectsRecucerActionType.INIT, Project[]>;

export function projectsReducer(
  projects: Project[],
  action: ProjectsReducerAction
): Project[] {
  const { INIT, DELETED, ADDED, CHANGED } = ProjectsRecucerActionType;

  switch (action.type) {
    case INIT: {
      return [...action.payload];
    }

    case ADDED: {
      return [...projects, action.payload];
    }

    case CHANGED: {
      const project = action.payload;
      return projects.map((item) => {
        return item.id === project.id ? project : item;
      });
    }

    case DELETED: {
      return projects.filter((project) => project.id !== action.payload.id);
    }

    default: {
      throw Error(`未知的 操作：${action}`);
    }
  }
}

export const initialProjects: Project[] = [];
