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
exports.ChangeStreams = void 0;
var Events;
(function (Events) {
    Events["insert"] = "insert";
    Events["update"] = "update";
    Events["replace"] = "replace";
    Events["delete"] = "delete";
    Events["drop"] = "drop";
    Events["rename"] = "rename";
    Events["dropDatabase"] = "dropDatabase";
    Events["invalidate"] = "invalidate";
})(Events || (Events = {}));
class ChangeStreams {
    constructor(mongo, typesense, databaseName, collectionName, typesenseCollectionName) {
        this.mongo = mongo;
        this.typesense = typesense;
        this.mongoDatabaseName = databaseName;
        this.mongoCollectionName = collectionName;
        this.typesenseCollectionName = typesenseCollectionName;
        this.changeStream = this.mongo.changeStreams(this.mongoDatabaseName, this.mongoCollectionName);
        this.eventMapper();
    }
    eventMapper() {
        this.changeStream.on('change', (response) => __awaiter(this, void 0, void 0, function* () {
            console.log(response.operationType);
            if (response.operationType === Events.insert) {
                yield this.insert(response);
            }
            if (response.operationType === Events.update) {
                yield this.update(response);
            }
            if (response.operationType === Events.replace) {
                yield this.replace(response);
            }
            if (response.operationType === Events.delete) {
                yield this.delete(response);
            }
            if (response.operationType === Events.drop) {
                yield this.drop();
            }
            if (response.operationType === Events.rename) {
                yield this.rename(response);
            }
        }));
    }
    closeChangeStream() {
        return __awaiter(this, void 0, void 0, function* () {
            this.changeStream.close();
        });
    }
    insert(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = response.fullDocument;
            Object.assign(data, {
                id: String(response.documentKey._id),
            });
            delete data._id;
            yield this.typesense.insertDocument(this.typesenseCollectionName, data);
        });
    }
    update(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = response.fullDocument;
            Object.assign(data, {
                id: String(response.documentKey._id),
            });
            delete data._id;
            yield this.typesense.updateDocument(this.typesenseCollectionName, data);
        });
    }
    replace(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = String(response.documentKey._id);
            const data = response.fullDocument;
            Object.assign(data, {
                id: id,
            });
            delete data._id;
            yield this.typesense.replaceDocument(this.typesenseCollectionName, id, data);
        });
    }
    delete(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = String(response.documentKey._id);
            yield this.typesense.deleteDocument(this.typesenseCollectionName, id);
        });
    }
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.typesense.dropCollection(this.typesenseCollectionName);
            yield this.closeChangeStream();
        });
    }
    rename(response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.typesense.renameCollection(this.typesenseCollectionName, `${this.mongoDatabaseName}_${response.to.coll}`);
            this.mongoCollectionName = response.to.coll;
            this.typesenseCollectionName = `${this.mongoDatabaseName}_${response.to.coll}`;
            this.closeChangeStream();
            this.changeStream = this.mongo.changeStreams(this.mongoDatabaseName, this.mongoCollectionName);
            this.eventMapper();
        });
    }
}
exports.ChangeStreams = ChangeStreams;
//# sourceMappingURL=ChangeStreams.js.map