import mongoose, { Model, PopulateOptions, QueryFilter, Types } from "mongoose";

export default abstract class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  insertMany(data: T[]): Promise<T[]> {
    return this.model.insertMany(data);
  }

  updateOne(
     filter: QueryFilter<T>, 
    update: mongoose.UpdateQuery<T>, 
    options?: mongoose.mongo.UpdateOptions & mongoose.MongooseUpdateQueryOptions<T>
  ) {
    return this.model.updateOne(filter, update, options);
  }

  findOneAndUpdate(
    filter: QueryFilter<T>, 
    update: mongoose.UpdateQuery<T>, 
    options?: mongoose.QueryOptions<T>
  ) {
    return this.model.findOneAndUpdate(filter, update, { new: true, ...options });
  }

  findByIdAndUpdate(
    id: Types.ObjectId | string, 
    update: mongoose.UpdateQuery<T>, 
    options?: mongoose.QueryOptions<T>
  ) {
    return this.model.findByIdAndUpdate(id, update, { new: true, ...options });
  }

  findById(id:Types.ObjectId ) : Promise<T | null> {
    return this.model.findById(id);
  }

async findOne(filters: QueryFilter<T>, select?: mongoose.ProjectionType<T>): Promise<T | null> {
    const query = this.model.findOne(filters);
    
    if (select) {
      if (typeof select === 'string' && select.trim().length > 0) {
        query.select(select);
      } else if (typeof select === 'object' && Object.keys(select).length > 0) {
        query.select(select);
      }
    }
    
    return await query; 
  }

find(filters: mongoose.QueryFilter<T>, options?: mongoose.QueryOptions & { populate?: PopulateOptions | PopulateOptions[], select?: string | object }): Promise<T[]> {
  const { limit, skip, populate, select, ...otherOptions } = options || {};
  
 
  let query = this.model.find(filters, null, otherOptions);

  if (limit !== undefined) query = query.limit(limit);
  if (skip !== undefined) query = query.skip(skip);
  if (populate) query = query.populate(populate as any);
  if (select) query = query.select(select as any);

  return query.exec();
}

  // find(filters: QueryFilter<T>) : Promise<T[]> {
  //   return this.model.find(filters);
  // }

  deleteOne(filters: QueryFilter<T> = {}) {
    return this.model.deleteOne(filters);
  }

  findOneAndDelete(filters: QueryFilter<T> = {}) {
    return this.model.findOneAndDelete(filters);
  }

  updateWithFindById(
    id: Types.ObjectId , 
    update: mongoose.UpdateQuery<T>, 
    options?: mongoose.QueryOptions<T>
  ) {
    return this.model.findByIdAndUpdate(id, update, { new: true, ...options });
  }

  deleteAll() {
    return this.model.deleteMany({});
  }

 deleteMany(filters: mongoose.QueryFilter<T>, options?: mongoose.mongo.DeleteOptions) :Promise<mongoose.mongo.DeleteResult> {
  return this.model.deleteMany(filters, options);
}

  findByIdAndDelete(_id: Types.ObjectId , options: mongoose.QueryOptions<T> = {}) {
    return this.model.findByIdAndDelete(_id, options);
  }

  countDocuments(filters: QueryFilter<T> = {}) {
    return this.model.countDocuments(filters);
  }
}