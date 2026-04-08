export class ResponseHelper {
  static async handle<T>(promise: Promise<T>, successMessage?: string, errorMessage?: string) {
    try {
      const result = await promise;
      return {
        message: successMessage || 'Success',
        data: result,
      };
    } catch (error) {
      return {
        error: true,
        message: errorMessage || 'An unexpected error occurred',
        data: null,
      };
    }
  }

  static success<T>(data: T, message: string = 'Success') {
    return {
      message,
      data,
    };
  }

  static error(message: string, data: any = null) {
    return {
      error: true,
      message,
      data,
    };
  }
}
