export function matchPath(pattern, pathname) {
  const patternSegments = pattern.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);

  if (patternSegments.length !== pathSegments.length) return null;

  const params = {};
  for (let index = 0; index < patternSegments.length; index++) {
    const segment = patternSegments[index];
    if (segment.startsWith(":")) {
      params[segment.slice(1)] = decodeURIComponent(pathSegments[index]);
    } else if (segment !== pathSegments[index]) {
      return null;
    }
  }

  return params;
}

export default function matchRoute(routes, pathname) {
  const candidates = Object.entries(routes)
    .filter(([pattern]) => pattern !== "*")
    .sort((a, b) => a[0].split(":").length - b[0].split(":").length);

  for (const [pattern, page] of candidates) {
    const params = matchPath(pattern, pathname);
    if (params) return { pattern, page, params };
  }

  return { pattern: "*", page: routes["*"], params: {} };
}
