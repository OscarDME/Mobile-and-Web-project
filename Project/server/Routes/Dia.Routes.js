import { Router } from "express";
import {
    getDays,
    getDayById,
    createDay,
    updateDay,
    deleteDay
} from "../Controllers/Dia.Controller.js";

const router = Router();

router.get("/days", getDays); // Obtener todos los días
router.get("/days/:id", getDayById); // Obtener día por ID
router.post("/days", createDay); // Crear un nuevo día
router.put("/days/:id", updateDay); // Actualizar día por ID
router.delete("/days/:id", deleteDay); // Eliminar día por ID

export default router;