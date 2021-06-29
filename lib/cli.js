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
exports.cli = void 0;
const main_1 = require("./main");
const parseArguments_1 = require("./parseArguments");
function cli(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = parseArguments_1.parseArguments(args);
        yield main_1.Main(parsed);
    });
}
exports.cli = cli;
//# sourceMappingURL=cli.js.map