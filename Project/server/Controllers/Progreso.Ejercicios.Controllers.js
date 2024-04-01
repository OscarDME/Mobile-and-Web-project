import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const get1RMForExercise = async (req, res) => {
  const ID_Usuario = req.params.id;
  const ID_Ejercicio = req.params.ejercicio;
  console.log(ID_Usuario);
  console.log(ID_Ejercicio);
  try {
    const pool = await getConnection();
    const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario)
      .query(
        "SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario"
      );
    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
    const result = await pool
      .request()
      .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
      .input("ID_Ejercicio", sql.Int, ID_Ejercicio).query(`
                DECLARE @FechaInicio DATE = DATEADD(DAY, -30, GETDATE());
                DECLARE @FechaFin DATE = GETDATE();

                SELECT
                    ED.ID_Ejercicio,
                    MAX(RSU.peso * (1 + 0.0333 * RSU.repeticiones)) AS Max1RM
                FROM
                    ResultadoSeriesUsuario RSU
                INNER JOIN Serie S ON
                    RSU.ID_Serie = S.ID_Serie
                INNER JOIN ConjuntoSeries CS ON
                    S.ID_Serie = CS.ID_Serie
                INNER JOIN BloqueSets BS ON
                    CS.ID_BloqueSets = BS.ID_BloqueSets
                INNER JOIN EjerciciosDia ED ON
                    BS.ID_EjerciciosDia = ED.ID_EjerciciosDia
                INNER JOIN Dias_Entreno DE ON
                    ED.ID_Dias_Entreno = DE.ID_Dias_Entreno
                INNER JOIN Rutina_Asignada RA ON
                    DE.ID_Rutina = RA.ID_Rutina
                WHERE
                    RA.ID_UsuarioMovil = @ID_UsuarioMovil
                    AND ED.ID_Ejercicio = @ID_Ejercicio
                    AND RSU.fecha BETWEEN @FechaInicio AND @FechaFin
                    AND RSU.completado = 1
                GROUP BY
                    ED.ID_Ejercicio
            `);
    console.log(result.recordset);
    // Si la consulta no devuelve resultados, enviar una respuesta adecuada
    if (result.recordset.length === 0) {
      return res
        .status(404)
        .send("No se encontraron resultados para los parámetros dados.");
    }

    // Enviar el resultado
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener el 1RM para el ejercicio:", error);
    res.status(500).send(error.message);
  }
};
