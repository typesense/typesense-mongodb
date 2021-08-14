"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArguments = void 0;
const arg_1 = __importDefault(require("arg"));
function parseArguments(rawArgs) {
    const args = arg_1.default({
        '--mongo-database': String,
        '--mongo-collection': String,
        '--typesense-collection': String,
        '--typesense-api-key': String,
        '--typesense-url': String,
        '--mongo-url': String,
    }, {
        argv: rawArgs.slice(2),
    });
    return {
        mongodbDatabaseName: args['--mongo-database'],
        mongodbCollectionName: args['--mongo-collection'],
        typesenseCollectionName: args['--typesense-collection'],
        mongodbURL: args['--mongo-url'],
        typesenseURL: args['--typesense-url'],
        typesenseKey: args['--typesense-api-key'],
    };
}
exports.parseArguments = parseArguments;
/*
typesense-mongodb \
    --mongo-database=database \
    --mongo-collection=collection \
    --typesense-collection=collection \
    --mongo-url=mongodb://localhost:27017 \
    --typesense-url=http://localhost:8108 \
    --typesense-api-key=xyz
*/
// --mongo-database=database --mongo-collection=collection --typesense-collection=collection --mongo-url=mongodb://localhost:27017 --typesense-url=http://localhost:8108 --typesense-api-key=xyz
//# sourceMappingURL=parseArguments.js.map