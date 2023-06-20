import { IObjectStore } from "./indexedDb";

export const scribblesSchema: IObjectStore = {
  name: "scribbles",
  options: { keyPath: "id" },
};
