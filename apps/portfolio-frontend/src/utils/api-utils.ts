export const interpolatePath = (
  path: string,
  params?: Record<string, string | number>,
) => {
  let interpolatedPath = path;

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      interpolatedPath = interpolatedPath.replace(
        new RegExp(`:${key}`, "g"),
        String(value),
      );
    }
  }

  return interpolatedPath;
};
