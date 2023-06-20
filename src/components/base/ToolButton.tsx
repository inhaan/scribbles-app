import { memo, PropsWithChildren } from "react";

interface IToolButtonProps extends PropsWithChildren {
  bg: "sky" | "lime";
  title?: string;
  onClick: () => void;
}
export const ToolButton = memo(
  ({ children, title, bg, onClick }: IToolButtonProps) => {
    let bgClass = "";
    switch (bg) {
      case "sky":
        bgClass = "bg-sky-700/60 hover:bg-sky-800/60 active:bg-sky-900/60";
        break;
      case "lime":
        bgClass = "bg-lime-700/60 hover:bg-lime-800/60 active:bg-lime-900/60";
        break;
    }

    return (
      <div
        className={`rounded-lg shadow-lg text-xl sm:text-2xl text-white p-2 transition-all cursor-pointer ${bgClass}}`}
        title={title}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);
