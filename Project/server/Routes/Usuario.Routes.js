import { Router } from "express";
import {
    getUsers,
    createUser
} from "../Controllers/Usuario.Controller.js";

const router = Router();

router.get("/users", getUsers);

router.post("/users", createUser);

//router.get("/UsersId", getUserById);

//router.get("/UsersUsername", getUserbyUsername);

export default router;