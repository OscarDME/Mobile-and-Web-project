import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const createEjercicio = async (req, res) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { ejercicio, preparacion, ejecucion, ID_Musculo, ID_Tipo_Ejercicio, ID_Dificultad, ID_Equipo, ID_Modalidad, ID_Lesion, musculosSecundarios  } = req.body;

    // Realizar la conexión a la base de datos
    const pool = await getConnection();

    // Insertar el nuevo ejercicio
    const insertEjercicioResult = await pool.request()
      .input("ejercicio", sql.NVarChar, ejercicio)
      .input("preparacion", sql.NVarChar, preparacion)
      .input("ejecucion", sql.NVarChar, ejecucion)
      .input("ID_Musculo", sql.Int, ID_Musculo)
      .input("ID_Tipo_Ejercicio", sql.Int, ID_Tipo_Ejercicio)
      .input("ID_Dificultad", sql.Int, ID_Dificultad)
      .input("ID_Equipo", sql.Int, ID_Equipo)
      .input("ID_Modalidad", sql.Int, ID_Modalidad)
      .input("ID_Lesion", sql.Int, ID_Lesion)
      .query(querys.createEjercicio);

    const ejercicioId = insertEjercicioResult.recordset[0].ID_Ejercicio;

    // Intentar insertar relaciones con músculos secundarios, si existen
    if (musculosSecundarios && musculosSecundarios.length > 0) {
      for (const ID_Musculo of musculosSecundarios) {
        await pool.request()
          .input("ID_Musculo", sql.Int, ID_Musculo)
          .input("ID_Ejercicio", sql.Int, ejercicioId)
          .query(querys.createTambienEntrena);
      }
    }

    res.status(201).json({ message: "Ejercicio creado correctamente, relaciones con músculos secundarios insertadas." });
  } catch (error) {
    console.error("Error en la creación del ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getExercises = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(querys.getEjercicios);
        
        const exercises = result.recordset;
        for (let exercise of exercises) {
            // Para cada ejercicio, buscar sus músculos secundarios
            const musculosResult = await pool.request()
                .input('ID_Ejercicio', sql.Int, exercise.ID_Ejercicio)
                .query(querys.getMusculosSecundarios);
            exercise.musculosSecundarios = musculosResult.recordset;
        }

        res.json(exercises);
    } catch (error) {
        console.error("Error al obtener los ejercicios:", error);
        res.status(500).send(error.message);
    }
};

export const getEjercicioById = async (req, res) => {
  try {
      const  ID_Ejercicio  = req.params.id; 
      const pool = await getConnection();
      console.log(ID_Ejercicio);

      // Obtener el ejercicio por ID
      const result = await pool.request()
          .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
          .query(querys.getEjerciciosById);

      if (result.recordset.length > 0) {
          const ejercicio = result.recordset[0];
          console.log(result);
          // Obtener los músculos secundarios asociados al ejercicio
          const musculosSecundariosResult = await pool.request()
              .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
              .query(querys.getMusculosSecs); 
          console.log(musculosSecundariosResult);
          ejercicio.musculosSecundarios = musculosSecundariosResult.recordset;

          res.json(ejercicio);
      } else {
          res.status(404).json({ message: "Ejercicio no encontrado" });
      }
  } catch (error) {
      console.error("Error al obtener el ejercicio:", error);
      res.status(500).json({ error: error.message });
  }
};

export const updateEjercicio = async (req, res) => {
  try {
    const  ID_Ejercicio  = req.params.id; // Obtén el ID del ejercicio desde los parámetros de la URL
    const { ejercicio, preparacion, ejecucion, ID_Musculo, ID_Tipo_Ejercicio, ID_Dificultad, ID_Equipo, ID_Modalidad, ID_Lesion, musculosSecundarios } = req.body;

    const pool = await getConnection();

    await pool.request()
      .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
      .input('ejercicio', sql.NVarChar, ejercicio)
      .input('preparacion', sql.NVarChar, preparacion)
      .input('ejecucion', sql.NVarChar, ejecucion)
      .input('ID_Musculo', sql.Int, ID_Musculo)
      .input('ID_Tipo_Ejercicio', sql.Int, ID_Tipo_Ejercicio)
      .input('ID_Dificultad', sql.Int, ID_Dificultad)
      .input('ID_Equipo', sql.Int, ID_Equipo)
      .input('ID_Modalidad', sql.Int, ID_Modalidad)
      .input('ID_Lesion', sql.Int, ID_Lesion)
      .query(querys.updateEjercicio);

    res.json({ message: "Ejercicio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
};
