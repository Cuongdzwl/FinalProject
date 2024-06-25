import { IGeneralService } from "./general.interface";
/**
 * Represents a general service. Must be inherited by other services to use the service methods.
 */
export declare class GeneralService implements IGeneralService {
    protected pagination: any;
    protected paginationOptions: any;
    protected orderOptions: any;
    constructor();
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
    paginate(page?: number, pageSize?: number): this;
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
    order(orderby?: string, asc?: boolean): this;
    where(wheres: any): this;
    select(fields: any): this;
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
    clear(): this;
}
