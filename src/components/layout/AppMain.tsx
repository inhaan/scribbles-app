import { PropsWithChildren, memo } from "react";

export const AppMain = memo(({ children }: PropsWithChildren) => {
  return <main>{children}</main>;
});
