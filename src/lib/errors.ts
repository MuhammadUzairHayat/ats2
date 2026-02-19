export class AuthExpiredError extends Error {
  constructor(message: string = "Session expired, please log in again.") {
    super(message);
    this.name = "AuthExpiredError";
  }
}