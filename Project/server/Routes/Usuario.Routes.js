import { Router } from "express";
import {
    getUsers,
    checkIfUserExists,
    createUser,
    getBirthDate,
    getUserAndType
} from "../Controllers/Usuario.Controller.js";

import { getMaterials } from "../Controllers/Materiales.Controllers.js";
import { createCuestionario } from "../Controllers/Cuestionario.Controllers.js";
import { createEjercicio, getExercises, getEjercicioById, updateEjercicio, getAlternativeExercises } from "../Controllers/EjerciciosControllers.js";
import { createAlimento, getAllAlimentosWithMacronutrientes, updateAlimento } from "../Controllers/Alimento.Controllers.js";
import { createReceta, getReceta, updateReceta, getIngredientes } from "../Controllers/Recetas.Controllers.js";
import { createRutina, getRutinasByUsuario, getRutinaByID, updateRutina, createEjerciciosDia, getEjerciciosPorDia, updateEjerciciosDia, crearBloqueSetsConSeries, actualizarBloqueSetsConSeries, obtenerSetsPorEjercicioDia, deleteRutina } from "../Controllers/Rutinas.Controllers.js";

//El que come callado repite

const router = Router();
//Usuarios
router.get("/users", getUsers);
router.get("/users/:oid", checkIfUserExists);
router.get("/birthdate/:oid", getBirthDate);
router.post("/users", createUser);
router.get("/usertype", getUserAndType);

//Materiales
router.get("/materials", getMaterials); 

//Cuestionario
router.post("/cues", createCuestionario);

//Ejercicios
router.post("/ejercicios", createEjercicio);
router.get("/ejercicio", getExercises);
router.get("/ejercicio/:id", getEjercicioById);
router.put("/ejercicio/:id", updateEjercicio);
router.get("/alternativas/:id", getAlternativeExercises);

//Alimentos
router.post("/alimentos", createAlimento);
router.get("/alimentos", getAllAlimentosWithMacronutrientes);
router.put("/alimentos/:id", updateAlimento);

//Recetas
router.post("/recetas", createReceta);
router.get("/recetas", getReceta);
router.put("/recetas/:id", updateReceta);
router.get("/ingredientes/:id", getIngredientes);

//Rutinas
router.post("/rutinas", createRutina);
router.get("/rutinas/:oid", getRutinasByUsuario);
router.get("/rutina/:id", getRutinaByID);
router.put("/rutina/:id", updateRutina);
router.post("/rutinaejercicios", createEjerciciosDia);
router.get("/ejerciciosdia/:id", getEjerciciosPorDia);
router.put("/rutinaejercicios", updateEjerciciosDia);
router.post("/bloquesets", crearBloqueSetsConSeries);
router.put("/bloquesets", actualizarBloqueSetsConSeries);
router.get("/sets/:id", obtenerSetsPorEjercicioDia);
router.delete("/rutina/:id", deleteRutina);

export default router;