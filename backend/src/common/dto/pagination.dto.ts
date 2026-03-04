export class PaginationDto {
  page: number = 1;
  limit: number = 20;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
