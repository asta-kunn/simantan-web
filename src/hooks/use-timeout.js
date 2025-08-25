export const useTimeoutAsync = async (onLoad, delay = 500) => {
  return new Promise((resolve) => {
    const timer = setTimeout(onLoad, delay);
    return resolve(() => clearTimeout(timer));
  });
};
