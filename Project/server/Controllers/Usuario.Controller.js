import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";
export const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(querys.getUsers); // Asegúrate de tener definida la consulta SQL en querys.getUserById

    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const createUser = async (req, res) => {


  try {
    // Obtener los datos del cuerpo de la solicitud
    const {
      name,
      givenName,
      surname,
      email,
      dateOfBirth,
      height,
      weight,
      gender,
    } = req.body;

    console.log('Datos del cuerpo de la solicitud:', req.body); // Registra los datos recibidos

    // Realizar la conexión a la base de datos
    const pool = await getConnection();

    console.log('Conexión a la base de datos exitosa'); // Registro de conexión exitosa

    // Consulta SQL para insertar un nuevo usuario
    const result = await pool
      .request()
      .input("username", sql.NVarChar, name)
      .input("givenName", sql.NVarChar, givenName)
      .input("surname", sql.NVarChar, surname)
      .input("email", sql.NVarChar, email)
      .input("gender", sql.Char, gender)
      .input("dateOfBirth", sql.Date, new Date(dateOfBirth))
      .input("height", sql.Float, parseFloat(height))
      .input("weight", sql.Float, parseFloat(weight))
      .query(querys.createUser);

    console.log('Resultado de la inserción:', result); // Registra el resultado de la inserción

    if (result.rowsAffected.length > 0) {
      return res.status(201).json({ message: "Usuario creado correctamente" });
    } else {
      return res.status(500).json({ error: "No se pudo crear el usuario" });
    }
  } catch (error) {
    console.error('Error en la creación de usuario:', error); // Registra cualquier error que ocurra
    return res.status(500).json({ error: error.message });
  }
};