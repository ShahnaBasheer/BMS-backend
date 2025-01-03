

// repositories/base.repository.ts
export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    find(filter: object, sortOptions?: object, skip?: number, limit?: number): Promise<T[]>;
    updateById(id: string, data: Partial<T>): Promise<T | null>;
    deleteById(id: string): Promise<T | null>;
  }
  