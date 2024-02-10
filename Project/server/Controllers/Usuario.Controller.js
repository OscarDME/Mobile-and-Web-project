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
    const { oid, name, givenName, surname, email, dateOfBirth, gender } =
      req.body;

    console.log("Datos del cuerpo de la solicitud:", req.body); // Registra los datos recibidos

    // Realizar la conexión a la base de datos
    const pool = await getConnection();

    console.log("Conexión a la base de datos exitosa"); // Registro de conexión exitosa

    // Consulta SQL para insertar un nuevo usuario
    const result = await pool
      .request()
      .input("oid", sql.VarChar, oid)
      .input("username", sql.NVarChar, name)
      .input("givenName", sql.NVarChar, givenName)
      .input("surname", sql.NVarChar, surname)
      .input("email", sql.NVarChar, email)
      .input("gender", sql.Char, gender)
      .input("dateOfBirth", sql.Date, new Date(dateOfBirth))
      .query(querys.createUser);

    console.log("Resultado de la inserción:", result); // Registra el resultado de la inserción

    if (result.rowsAffected.length > 0) {
      const userMovilResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, oid) // ID_Usuario relacionado en UsuarioMovil
        .query(querys.createMovileUser);
      if (userMovilResult.rowsAffected.length > 0) {
        return res
          .status(201)
          .json({ message: "Usuario y UsuarioMovil creados correctamente" });
      } else {
        return res.status(500).json({ error: "No se pudo crear UsuarioMovil" });
      }
    } else {
      return res.status(500).json({ error: "No se pudo crear el usuario" });
    }
  } catch (error) {
    console.error("Error en la creación de usuario:", error); // Registra cualquier error que ocurra
    return res.status(500).json({ error: error.message });
  }
};

export const checkIfUserExists = async (req, res) => {
  const id = req.params.oid;
  console.log("oid:", id);
  try {
    const pool = await getConnection();
    console.log("Consultando...");
    const result = await pool
      .request()
      .input("oid", sql.VarChar, id)
      .query(querys.checkUserExists);

    if (result.recordset.length > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error("Error al verificar la existencia del usuario:", error);
    res.status(500).send("Error al verificar la existencia del usuario");
  }
};

export const getBirthDate = async (req, res) => {
  const id = req.params.oid;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('ID_Usuario', sql.VarChar, id)
      .query(querys.getBirthDate);

    if (result.recordset.length > 0) {
      const { fecha_nacimiento, sexo } = result.recordset[0];
      res.json({ fechaNacimiento: fecha_nacimiento, sexo });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


