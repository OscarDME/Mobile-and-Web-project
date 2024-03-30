import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const createMilestone = async (req, res) => {
    try {
      const { porcentaje_grasa, masa_muscular, presion_arterial, ritmo_cardiaco, cuello, pecho, hombro,bicep,antebrazo,cintura,cadera,pantorrilla,muslo,fecha,ID_UsuarioMovil} = req.body;
  
      const pool = await getConnection();
  
      const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_UsuarioMovil)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
  
    const ID_UsuarioCliente = mobileUserResult.recordset[0].ID_UsuarioMovil;
  
  
      const result = await pool.request()
        .input("ID_UsuarioMovil", sql.Int, ID_UsuarioCliente)
        .input("fecha", sql.Date, fecha)
        .input("cuello", sql.Float, cuello)
        .input("pecho", sql.Float, pecho)
        .input("hombro", sql.Float, hombro)
        .input("bicep", sql.Float, bicep)
        .input("antebrazo", sql.Float, antebrazo)
        .input("cintura", sql.Float, cintura)
        .input("cadera", sql.Float, cadera)
        .input("pantorrilla", sql.Float, pantorrilla)
        .input("muslo", sql.Float, muslo)
        .input("porcentaje_grasa", sql.Float, porcentaje_grasa)
        .input("masa_muscular", sql.Float, masa_muscular)
        .input("presion_arterial", sql.SmallInt, presion_arterial)
        .input("ritmo_cardiaco", sql.SmallInt, ritmo_cardiaco)
        .query(querys.createMilestone);
  
      const ID_Medidas_Corporales = result.recordset[0].ID_MedidasCorporales;
  
      res.status(201).json({ message: "Hito creada exitosamente", ID_Medidas_Corporales });
    } catch (error) {
      console.error("Error al crear el hito:", error);
      res.status(500).json({ error: error.message });
    }
  };


  export const getMilestones = async (req, res) => {
    const ID_Usuario  = req.params.id; 
    
    try {
        const pool = await getConnection();
        const mobileUserResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
        
    
        const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

        const result = await pool.request()
            .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil) 
            .query(`
                SELECT 
                    MC.ID_MedidasCorporales, 
                    CONVERT(char(10), MC.fecha, 126) as fecha,
                    MC.cuello,
                    MC.pecho,
                    MC.hombro,
                    MC.bicep,
                    MC.antebrazo,
                    MC.cintura,
                    MC.cadera,
                    MC.pantorrilla,
                    MC.muslo,
                    MC.porcentaje_grasa,
                    MC.masa_muscular,
                    MC.presion_arterial,
                    MC.ritmo_cardiaco,
                    UM.ID_UsuarioMovil
                FROM 
                    Medidas_Corporales MC
                INNER JOIN 
                    UsuarioMovil UM ON MC.ID_UsuarioMovil = UM.ID_UsuarioMovil
                WHERE 
                    UM.ID_UsuarioMovil = @ID_UsuarioMovil
                ORDER BY 
                    MC.fecha DESC; 
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error("Error al obtener las medidas corporales:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



export const getIndividualMeasurements = async (req, res) => {
    const ID_Usuario = req.params.id;
    const medida = req.params.medida; // Nuevo parámetro para la medida específica
  
    try {
      const pool = await getConnection();
      const mobileUserResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
  
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
  
      let query = `
        SELECT 
            CONVERT(char(10), MC.fecha, 126) AS fecha,
            MC.${medida} AS valor
        FROM 
            Medidas_Corporales MC
        WHERE 
            MC.ID_UsuarioMovil = @ID_UsuarioMovil
        ORDER BY 
            MC.fecha DESC; 
      `;
  
      // Si no se especifica una medida, podrías ajustar la consulta para devolver todas las medidas
      // o manejarlo según la lógica de tu aplicación.
  
      const result = await pool.request()
        .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil)
        .query(query);
  
      // Estructura la respuesta
      const fechas = result.recordset.map(item => item.fecha);
      const valores = result.recordset.map(item => item.valor);
  
      res.json({ fechas, valores });
    } catch (error) {
      console.error("Error al obtener las medidas corporales:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  export const deleteMilestone = async (req, res) => {
    try {
      const ID_MedidasCorporales = req.params.id;
  
      const pool = await getConnection();
  
      await pool.request()
        .input('ID_MedidasCorporales', sql.Int, ID_MedidasCorporales)
        .query("DELETE FROM Medidas_Corporales WHERE ID_MedidasCorporales = @ID_MedidasCorporales");
  
      res.json({ message: "Hito eliminado exitosamente" });
    } catch (error) {
      console.error("Error al borrar el hito:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  