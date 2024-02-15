import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";


// Definir la función createAlimento
export const createAlimento = async (req, res) => {
  try {
    // Extraer los datos necesarios del cuerpo de la solicitud
    const { nombre, calorias, peso, ID_Categoria, macronutrientes } = req.body;
    console.log("cATEGORIA: ",ID_Categoria);

    // Obtener la conexión a la base de datos
    const pool = await getConnection();

    // Insertar el nuevo alimento
    const insertAlimentoResult = await pool.request()
      .input("nombre", sql.NVarChar, nombre)
      .input("calorias", sql.Int, calorias)
      .input("peso", sql.Float, peso)
      .input("ID_Categoria", sql.Int, ID_Categoria)
      .query(querys.createAlimento);

    const ID_Alimento = insertAlimentoResult.recordset[0].ID_Alimento;

    // Verificar si hay macronutrientes para insertar
    if (macronutrientes && Array.isArray(macronutrientes) && macronutrientes.length > 0) {
      // Insertar cada macronutriente asociado al alimento
      for (const { ID_Macronutriente, cantidad } of macronutrientes) {
        await pool.request()
          .input("ID_Alimento", sql.Int, ID_Alimento)
          .input("ID_Macronutriente", sql.Int, ID_Macronutriente)
          .input("cantidad", sql.Float, cantidad)
          .query(querys.createContiene);
      }
    }

    res.status(201).json({ message: "Alimento y macronutrientes asociados creados exitosamente" });
  } catch (error) {
    console.error("Error al crear el alimento y sus macronutrientes:", error);
    res.status(500).json({ error: error.message });
  }
};

// Función para obtener el detalle de un alimento junto con sus macronutrientes
export const getAllAlimentosWithMacronutrientes = async (req, res) => {
  try {
      const pool = await getConnection();
      
      // Obtener todos los alimentos
      const alimentosResult = await pool.request().query(querys.getAlimento); // Asume que esta consulta ya está definida
      
      const alimentos = alimentosResult.recordset;
      
      // Para cada alimento, obtener sus macronutrientes
      for (let alimento of alimentos) {
          const macronutrientesResult = await pool.request()
              .input('ID_Alimento', sql.Int, alimento.ID_Alimento)
              .query(querys.getContiene);

          alimento.macronutrientes = macronutrientesResult.recordset;
      }

      res.json(alimentos);
  } catch (error) {
      console.error("Error al obtener los alimentos y sus macronutrientes:", error);
      res.status(500).json({ error: error.message });
  }
};


export const updateAlimento = async (req, res) => {
  try {
      const { ID_Alimento, nombre, calorias, peso, ID_Categoria, macronutrientes } = req.body;

      const pool = await getConnection();

      // Actualizar información básica del alimento
      await pool.request()
          .input('ID_Alimento', sql.Int, ID_Alimento)
          .input('nombre', sql.NVarChar, nombre)
          .input('calorias', sql.Int, calorias)
          .input('peso', sql.Float, peso)
          .input('ID_Categoria', sql.Int, ID_Categoria)
          .query(querys.updateAlimento);

      // Actualizar macronutrientes
      for (const macronutriente of macronutrientes) {
          await pool.request()
              .input('ID_Alimento', sql.Int, ID_Alimento)
              .input('ID_Macronutriente', sql.Int, macronutriente.ID_Macronutriente)
              .input('cantidad', sql.Float, macronutriente.cantidad)
              .query(querys.updateContiene);
      }
      res.json({ message: "Alimento y macronutrientes actualizados con éxito" });
  } catch (error) {
      console.error("Error al actualizar el alimento y sus macronutrientes:", error);
      res.status(500).json({ error: error.message });
  }
};
