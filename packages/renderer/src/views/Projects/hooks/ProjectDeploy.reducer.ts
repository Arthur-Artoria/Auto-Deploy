import { useReducer } from 'react';
import { DeployTypes } from '../constants';

type DeployTypeContentMap = Map<DeployTypes, ProjectDeploy['content']>;

export enum DeployReducerActionType {
  SET = 'SET'
}

interface DeployReducerAction {
  type: DeployReducerActionType;
  payload: ProjectDeploy;
}

const getDefaultDeployContent = (
  type: DeployTypes
): ProjectDeploy['content'] => {
  switch (type) {
    case DeployTypes.OSS: {
      return {
        accessKeyId: '',
        accessKeySecret: '',
        endpoint: '',
        roleArn: ''
      };
    }

    case DeployTypes.SSH: {
      return {
        host: '',
        username: ''
      };
    }

    default:
      throw new Error('无效的 Deploy Type!');
  }
};

const useInitialValue = (deploy?: ProjectDeploy): DeployTypeContentMap => {
  const deployTypes: DeployTypes[] = [DeployTypes.SSH, DeployTypes.OSS];

  return new Map(
    deployTypes.map((type) => {
      const content =
        type === deploy?.type ? deploy.content : getDefaultDeployContent(type);

      return [type, content];
    })
  );
};

const reducer = (state: DeployTypeContentMap, action: DeployReducerAction) => {
  switch (action.type) {
    case DeployReducerActionType.SET: {
      const { type, content } = action.payload;
      state.set(type, content);

      return new Map(state);
    }

    default:
      throw new Error('无效的 DeployReducerActionType !');
  }
};

export const useDeployReducer = (deploy?: ProjectDeploy) => {
  const initialValue = useInitialValue(deploy);

  return useReducer(reducer, initialValue);
};
