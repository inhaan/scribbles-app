import { memo } from "react";

export const AppFooter = memo(() => {
  return (
    <footer className="pt-10 pb-10 text-xs text-right text-gray-400">
      <i>© 2023 </i>
      <i>developed by inhan</i>
      <div>
        <a
          href="https://iconscout.com/icons/scribble-loop"
          target="_blank"
          rel="noreferrer"
        >
          Free Scribble Loop Icon
        </a>
        by
        <a href="https://iconscout.com/contributors/phosphoricons">
          Phosphor Icons
        </a>
        on <a href="https://iconscout.com">IconScout</a>
      </div>
    </footer>
  );
});
