export abstract class BaseService<T> {
  protected repository: any;

  constructor(repository: any) {
    this.repository = repository;
  }

  async getById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async getAll(): Promise<T[]> {
    return this.repository.findMany();
  }

  async create(data: any): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: any): Promise<T> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<T> {
    return this.repository.delete(id);
  }
}
