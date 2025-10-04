const EXTERNAL_PROTOCOL = /^(?:[a-z]+:)?\/\//i;

export function withBase(path?: string | null): string | undefined {
  if (path == null) {
    return undefined;
  }

  if (path === "") {
    const base = normalizeBase(import.meta.env.BASE_URL ?? "/");
    return base;
  }

  if (path.startsWith("#") || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }

  if (EXTERNAL_PROTOCOL.test(path)) {
    return path;
  }

  const base = normalizeBase(import.meta.env.BASE_URL ?? "/");
  if (base !== "/") {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    if (normalizedPath.startsWith(base)) {
      return normalizedPath;
    }
  }

  const trimmed = path.replace(/^\/+/, "");
  return `${base}${trimmed}`;
}

export function stripBase(pathname: string): string {
  const base = normalizeBase(import.meta.env.BASE_URL ?? "/");
  if (base === "/") {
    return pathname || "/";
  }
  const normalized = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return normalized === "" ? "/" : normalized;
}

function normalizeBase(base: string): string {
  if (!base || base === "/") {
    return "/";
  }
  return base.endsWith("/") ? base : `${base}/`;
}
