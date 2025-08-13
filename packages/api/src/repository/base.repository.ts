export interface CrudAdapter<
  TEntity,
  CreateInput,
  UpdateInput,
  WhereInput,
  FindManyInput = unknown,
> {
  findUnique(args: { where: WhereInput }): Promise<TEntity | null>;
  findMany(args?: FindManyInput): Promise<TEntity[]>;
  create(args: { data: CreateInput }): Promise<TEntity>;
  update(args: { where: WhereInput; data: UpdateInput }): Promise<TEntity>;
  delete(args: { where: WhereInput }): Promise<TEntity>;
}

export abstract class BaseRepository<
  TEntity,
  CreateInput,
  UpdateInput,
  WhereInput,
  FindManyInput = unknown,
> {
  protected readonly model: CrudAdapter<
    TEntity,
    CreateInput,
    UpdateInput,
    WhereInput,
    FindManyInput
  >;

  constructor(
    model: CrudAdapter<
      TEntity,
      CreateInput,
      UpdateInput,
      WhereInput,
      FindManyInput
    >,
  ) {
    this.model = model;
  }

  findById(where: WhereInput): Promise<TEntity | null> {
    return this.model.findUnique({ where });
  }

  findMany(params?: FindManyInput): Promise<TEntity[]> {
    return this.model.findMany(params);
  }

  create(data: CreateInput): Promise<TEntity> {
    return this.model.create({ data });
  }

  update(where: WhereInput, data: UpdateInput): Promise<TEntity> {
    return this.model.update({ where, data });
  }

  delete(where: WhereInput): Promise<TEntity> {
    return this.model.delete({ where });
  }
}
