export class JsonResponse {
  private status: string;
  private message: string | null | undefined;
  private data: any;
  private Metadata: any;
  private redirectUrl: string | null | undefined;
  private pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null;

  constructor() {
    this.status = 'success'; // Default status
    this.message = null;
    this.data = null;
    this.Metadata = null;
    this.redirectUrl = null;
    this.pagination = null;
  }

  static $error(message: string, metadata?: any): any {
    metadata = { ...metadata } || undefined;
    return { status: 'error', errors: { message: message }, metadata };
  }
  static $success(data: any, metadata?: any): any {
    metadata = { ...metadata } || undefined;
    return { status: 'success', data: { ...data }, metadata };
  }
  error(message: string): this {
    this.status = 'error';
    this.message = message;
    return this;
  }

  success(data: any): this {
    this.status = 'success';
    this.data = data;
    return this;
  }

  metadata(metadata: any): this {
    this.metadata = metadata;
    return this;
  }

  redirect(url: string): this {
    this.redirectUrl = url;
    return this;
  }

  paginate(page: number, pageSize: number, total: number): this {
    const totalPages = Math.ceil(total / pageSize);
    this.pagination = { page, pageSize, total, totalPages };
    return this;
  }

  build(): any {
    const response: any = {
      status: this.status,
    };

    if (this.status === 'error' && this.message !== null) {
      response.errors = { message: this.message };
    }

    if (this.status === 'success' && this.data !== null) {
      response.data = this.data;
    }

    if (this.metadata !== null) {
      response.metadata = this.metadata;
    }

    if (this.redirectUrl !== null) {
      response.redirect = this.redirectUrl;
    }

    if (this.pagination !== null) {
      response.pagination = this.pagination;
    }
    return response;
  }
}

export default new JsonResponse();
