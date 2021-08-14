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
exports.TypesenseClient = void 0;
const typesense_1 = require("typesense");
class TypesenseClient {
    constructor(apiKey, nodes, nearestNode, connectionTimeout) {
        this.client = new typesense_1.Client({
            nodes: nodes,
            nearestNode: nearestNode,
            apiKey: apiKey,
            connectionTimoutSeconds: connectionTimeout,
        });
    }
    createCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const autoSchema = {
                name: collectionName,
                fields: [{ name: '.*', type: 'auto' }],
            };
            yield this.client.collections().create(autoSchema);
        });
    }
    importDocuments(collectionName, documents) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client
                .collections(collectionName)
                .documents()
                .import(documents, { action: 'create' });
        });
    }
    insertDocument(collectionName, document) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.collections(collectionName).documents().create(document);
        });
    }
    updateDocument(collectionName, updatedDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client
                .collections(collectionName)
                .documents()
                .upsert(updatedDocument);
        });
    }
    deleteDocument(collectionName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.collections(collectionName).documents(id).delete();
        });
    }
    replaceDocument(collectionName, id, document) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.collections(collectionName).documents(id).delete();
            }
            catch (err) {
                if (err instanceof typesense_1.Errors.ObjectNotFound) {
                    return;
                }
                throw err;
            }
            yield this.client.collections(collectionName).documents().create(document);
        });
    }
    dropCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.collections(collectionName).delete();
        });
    }
    renameCollection(collectionName, newCollectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const aliased_collection = {
                collection_name: collectionName,
            };
            yield this.client.aliases().upsert(newCollectionName, aliased_collection);
        });
    }
    checkCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.collections(collectionName).retrieve();
                return result.num_documents;
            }
            catch (err) {
                if (err instanceof typesense_1.Errors.ObjectNotFound) {
                    return undefined;
                }
                throw err;
            }
        });
    }
    checkServer() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.health.retrieve();
        });
    }
}
exports.TypesenseClient = TypesenseClient;
//# sourceMappingURL=TypesenseClient.js.map