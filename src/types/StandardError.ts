export class StandardError extends Error {
  public httpStatusCode: number;
  public code?: number;
  public description?: string;
  constructor(params: {
    message: string;
    httpStatusCode: number;
    code?: number;
    description?: string;
  }) {
    super();
    this.message = params.message;
    this.httpStatusCode = params.httpStatusCode;
    this.code = params.code;
    this.description = params.description;
  }
}
