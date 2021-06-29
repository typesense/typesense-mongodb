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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const defaults_1 = __importDefault(require("./defaults"));
const MongoClient_1 = require("./MongoClient");
const TypesenseClient_1 = require("./TypesenseClient");
const listr_1 = __importDefault(require("listr"));
const chalk_1 = __importDefault(require("chalk"));
const ChangeStreams_1 = require("./ChangeStreams");
let typesense;
let mongo;
let need;
function typesenseURLParser(url) {
    const splits = url.split(":");
    return {
        host: splits[1].slice(2, splits[1].length),
        port: splits[splits.length - 1],
        protocol: splits[0],
    };
}
function initializeTypesenseClient(options) {
    return __awaiter(this, void 0, void 0, function* () {
        typesense = new TypesenseClient_1.TypesenseClient(options.typesenseKey, [
            typesenseURLParser(options.typesenseURL),
        ]);
        try {
            yield typesense.checkServer();
        }
        catch (err) {
            console.error(err);
        }
        return typesense;
    });
}
function initializeMongoClient(options) {
    return __awaiter(this, void 0, void 0, function* () {
        mongo = new MongoClient_1.MongoClient(options.mongodbURL);
        try {
            yield mongo.connectMongo();
        }
        catch (err) {
            console.error(err);
        }
        return mongo;
    });
}
function checkForExistingCollection(typesense, options) {
    return __awaiter(this, void 0, void 0, function* () {
        need = yield typesense.checkCollection(options.typesenseCollectionName);
        return need;
    });
}
function indexExistingDocuments(typesense, mongo, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield mongo.readDocuments(options.mongodbDatabaseName, options.mongodbCollectionName);
        yield typesense.importDocuments(options.typesenseCollectionName, document);
    });
}
function enableChangeStreams(typesense, mongo, options) {
    new ChangeStreams_1.ChangeStreams(mongo, typesense, options.mongodbDatabaseName, options.mongodbCollectionName, options.typesenseCollectionName);
}
function Main(parsed) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            mongodbDatabaseName: parsed.mongodbDatabaseName || defaults_1.default.mongodbDatabaseName,
            mongodbCollectionName: parsed.mongodbCollectionName || defaults_1.default.mongodbCollectionName,
            mongodbURL: parsed.mongodbURL || defaults_1.default.mongodbURL,
            typesenseCollectionName: parsed.typesenseCollectionName || defaults_1.default.typesenseCollectionName,
            typesenseKey: parsed.typesenseKey || defaults_1.default.typesenseKey,
            typesenseURL: parsed.typesenseURL || defaults_1.default.typesenseURL,
        };
        const tasks = new listr_1.default([
            {
                title: "Initialize Typesense Client",
                task: () => initializeTypesenseClient(options),
            },
            {
                title: "Initialize Mongo Client",
                task: () => initializeMongoClient(options),
            },
            {
                title: "Check for an existing typesense collection",
                task: () => checkForExistingCollection(typesense, options),
            },
            {
                title: "Create a new Typesense Collection",
                task: () => typesense.createCollection(options.typesenseCollectionName),
                skip: () => need
                    ? "Found an existing collection skipping create collection"
                    : undefined,
            },
            {
                title: "Index existing documents",
                task: () => indexExistingDocuments(typesense, mongo, options),
            },
            {
                title: "Open Change Stream",
                task: () => enableChangeStreams(typesense, mongo, options),
            },
        ]);
        yield tasks.run();
        console.log("%s Watching for changes..", chalk_1.default.green("DONE"));
    });
}
exports.Main = Main;
//# sourceMappingURL=main.js.map