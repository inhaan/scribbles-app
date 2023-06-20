import { PropsWithChildren, memo } from "react";

export const AppContents = memo(({ children }: PropsWithChildren) => {
  return <div className="flex flex-col mt-6">{children}</div>;
});
