import { useCallback, useMemo } from "react";
import { IScribble } from "../types/scribbles";
import { getStore, initDb } from "../store/indexedDb";
import { scribblesSchema } from "../store/scribblesSchema";
import { IScribblesAction, useScribbleReducer } from "./useScribblesReducer";

const scribblesStore = getStore("scribbles");

export const useScribbles = () => {
  const createScribble = useCallback(
    (content?: string, drawing?: string): IScribble => {
      return {
        id: Date.now().toString(),
        content: content ?? "",
        drawing,
        timestamp: Date.now(),
      };
    },
    []
  );

  const [state, dispatch] = useScribbleReducer();

  const dispatchMiddleware = useCallback(
    (action: IScribblesAction) => {
      switch (action.type) {
        case "ADD":
          scribblesStore?.add(action.payload);
          break;
        case "UPDATE_CONTENT": {
          const target = state.scribbles.find(
            (scribble) => scribble.id === action.payload.id
          );
          if (target) {
            scribblesStore?.update({
              ...target,
              content: action.payload.content,
              timestamp: Date.now(),
            });
          }
          break;
        }
        case "UPDATE_DRAWING": {
          const target = state.scribbles.find(
            (scribble) => scribble.id === action.payload.id
          );
          if (target) {
            scribblesStore?.update({
              ...target,
              drawing: action.payload.drawing,
              timestamp: Date.now(),
            });
          }
          break;
        }
        case "DELETE":
          scribblesStore?.delete(action.payload.id);
          break;
        case "CLEAR":
          scribblesStore?.clear();
          break;
      }
      dispatch(action);
    },
    [state.scribbles, dispatch]
  );

  const initScribbles = useCallback(async () => {
    await initDb([scribblesSchema]);
    const scribbles = await scribblesStore?.getAll<IScribble>();
    dispatch({
      type: "INIT",
      payload: { scribbles },
    });
  }, [dispatch]);

  const sortedScribbles = useMemo(
    () => state.scribbles.sort((a, b) => b.timestamp - a.timestamp),
    [state.scribbles]
  );

  return {
    scribbles: sortedScribbles,
    viewModels: state.viewModels,
    dispatch: dispatchMiddleware,
    createScribble,
    initScribbles,
  };
};
