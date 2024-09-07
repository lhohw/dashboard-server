let argv: Argv = null!;

class Argv {
  private constructor(private _map: Map<string, string | boolean>) {}

  static init() {
    if (argv) return argv;

    const map = new Map<string, string>();

    const parsed = process.argv.slice(2).map((arg) => arg.split("="));

    for (let [key, value] of parsed) {
      key = key.replace(/^--/, "");
      map.set(key, value ?? true);
    }

    return (argv = new Argv(map));
  }

  has(key: string) {
    const { _map } = this;
    return _map.has(key);
  }

  get(key: string) {
    const { _map } = this;
    return _map.get(key);
  }
}

export default Argv;
