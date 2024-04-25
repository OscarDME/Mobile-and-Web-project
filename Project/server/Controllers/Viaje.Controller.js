import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";



export const getJourney = async (req, res) => {
    try {
      const pool = await getConnection();
      const oid = req.params.id;
      
      const result = await pool.request()
      .input("ID_Usuario", sql.VarChar, oid)
      .query(`
      select Hora_Preferida, Lugar_Salida, Lugar_Gimnasio, Notificaciones_Activas
      from Viaje
      where ID_Usuario = @ID_Usuario
      `)
  
      res.status(200).json(result.recordset);
    }
    catch (error) {
      console.error("Error al consultar los datos de Viaje", error);
      res.status(500).json({ error: error.message });
    }
  }
  

  
export const updateJourney = async (req, res) => {
    try {
        const pool = await getConnection();
        const oid = req.params.id;
        
        const isExistent = await pool.request()
        .input("ID_Usuario", sql.VarChar, oid)
        .query("SELECT * FROM Viaje WHERE ID_Usuario = @ID_Usuario");
        
        if(!isExistent.recordset.length){
            await pool.request()
            .input("ID_Usuario", sql.VarChar, oid)
            .input("Hora_Preferida", sql.Time, req.body.Hora_Preferida)
            .input("Lugar_Salida", sql.VarChar, req.body.Lugar_Salida)
            .input("Lugar_Gimnasio", sql.VarChar, req.body.Lugar_Gimnasio)
            .input("Notificaciones_Activas", sql.Bit, req.body.Notificaciones_Activas)
            .query("INSERT INTO Viaje (ID_Usuario, Hora_Preferida, Lugar_Salida, Lugar_Gimnasio, Notificaciones_Activas) VALUES (@ID_Usuario, @Hora_Preferida, @Lugar_Salida, @Lugar_Gimnasio, @Notificaciones_Activas)");
        }
        else{
            await pool.request()
            .input("ID_Usuario", sql.VarChar, oid)
            .input("Hora_Preferida", sql.Time, req.body.Hora_Preferida)
            .input("Lugar_Salida", sql.VarChar, req.body.Lugar_Salida)
            .input("Lugar_Gimnasio", sql.VarChar, req.body.Lugar_Gimnasio)
            .input("Notificaciones_Activas", sql.Bit, req.body.Notificaciones_Activas)
            .query("UPDATE Viaje SET Hora_Preferida=@Hora_Preferida, Lugar_Salida=@Lugar_Salida, Lugar_Gimnasio=@Lugar_Gimnasio, Notificaciones_Activas=@Notificaciones_Activas WHERE ID_Usuario=@ID_Usuario");
        }
    
        res.status(201).json({ message: "Datos de Viaje agregados exitosamente"});
      } catch (error) {
        console.error("Error al modificar Viaje", error);
        res.status(500).json({ error: error.message });
      }
  }