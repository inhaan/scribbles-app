export interface IHasId {
  id: string;
}

export interface IScribble extends IHasId {
  id: string;
  content?: string;
  drawing?: string;
  timestamp: number;
}

export interface IViewModel {
  id: string;
  toCreate?: boolean;
  toDelete?: boolean;
}

export enum EditorMode {
  Draw,
  Text,
}

export enum DrawMode {
  Pen,
  Eraser,
}
