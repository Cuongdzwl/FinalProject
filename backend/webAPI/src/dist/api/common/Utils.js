"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonResponse = exports.Pagination = void 0;
class Pagination {
}
exports.Pagination = Pagination;
class JsonResponse {
    constructor() {
        this.status = 'success'; // Default status
        this.message = null;
        this.data = null;
        this.Metadata = null;
        this.redirectUrl = null;
        this.pagination = null;
    }
    /**
     * Static method to create a JsonResponse object with error status.
     *
     * @param message - The error message.
     * @param metadata - Additional metadata to be included in the response.
     * @returns A JsonResponse object with error status and the provided message and metadata.
     *
     * @example
     * ```typescript
     * const response = JsonResponse.$error('Invalid input', { code: 400 });
     * console.log(response); // { status: 'error', errors: { message: 'Invalid input' }, metadata: { code: 400 } }
     * ```
     */
    static $error(message, metadata) {
        metadata = { ...metadata } || undefined;
        return { status: 'error', errors: { message: message }, metadata };
    }
    /**
     * Static method to create a JsonResponse object with success status.
     *
     * @param data - The data to be included in the response.
     * @param metadata - Additional metadata to be included in the response.
     * @returns A JsonResponse object with success status and the provided data and metadata.
     *
     * @example
     * ```typescript
     * const response = JsonResponse.$success({ user: { id: 1, name: 'John Doe' } }, { code: 200 });
     * console.log(response); // { status: 'success', data: { user: { id: 1, name: 'John Doe' } }, metadata: { code: 200 } }
     * ```
     */
    static $success(data, metadata) {
        metadata = { ...metadata } || undefined;
        return { status: 'success', data: { ...data }, metadata };
    }
    /**
     * Sets the status of the JsonResponse object to 'error' and assigns the provided error message.
     *
     * @param message - The error message to be included in the response.
     * @returns The JsonResponse object with the updated status and error message.
     *
     * @example
     * ```typescript
     * const response = new JsonResponse();
     * response.error('Invalid input');
     * console.log(response.build()); // { status: 'error', errors: { message: 'Invalid input' } }
     * ```
     */
    error(message) {
        this.status = 'error';
        this.message = message;
        return this;
    }
    /**
     * Sets the status of the JsonResponse object to 'success' and assigns the provided data.
     *
     * @param data - The data to be included in the response. This can be any valid JSON object.
     * @returns The JsonResponse object with the updated status and data.
     *
     * @example
     * ```typescript
     * const response = new JsonResponse();
     * response.success({ user: { id: 1, name: 'John Doe' } });
     * console.log(response.build()); // { status: 'success', data: { user: { id: 1, name: 'John Doe' } } }
     * ```
     */
    success(data) {
        this.status = 'success';
        this.data = data;
        return this;
    }
    /**
     * Sets additional metadata for the JsonResponse object.
     *
     * @param metadata - The metadata to be included in the response. This can be any valid JSON object.
     * @returns The JsonResponse object with the updated metadata.
     *
     * @example
     * ```typescript
     * const response = new JsonResponse();
     * response.metadata({ code: 200, timestamp: Date.now() });
     * console.log(response.build()); // { status: 'success', metadata: { code: 200, timestamp: 1632345678901 } }
     * ```
     */
    metadata(metadata) {
        this.Metadata = metadata;
        return this;
    }
    /**
     * Sets the redirect URL for the JsonResponse object.
     *
     * @param url - The URL to redirect the client to.
     * @returns The JsonResponse object with the updated redirect URL.
     *
     * @example
     * ```typescript
     * const response = new JsonResponse();
     * response.redirect('https://example.com/new-page');
     * console.log(response.build()); // { status: 'success', metadata: { redirectUrl: 'https://example.com/new-page' } }
     * ```
     */
    redirect(url) {
        this.redirectUrl = url;
        return this;
    }
    /**
     * Sets pagination information for the JsonResponse object.
     *
     * @param page - The current page number. Default is 1.
     * @param pageSize - The number of items per page. Default is 24.
     * @param total - The total number of items.
     * @returns The JsonResponse object with the updated pagination information.
     *
     * @example
     * ```typescript
     * const response = new JsonResponse();
     * response.paginate(2, 10, 50);
     * console.log(response.build()); // { status: 'success', metadata: { pagination: { page: 2, pageSize: 10, total: 50, totalPages: 5 } } }
     * ```
     */
    paginate(page = 1, pageSize = 24, total) {
        const totalPages = Math.ceil(total / pageSize);
        this.pagination = { page, pageSize, total, totalPages };
        return this;
    }
    /**
     * Builds the JsonResponse object into a serializable format.
     *
     * @returns The JsonResponse object in a serializable format.
     *
     * @example
     * ```typescript
     * const response = new JsonResponse();
     * response.success({ user: { id: 1, name: 'John Doe' } });
     * console.log(response.build()); // { status: 'success', data: { user: { id: 1, name: 'John Doe' } } }
     * ```
     */
    build() {
        const response = {
            status: this.status,
        };
        // If the status is 'error' and a message is provided, add the message to the 'errors' property of the response.
        if (this.status === 'error' && this.message !== null) {
            response.errors = { message: this.message };
        }
        // If the status is 'success' and data is provided, add the data to the 'data' property of the response.
        if (this.status === 'success' && this.data !== null) {
            response.data = this.data;
        }
        // If metadata is provided, merge it with the existing 'metadata' property of the response.
        if (this.Metadata !== null) {
            response.metadata = { ...response.metadata, ...this.Metadata };
        }
        // If a redirect URL is provided, add it to the 'metadata' property of the response.
        if (this.redirectUrl !== null) {
            response.metadata = {
                ...response.metadata,
                redirectUrl: this.redirectUrl,
            };
        }
        // If pagination information is provided, add it to the 'metadata' property of the response.
        if (this.pagination !== null) {
            response.metadata = { ...response.metadata, pagnition: this.pagination };
        }
        // Empty the fields
        return response;
    }
}
exports.JsonResponse = JsonResponse;
exports.default = new JsonResponse();
//# sourceMappingURL=utils.js.map