import { memo, PropsWithChildren, MouseEvent, PointerEvent } from "react";

interface ISubButtonProps extends PropsWithChildren {
  title?: string;
  onClick?: (e: MouseEvent) => void;
  onPointerDown?: (e: PointerEvent) => void;
}

export const SubButton = memo(
  ({ children, title, onClick, onPointerDown }: ISubButtonProps) => {
    return (
      <button
        className="absolute top-0 right-0 mt-3 mr-3 cursor-pointer bg-black/30 rounded-md text-lg text-white p-2 hover:bg-black/50 transition-all"
        title={title}
        onClick={onClick}
        onPointerDown={onPointerDown}
      >
        {children}
      </button>
    );
  }
);
