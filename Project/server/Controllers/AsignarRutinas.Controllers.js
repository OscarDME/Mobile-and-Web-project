import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const createCompleteRutinaForClient = async (req, res) => {
    try {
      const { ID_Usuario, nombreRutina, diasEntreno, fechaInicio, fechaFin } = req.body;
  
      const pool = await getConnection();
  
      // Insertar la nueva rutina
      const insertRutinaResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("nombreRutina", sql.NVarChar, nombreRutina)
        .query(querys.createRutinaShort);
      const rutinaId = insertRutinaResult.recordset[0].ID_Rutina;
  
      // Iterar sobre cada día para insertar ejercicios y sets
      for (const day of diasEntreno) {
        // Insertar día de entrenamiento y obtener ID_Dia
        const insertDiaResult = await pool
          .request()
          .input("ID_Rutina", sql.Int, rutinaId)
          .input("ID_Dia", sql.Int, day.ID_Dia)
          .query(querys.createDiasEntreno);
        const ID_Dia = insertDiaResult.recordset[0].ID_Dias_Entreno;
  
        // Iterar sobre cada ejercicio del día
        for (const ejercicio of day.ejercicios) {
          // Insertar EjercicioDia
          const insertEjercicioDiaResult = await pool
            .request()
            .input("ID_Dias_Entreno", sql.Int, ID_Dia)
            .input("ID_Ejercicio", sql.Int, ejercicio.ID_Ejercicio)
            .input("descanso", sql.Time, ejercicio.descanso)
            .input("superset", sql.Bit, ejercicio.superset ? 1 : 0)
            .query(querys.createEjerciciosDia);
          const ID_EjercicioDia =
            insertEjercicioDiaResult.recordset[0].ID_EjerciciosDia;
  
          // Insertar BloqueSets
          const resultBloqueSets = await pool
            .request()
            .input("ID_EjerciciosDia", sql.Int, ID_EjercicioDia)
            .query(
              "INSERT INTO BloqueSets (ID_EjerciciosDia) OUTPUT INSERTED.ID_BloqueSets VALUES (@ID_EjerciciosDia);"
            );
          const ID_BloqueSets = resultBloqueSets.recordset[0].ID_BloqueSets;
  
          // Iterar sobre cada conjunto de series del ejercicio
          for (const conjunto of ejercicio.conjuntoSeries) {
            // Insertar ConjuntoSeries
            const resultConjuntoSeries = await pool
              .request()
              .input("ID_BloqueSets", sql.Int, ID_BloqueSets)
              .query(
                "INSERT INTO ConjuntoSeries (ID_BloqueSets) OUTPUT INSERTED.ID_ConjuntoSeries VALUES (@ID_BloqueSets);"
              );
            const ID_ConjuntoSeries =
              resultConjuntoSeries.recordset[0].ID_ConjuntoSeries;
  
            // Iterar sobre cada serie del conjunto
            for (const serie of conjunto.series) {
              // Insertar Serie
              const resultSerie = await pool
                .request()
                .input("repeticiones", sql.Int, serie.repeticiones)
                .input("peso", sql.Decimal(10, 2), serie.peso)
                .input("ID_SeriePrincipal", sql.Int, serie.ID_SeriePrincipal)
                .query(
                  "INSERT INTO Serie (repeticiones, peso, tiempo, ID_SeriePrincipal) OUTPUT INSERTED.ID_Serie VALUES (@repeticiones, @peso, NULL, @ID_SeriePrincipal);"
                );
              const ID_Serie = resultSerie.recordset[0].ID_Serie;
  
              // Relacionar la serie con el ConjuntoSeries
              await pool
                .request()
                .input("ID_ConjuntoSeries", sql.Int, ID_ConjuntoSeries)
                .input("ID_Serie", sql.Int, ID_Serie)
                .query(
                  "INSERT INTO Serie_ConjuntoSeries (ID_Serie, ID_ConjuntoSeries) VALUES (@ID_Serie, @ID_ConjuntoSeries);"
                );
            }
          }
        }
      }
  
      // Asignar la rutina al usuario móvil
      const fechaAsignacion = new Date().toISOString();
  
      await pool
        .request()
        .input("fecha_asignacion", sql.DateTime, fechaAsignacion)
        .input("fecha_eliminacion", sql.DateTime, fechaFin)
        .input("fecha_inicio", sql.DateTime, fechaInicio)
        .input("ID_Rutina", sql.Int, rutinaId)
        .input("ID_UsuarioMovil", sql.VarChar, ID_Usuario)
        .query(querys.createAsignarRutinas);
  
      res.status(201).json({
        message: "Rutina creada y asignada correctamente para el cliente.",
      });
    } catch (error) {
      console.error("Error en la creación y asignación de la rutina para el cliente:", error);
      res.status(500).json({ error: error.message });
    }
  };
  