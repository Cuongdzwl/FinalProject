"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralService = void 0;
/**
 * Represents a general service. Must be inherited by other services to use the service methods.
 */
class GeneralService {
    constructor() {
        this.pagination = { page: 1, pageSize: 24 };
        this.paginationOptions = {
            skip: (this.pagination.page - 1) * this.pagination.pageSize,
            take: this.pagination.pageSize,
        };
    }
    /**
     * Method to handle pagination logic.
     *
     * @param {number} [page] - The current page number. If not provided, the existing page number will be used.
     * @param {number} [pageSize] - The number of items per page. If not provided, the existing page size will be used.
     *
     * @returns {this} - Returns the instance of the class for method chaining.
     *
     * @example
     * ```typescript
     * const generalService = new GeneralService();
     * generalService.paginate(2, 10); // Sets the page to 2 and page size to 10
     * ```
     */
    paginate(page, pageSize) {
        if (page) {
            this.pagination.page = page;
        }
        if (pageSize) {
            this.pagination.pageSize = pageSize;
        }
        this.paginationOptions = {
            skip: (this.pagination.page - 1) * this.pagination.pageSize,
            take: this.pagination.pageSize,
        };
        return this;
    }
    /**
     * Method to handle ordering logic.
     *
     * @param {string} [orderby] - The field to order by. If not provided, the default order will be by 'id'.
     * @param {boolean} [asc=true] - A flag indicating whether the order should be ascending (true) or descending (false). Default is true.
     *
     * @returns {this} - Returns the instance of the class for method chaining.
     *
     * @example
     * ```typescript
     * const generalService = new GeneralService();
     * generalService.order('name', false); // Orders by 'name' in descending order
     * ```
     */
    order(orderby, asc = true) {
        this.orderOptions = {
            orderBy: { [orderby || 'id']: asc ? 'asc' : 'desc' },
        };
        return this;
    }
    /*
     * Method to handle filtering logic. (WIP)
     */
    where(wheres) {
        wheres;
        return this;
    }
    /*
     * Method to handle filtering logic. (WIP)
     */
    select(fields) {
        fields;
        return this;
    }
    /**
     * Clears options when done with a query.
     *
     * @returns {this} - Returns the instance of the class for method chaining.
     *
     * @example
     * ```typescript
     * const generalService = new GeneralService();
     * generalService.paginate(2, 10).order('name', false).clear(); // Clears pagination and order options
     * ```
     */
    clear() {
        this.pagination = { page: 1, pageSize: 24 };
        this.paginationOptions = {
            skip: (this.pagination.page - 1) * this.pagination.pageSize,
            take: this.pagination.pageSize,
        };
        this.orderOptions = {};
        return this;
    }
}
exports.GeneralService = GeneralService;
//# sourceMappingURL=general.service.js.map