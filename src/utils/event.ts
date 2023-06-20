import { MouseEvent } from "react";

export const isMouseEvent = (e: any): e is MouseEvent => {
  return e.type.startsWith("mouse");
};
