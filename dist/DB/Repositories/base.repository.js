"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return this.model.create(data);
    }
    insertMany(data) {
        return this.model.insertMany(data);
    }
    findOneAndUpdate(filter, update, options) {
        return this.model.findOneAndUpdate(filter, update, { new: true, ...options });
    }
    findByIdAndUpdate(id, update, options) {
        return this.model.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    findById(id) {
        return this.model.findById(id);
    }
    findOne(filters, select = {}) {
        return this.model.findOne(filters).select(select);
    }
    find(filters) {
        return this.model.find(filters);
    }
    deleteOne(filter = {}) {
        return this.model.deleteOne(filter);
    }
    findOneAndDelete(filter = {}) {
        return this.model.findOneAndDelete(filter);
    }
    updateWithFindById(id, update, options) {
        return this.model.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    deleteAll() {
        return this.model.deleteMany({});
    }
    deleteMany(filter = {}, options = {}) {
        return this.model.deleteMany(filter, options);
    }
    findByIdAndDelete(_id, options = {}) {
        return this.model.findByIdAndDelete(_id, options);
    }
    countDocuments(filters = {}) {
        return this.model.countDocuments(filters);
    }
}
exports.default = BaseRepository;
