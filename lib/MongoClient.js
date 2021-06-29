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
exports.MongoClient = void 0;
const mongodb_1 = require("mongodb");
class MongoClient {
    constructor(url) {
        this.mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        this.client = new mongodb_1.MongoClient(url, this.mongoOptions);
        this.url = url;
    }
    listAllDatabases() {
        return __awaiter(this, void 0, void 0, function* () {
            let dbList = yield this.client.db().admin().listDatabases();
            dbList = dbList.databases.map((database) => {
                return database.name;
            });
            return dbList;
        });
    }
    connectMongo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    closeMongo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.close();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    listCollections(databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            let collectionList = yield this.client
                .db(databaseName)
                .listCollections()
                .toArray();
            collectionList = collectionList.map((collection) => {
                return collection.name;
            });
            return collectionList;
        });
    }
    insertDocuments(databaseName, collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const books = yield require("../data/books.json");
            const sample_data = books.slice(0, 5000);
            const db = this.client.db(databaseName);
            yield db.collection(collectionName).insertMany(sample_data);
        });
    }
    readDocuments(databaseName, collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.client.db(databaseName);
            const result = yield db
                .collection(collectionName)
                .find()
                .toArray();
            result.forEach((document) => {
                document.id = String(document._id);
                delete document._id;
            });
            return result;
        });
    }
    changeStreams(databaseName, collectionName) {
        const collection = this.client.db(databaseName).collection(collectionName);
        const changeStream = collection.watch([], { fullDocument: "updateLookup" });
        return changeStream;
    }
}
exports.MongoClient = MongoClient;
//# sourceMappingURL=MongoClient.js.map