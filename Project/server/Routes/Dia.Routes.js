import { Router } from "express";
import {
    getDays
  //getUserById,
  //getUserbyUsername
} from "../Controllers/Dia.Controller.js";

const router = Router();

router.get("/Dia", getDays);

//router.get("/UsersId", getUserById);

//router.get("/UsersUsername", getUserbyUsername);

export default router;