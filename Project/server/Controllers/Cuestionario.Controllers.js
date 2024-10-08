import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const createCuestionario = async (req, res) => {
  try {
    const {
      oid,
      trainingTime,
      preferredDays,
      selectedMuscles,
      trainingGoal,
      injuryAreas,
      focusedBodyPart,
      fitnessLevel,
      trainingLocation,
      semanas,
      selectedMaterials,
    } = req.body;

    console.log("Datos del cuestionario recibidos:", req.body); 
    const pool = await getConnection();

    console.log("Conexión a la base de datos exitosa"); 

    const materialIDs = [];
    for (const materialName of selectedMaterials) {
      const materialResult = await pool
        .request()
        .input("nombre", sql.NVarChar, materialName)
        .query(querys.getMaterialByName);

      if (materialResult.recordset.length > 0) {
        materialIDs.push(materialResult.recordset[0].ID_Equipo);
      }
    }

    console.log("Consultando usuario movil...");
    const userMovilResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, oid)
      .query(querys.getMobileUser);
    console.log(
      "Resultado de consulta:",
      userMovilResult.recordset[0].ID_UsuarioMovil
    );

    if (userMovilResult.recordset.length > 0) {
      const mobileUserID = userMovilResult.recordset[0].ID_UsuarioMovil;

      const existingCuestionario = await pool.request()
      .input("ID_UsuarioMovil", sql.Int, mobileUserID)
      .query(querys.checkCuestionario);

      if (existingCuestionario.recordset.length > 0) {
        const cuestionarioID = existingCuestionario.recordset[0].ID_Cuestionario;
        await pool.request()
          .input("ID_Cuestionario", sql.Int, cuestionarioID)
          .query(querys.deleteQuiereEntrenar);
        await pool.request()
          .input("ID_Cuestionario", sql.Int, cuestionarioID)
          .query(querys.deletePuedeEntrenar);
        await pool.request()
          .input("ID_Cuestionario", sql.Int, cuestionarioID)
          .query(querys.deletePadece);
        await pool.request()
          .input("ID_Cuestionario", sql.Int, cuestionarioID)
          .query(querys.deleteDispone);
        await pool.request()
          .input("ID_Cuestionario", sql.Int, cuestionarioID)
          .query(querys.deleteCuestionario);
      }  

      console.log("ID_Usuario de UsuarioMovil:", mobileUserID);
      console.log("Consultando espacio disponible por nombre:");
      const spaceResult = await pool
        .request()
        .input("nombre", sql.NVarChar, trainingLocation)
        .query(querys.getSpaceByName);

      if (spaceResult.recordset.length > 0) {
        console.log(
          "Espacio disponible por nombre:",
          spaceResult.recordset[0].ID_EspacioDisponible
        );
        const spaceID = spaceResult.recordset[0].ID_EspacioDisponible;

        const result = await pool
          .request()
          .input("ID_UsuarioMovil", sql.Int, mobileUserID)
          .input("tiempo_disponible", sql.VarChar, trainingTime)
          .input("ID_Objetivo", sql.Int, trainingGoal)
          .input("ID_Musculo", sql.Int, focusedBodyPart)
          .input("ID_NivelFormaFisica", sql.Int, fitnessLevel)
          .input("ID_EspacioDisponible", sql.Int, spaceID)
          .input("Semanas", sql.Int, semanas)
          .query(querys.createCuestionario);

        console.log("Resultado de la inserción del cuestionario:", result); 

        const insertedCuestionarioID = result.recordset[0].ID_Cuestionario;
        console.log("ID del cuestionario insertado:", insertedCuestionarioID);

        if (insertedCuestionarioID >= 0) {
            console.log("ID del cuestionario insertado:", insertedCuestionarioID);
            for (const dayID in selectedMuscles) {
              const dayInt = parseInt(dayID); 
      
              for (const muscle of selectedMuscles[dayID]) {
                const insertQuiereEntrenarDiaResult = await pool
                  .request()
                  .input("ID_Dia", sql.Int, dayInt)
                  .input("ID_Musculo", sql.Int, muscle)
                  .input("ID_Cuestionario", sql.Int, insertedCuestionarioID)
                  .query(querys.createQuiereEntrenar);
              }
            }

          for (const day of preferredDays) {
            const insertDayResult = await pool
              .request()
              .input("ID_Cuestionario", sql.Int, insertedCuestionarioID)
              .input("ID_Dia", sql.Int, day)
              .query(querys.createPuedeEntrenar);

            if (insertDayResult.rowsAffected.length === 0) {
              return res
                .status(500)
                .json({ error: `No se pudo insertar el día ${day}` });
            }
        }

            for (const injury of injuryAreas) {
                const insertInjuryResult = await pool
                  .request()
                  .input("ID_Cuestionario", sql.Int, insertedCuestionarioID)
                  .input("ID_Lesion", sql.Int, injury)
                  .query(querys.createPadece);
            
                if (insertInjuryResult.rowsAffected.length === 0) {
                  return res
                    .status(500)
                    .json({ error: `No se pudo insertar la lesión ${injury}` });
                }
              }
              for (const material of materialIDs) {
                const insertMaterialResult = await pool
                  .request()
                  .input("ID_Cuestionario", sql.Int, insertedCuestionarioID)
                  .input("ID_Equipo", sql.Int, material)
                  .query(querys.createDispone);
                  console.log()
                if (insertMaterialResult.rowsAffected.length === 0) {
                  return res
                    .status(500)
                    .json({ error: `No se pudo insertar el material ${material}` });
                }
              }            
          return res
            .status(201)
            .json({ message: "Cuestionario creado correctamente" });
        } else {
          return res
            .status(500)
            .json({ error: "No se pudo crear el cuestionario" });
        }
      } else {
        return res
          .status(500)
          .json({
            error: "No se encontró el ID del espacio disponible por nombre",
          });
      }
    } else {
      return res
        .status(500)
        .json({ error: "No se encontró el ID_Usuario de UsuarioMovil" });
    }
  } catch (error) {
    console.error("Error en la creación del cuestionario:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getCuestionarioData = async (req, res) => {
  try {
    const ID_Usuario = req.params.id;
    const pool = await getConnection();
    console.log("Conexión a la base de datos establecida.");

    const usuarioMovilResult = await pool.request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario)
      .query(querys.getMobileUser);  

    if (usuarioMovilResult.recordset.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const ID_UsuarioMovil = usuarioMovilResult.recordset[0].ID_UsuarioMovil;

    const cuestionarioResult = await pool.request()
      .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
      .query(querys.getCuestionario);  

    if (cuestionarioResult.recordset.length === 0) {
      return res.status(404).json({ error: "Cuestionario no encontrado." });
    }

    const cuestionarioData = cuestionarioResult.recordset[0];

    const puedeEntrenarResult = await pool.request()
      .input("ID_Cuestionario", sql.Int, cuestionarioData.ID_Cuestionario)
      .query(querys.getPuedeEntrenar);

    const padeceResult = await pool.request()
      .input("ID_Cuestionario", sql.Int, cuestionarioData.ID_Cuestionario)
      .query(querys.getPadece);

    const disponeResult = await pool.request()
      .input("ID_Cuestionario", sql.Int, cuestionarioData.ID_Cuestionario)
      .query(querys.getDispone);

    const quiereEntrenarResult = await pool.request()
      .input("ID_Cuestionario", sql.Int, cuestionarioData.ID_Cuestionario)
      .query(querys.getQuiereEntrenar);

      console.log(quiereEntrenarResult.recordset);
    return res.status(200).json({
      cuestionario: cuestionarioData,
      puedeEntrenar: puedeEntrenarResult.recordset,
      padece: padeceResult.recordset,
      dispone: disponeResult.recordset,
      quiereEntrenar: quiereEntrenarResult.recordset
    });
    console.log(quiereEntrenarResult.recordset);

  } catch (error) {
    console.error("Error al obtener los datos del cuestionario:", error);
    return res.status(500).json({ error: error.message });
  }
};
