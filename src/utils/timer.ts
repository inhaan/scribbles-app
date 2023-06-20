export const waitAsync = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
