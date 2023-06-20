import { PropsWithChildren, memo } from "react";

export const AppContainer = memo(({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-center pt-10 sm:pt-16 bg-gray-100 min-h-screen">
      <div className="w-full max-w-5xl px-3">{children}</div>
    </div>
  );
});
