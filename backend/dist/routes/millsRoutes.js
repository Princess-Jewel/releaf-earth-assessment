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
const express_1 = __importDefault(require("express"));
const millsController_1 = require("../controllers/millsController");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.get("/mills", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataPath = path_1.default.join(__dirname, "../data/milljson.json");
    try {
        const data = yield fs_1.default.promises.readFile(dataPath, "utf8");
        const mills = JSON.parse(data);
        // Attach UUID as id
        const millsWithId = mills.map((mill) => (Object.assign({ id: (0, uuid_1.v4)() }, mill)));
        res.json(millsWithId);
    }
    catch (err) {
        res.status(500).json({ message: "Error reading mills data", error: err });
    }
}));
// Route to add a new mill
router.post("/mills", millsController_1.addMill);
// Route to update a mill
router.put("/mills/:id", millsController_1.updateMill);
exports.default = router;
