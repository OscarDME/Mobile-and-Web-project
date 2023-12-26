import { Router } from "express";
import {
    getUsers
  //getUserById,
  //getUserbyUsername
} from "../Controllers/Usuario.Controller.js";

const router = Router();

router.get("/Users", getUsers);

//router.get("/UsersId", getUserById);

//router.get("/UsersUsername", getUserbyUsername);

export default router;