import mongoose, { Model, QueryFilter, Types } from "mongoose";

export default abstract class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  create(data: T): Promise<T> {
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
    id: mongoose.Schema.Types.ObjectId | string, 
    update: mongoose.UpdateQuery<T>, 
    options?: mongoose.QueryOptions<T>
  ) {
    return this.model.findByIdAndUpdate(id, update, { new: true, ...options });
  }

  findById(id:mongoose.Schema.Types.ObjectId ) : Promise<T | null> {
    return this.model.findById(id);
  }

  findOne(filters: QueryFilter<T>, select: mongoose.ProjectionType<T> = {}): Promise<T | null> {
    return this.model.findOne(filters).select(select);
  }

  find(filters: QueryFilter<T>) : Promise<T[]> {
    return this.model.find(filters);
  }

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

  // deleteMany(filter: QueryFilter<T> = {}, options: mongoose.QueryOptions<T> = {}) {
  //   return this.model.deleteMany(filter, options);
  // }

  findByIdAndDelete(_id: Types.ObjectId , options: mongoose.QueryOptions<T> = {}) {
    return this.model.findByIdAndDelete(_id, options);
  }

  countDocuments(filters: QueryFilter<T> = {}) {
    return this.model.countDocuments(filters);
  }
}