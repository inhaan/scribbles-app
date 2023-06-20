import { useReducer } from "react";
import { IScribble, IViewModel } from "../types/scribbles";

interface IState {
  scribbles: IScribble[];
  viewModels: IViewModel[];
}

interface IScribbleAddAction {
  type: "ADD";
  payload: IScribble;
}
interface IScribbleUpdateContentAction {
  type: "UPDATE_CONTENT";
  payload: { id: string; content: string };
}
interface IScribbleUpdateDrawingAction {
  type: "UPDATE_DRAWING";
  payload: { id: string; drawing: string };
}
interface IScribbleDeleteAction {
  type: "DELETE";
  payload: { id: string };
}
interface IScribbleClearAction {
  type: "CLEAR";
}
interface IScribbleToDeleteAction {
  type: "TO_DELETE";
  payload: { id: string };
}
interface IScribbleCreatedAction {
  type: "CREATED";
  payload: { id: string };
}
interface IScribbleInitAction {
  type: "INIT";
  payload: { scribbles?: IScribble[] };
}

export type IScribblesAction =
  | IScribbleAddAction
  | IScribbleUpdateContentAction
  | IScribbleDeleteAction
  | IScribbleToDeleteAction
  | IScribbleCreatedAction
  | IScribbleInitAction
  | IScribbleUpdateDrawingAction
  | IScribbleClearAction;

function reducer(state: IState, action: IScribblesAction) {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        scribbles: action.payload.scribbles ?? [],
        viewModels: [],
      };
    case "ADD":
      return {
        ...state,
        scribbles: [action.payload, ...state.scribbles],
        viewModels: [
          { id: action.payload.id, toCreate: true },
          ...state.viewModels,
        ],
      };

    case "UPDATE_CONTENT":
      const scribble = state.scribbles.find(
        (scribble) => scribble.id === action.payload.id
      );
      if (!scribble) {
        return state;
      }
      const restScribbles = state.scribbles.filter(
        (scribble) => scribble.id !== action.payload.id
      );

      return {
        ...state,
        scribbles: [
          {
            ...scribble,
            content: action.payload.content,
            timestamp: Date.now(),
          },
          ...restScribbles,
        ],
      };

    case "UPDATE_DRAWING":
      const scribbleToUpdate = state.scribbles.find(
        (scribble) => scribble.id === action.payload.id
      );
      if (!scribbleToUpdate) {
        return state;
      }
      const restScribblesToUpdate = state.scribbles.filter(
        (scribble) => scribble.id !== action.payload.id
      );

      return {
        ...state,
        scribbles: [
          {
            ...scribbleToUpdate,
            drawing: action.payload.drawing,
            timestamp: Date.now(),
          },
          ...restScribblesToUpdate,
        ],
      };

    case "DELETE":
      return {
        ...state,
        scribbles: state.scribbles.filter(
          (scribble) => scribble.id !== action.payload.id
        ),
        viewModels: state.viewModels.filter(
          (viewModel) => viewModel.id !== action.payload.id
        ),
      };
    case "CLEAR":
      return {
        ...state,
        scribbles: [],
        viewModels: [],
      };
    case "TO_DELETE":
      const viewModel = state.viewModels.find(
        (viewModel) => viewModel.id === action.payload.id
      );
      if (viewModel) {
        return {
          ...state,
          viewModels: state.viewModels.map((viewModel) => {
            if (viewModel.id === action.payload.id) {
              return {
                ...viewModel,
                toDelete: true,
              };
            }
            return viewModel;
          }),
        };
      } else {
        return {
          ...state,
          viewModels: [
            ...state.viewModels,
            {
              id: action.payload.id,
              toDelete: true,
            },
          ],
        };
      }
    case "CREATED":
      return {
        ...state,
        viewModels: state.viewModels.map((viewModel) => {
          if (viewModel.id === action.payload.id) {
            return {
              ...viewModel,
              toCreate: false,
            };
          }
          return viewModel;
        }),
      };
    default:
      return state;
  }
}

const initialState: IState = {
  scribbles: [],
  viewModels: [],
};

export const useScribbleReducer = () => {
  return useReducer(reducer, initialState);
};
