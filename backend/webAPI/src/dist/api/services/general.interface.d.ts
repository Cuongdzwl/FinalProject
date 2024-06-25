export interface IGeneralService {
    paginate(page?: number, pageSize?: number): this;
    order(orderby?: string, asc?: boolean): this;
    where(wheres: any): this;
    select(fields: any): this;
    clear(): this;
}
