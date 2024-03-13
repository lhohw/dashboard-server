class CustomError extends Error {
  constructor(private error: Error) {
    super();
  }
  get message() {
    const { error } = this;
    if (error.name === "ENOENT") {
      return "File not exist";
    }
    return error.message;
  }
}

export default CustomError;
