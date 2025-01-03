"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id).populate('author').exec();
        });
    }
    find(filter_1) {
        return __awaiter(this, arguments, void 0, function* (filter, sortOptions = {}) {
            return this.model.find(filter).populate('author').sort(sortOptions).exec();
        });
    }
    updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(id, data, { new: true }).populate('author').exec();
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndDelete(id).exec();
        });
    }
}
exports.default = BaseRepository;
