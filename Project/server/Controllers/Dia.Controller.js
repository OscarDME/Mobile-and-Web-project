import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const getDays = async (req, res) => {
    try {
      const pool = await getConnection();
  
      const result = await pool
        .request()
        .query(querys.getDays); // Asegúrate de tener definida la consulta SQL en querys.getUserById
  
      return res.json(result.recordset);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
};


export const getUserById = async (req, res) => {
    try {
      const pool = await getConnection();
  
      const result = await pool
        .request()
        .input("id", req.params.id)
        .query(querys.getUserById); // Asegúrate de tener definida la consulta SQL en querys.getUserById
  
      return res.json(result.recordset[0]);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
};
