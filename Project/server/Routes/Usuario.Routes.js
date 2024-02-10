import { Router } from "express";
import {
    getUsers,
    checkIfUserExists,
    createUser,
    getBirthDate,
} from "../Controllers/Usuario.Controller.js";

import { getMaterials } from "../Controllers/Materiales.Controllers.js";
import { createCuestionario } from "../Controllers/Cuestionario.Controllers.js";

const router = Router();
//Usuarios
router.get("/users", getUsers);

router.get("/users/:oid", checkIfUserExists);

router.get("/birthdate/:oid", getBirthDate);

router.post("/users", createUser);

//Materiales
router.get("/materials", getMaterials); 

//Cuestionario
router.post("/cues", createCuestionario);

//router.get("/UsersId", getUserById);

//router.get("/UsersUsername", getUserbyUsername);

export default router;