import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const getConsistencyAchievements = async (req, res) => {
  try {
    const pool = await getConnection();
    const oid = req.params.id;

    const mobileUserResult = await pool
    .request()
    .input("ID_Usuario", sql.VarChar, oid)
    .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
    
    const result = await pool.request()
    .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil)
    .query(`

    `)

    res.status(200).json(result.recordset);
  }
  catch (error) {
    console.error("Error al consultar los logros por consistencia", error);
    res.status(500).json({ error: error.message });
  }
}

export const getCardiovascularTimeAchievements = async (req, res) => {
    try {
      const pool = await getConnection();
      const oid = req.params.id;
  
      const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, oid)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
      
      const result = await pool.request()
      .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil)
      .query(`
      WITH RankedResults AS (
        SELECT
          RSU.ID_ResultadoSeriesUsuario,
          RSU.ID_Serie,
          RSU.fecha,
          RSU.tiempo,
          ROW_NUMBER() OVER (
            PARTITION BY RSU.ID_Serie
            ORDER BY RSU.fecha DESC
          ) AS rn
        FROM ResultadoSeriesUsuario RSU
        INNER JOIN Rutina_Asignada RA ON RSU.ID_Rutina_Asignada = RA.ID_Rutina_Asignada
        WHERE (RA.ID_UsuarioMovil = @ID_UsuarioMovil)
      )
      
      SELECT
        R1.ID_ResultadoSeriesUsuario AS UltimoID,
        R2.ID_ResultadoSeriesUsuario AS PenultimoID,
        R1.ID_Serie,
        R1.fecha AS FechaUltimo,
        R2.fecha AS FechaPenultimo,
        R1.tiempo AS TiempoUltimo,
        R2.tiempo AS TiempoPenultimo
      FROM RankedResults R1
      INNER JOIN RankedResults R2 ON R1.ID_Serie = R2.ID_Serie AND R2.rn = R1.rn + 1
      WHERE R1.rn = 1 AND CAST(R1.tiempo AS TIME) > CAST(R2.tiempo AS TIME);
      `)
  
      res.status(200).json(result.recordset);
    }
    catch (error) {
      console.error("Error al consultar los logros por consistencia", error);
      res.status(500).json({ error: error.message });
    }
  }


  export const getCompoundTimeAchievements = async (req, res) => {
    try {
      const pool = await getConnection();
      const oid = req.params.id;
  
      const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, oid)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
      
      const result = await pool.request()
      .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil)
      .query(`
      WITH RankedResults AS (
        SELECT
          RSU.ID_ResultadoSeriesUsuario,
          RSU.ID_Serie,
          RSU.fecha,
          RSU.peso,
          ROW_NUMBER() OVER (
            PARTITION BY RSU.ID_Serie
            ORDER BY RSU.fecha DESC
          ) AS rn
        FROM ResultadoSeriesUsuario RSU
        INNER JOIN Rutina_Asignada RA ON RSU.ID_Rutina_Asignada = RA.ID_Rutina_Asignada
        WHERE (RA.ID_UsuarioMovil = @ID_UsuarioMovil)
          AND RSU.peso IS NOT NULL
      )
      
      SELECT
        R1.ID_ResultadoSeriesUsuario AS UltimoID,
        R2.ID_ResultadoSeriesUsuario AS PenultimoID,
        R1.ID_Serie,
        R1.fecha AS FechaUltimo,
        R2.fecha AS FechaPenultimo,
        R1.peso AS PesoUltimo,
        R2.peso AS PesoPenultimo
      FROM RankedResults R1
      INNER JOIN RankedResults R2 ON R1.ID_Serie = R2.ID_Serie AND R2.rn = R1.rn + 1
      WHERE R1.rn = 1 AND (R1.peso - R2.peso) >= 5;
      `)
  
      res.status(200).json(result.recordset);
    }
    catch (error) {
      console.error("Error al consultar los logros por mejora de pesos", error);
      res.status(500).json({ error: error.message });
    }
  }