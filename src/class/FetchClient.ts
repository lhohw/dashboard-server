import { join as _join } from "path";

class FetchClient {
  constructor(
    public baseUrl: string,
    private initialHeaders?: RequestInit["headers"]
  ) {}
  async get(
    path: string,
    params?: Record<string, any>,
    headers?: RequestInit["headers"]
  ) {
    const { initialHeaders } = this;
    path = this.join(path, params);
    headers = { ...(initialHeaders || {}), ...(headers || {}) };
    try {
      const res = await fetch(path, { method: "get", headers });
      if (res.ok) {
        const text = await res.text();
        try {
          const json = await JSON.parse(text);
          return json;
        } catch (_) {
          return text;
        }
      } else {
        throw new Error(`request failed: ${JSON.stringify(res)}`);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
  private join(path: string, params?: Record<string, any>) {
    const { baseUrl } = this;
    path = _join(baseUrl, path);
    if (!params) return path;

    path += "?";
    for (const [key, value] of new URLSearchParams(params)) {
      path += `${key}=${value}&`;
    }
    return path.slice(0, -1);
  }
}

export default FetchClient;
