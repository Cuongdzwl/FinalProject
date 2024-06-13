export class JsonResponse {
  static error(message: string, metadata?: any): any {
    metadata = { ...metadata } || undefined;
    return { errors: { message: message }, metadata };
  }
  static success(state: boolean, data: any, metadata?: any): any {
    metadata = { ...metadata } || undefined;
    return { success: state, data: { ...data }, metadata };
  }
}
