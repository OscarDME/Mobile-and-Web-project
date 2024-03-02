import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const createRutina = async (req, res) => {
  try {
    const { oid, routineName, workoutsIds } = req.body;
    console.log("Datos del cuerpo de la solicitud:", req.body); // Registra los datos recibidos
    const pool = await getConnection();

    // Insertar la nueva rutina
    const insertRutinaResult = await pool
      .request()
      .input("nombre", sql.NVarChar, routineName) // Asegúrate de que el nombre de la
      .input("ID_Usuario", sql.VarChar, oid)
      .query(querys.createRutinaShort);

    const rutinaId = insertRutinaResult.recordset[0].ID_Rutina;

    // Insertar los días de entrenamiento asociados a la rutina
    for (const ID_Dia of workoutsIds) {
      await pool
        .request()
        .input("ID_Rutina", sql.Int, rutinaId)
        .input("ID_Dia", sql.Int, ID_Dia)
        .query(querys.createDiasEntreno);
    }

    res
      .status(201)
      .json({
        message:
          "Rutina creada correctamente, días de entrenamiento insertados.",
      });
  } catch (error) {
    console.error("Error en la creación de la rutina:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getRutinasByUsuario = async (req, res) => {
  try {
    const ID_Usuario = req.params.oid; // Asume que el ID del usuario se pasa como parámetro de ruta
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario) // Asegúrate de que el tipo de dato coincida con tu DB
      .query(querys.getRutinasByUsuario);

    console.log("Resultado de la consulta:", result); // Registra el resultado de la consulta
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener las rutinas por usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getRutinaByID = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    // Obtener la información básica de la rutina
    const rutinaResult = await pool
      .request()
      .input("ID_Rutina", sql.Int, id)
      .query(querys.getRutinaByID);

    if (rutinaResult.recordset.length > 0) {
      const rutina = rutinaResult.recordset[0];

      // Obtener los días de entrenamiento para la rutina
      const diasEntrenoResult = await pool
        .request()
        .input("ID_Rutina", sql.Int, id)
        .query(querys.getDiasEntrenoByRutina);

      // Para cada día de entrenamiento, obtener los músculos principales trabajados
      for (const dia of diasEntrenoResult.recordset) {
        const musculosResult = await pool
          .request()
          .input("ID_Dias_Entreno", sql.Int, dia.ID_Dias_Entreno)
          .query(`
            SELECT M.descripcion AS Musculo
            FROM EjerciciosDia ED
            JOIN Ejercicio E ON ED.ID_Ejercicio = E.ID_Ejercicio
            JOIN Musculo M ON E.ID_Musculo = M.ID_Musculo
            WHERE ED.ID_Dias_Entreno = @ID_Dias_Entreno
            GROUP BY M.descripcion
          `);
        dia.musculosPrincipales = musculosResult.recordset.map(m => m.Musculo);
      }

      rutina.diasEntreno = diasEntrenoResult.recordset;

      res.json(rutina);
    } else {
      res.status(404).send("Rutina no encontrada");
    }
  } catch (error) {
    console.error("Error al obtener la rutina por ID:", error);
    res.status(500).send(error.message);
  }
};

export const deleteRutina = async (req, res) => {
  try {
    const  id  = req.params.id; // ID de la rutina a eliminar
    const pool = await getConnection();

    // Opcional: Eliminar datos relacionados primero para mantener la integridad referencial
    // Por ejemplo, si tienes tablas que dependen de la existencia de una rutina, deberías eliminar esos datos primero.
    // Este paso depende de cómo hayas diseñado tu base de datos y las relaciones entre tablas.
    // Aquí hay ejemplos genéricos, asegúrate de ajustar los nombres de las tablas y las claves foráneas según tu esquema.
    await pool.request()
      .input('ID_Rutina', sql.Int, id)
      .query('DELETE FROM Dias_Entreno WHERE ID_Rutina = @ID_Rutina');

    // Continúa eliminando otros datos relacionados según sea necesario...

    // Finalmente, eliminar la rutina
    const result = await pool.request()
      .input('ID_Rutina', sql.Int, id)
      .query('DELETE FROM Rutina WHERE ID_Rutina = @ID_Rutina');

    if (result.rowsAffected[0] > 0) {
      res.json({ message: 'Rutina eliminada correctamente.' });
    } else {
      res.status(404).json({ message: 'Rutina no encontrada.' });
    }
  } catch (error) {
    console.error('Error al eliminar la rutina:', error);
    res.status(500).json({ error: error.message });
  }
};


export const updateRutina = async (req, res) => {
  try {
    const { ID_Rutina, oid, routineName, workoutsIds, publica } = req.body;
    const pool = await getConnection();

    // Actualizar la rutina existente
    await pool
      .request()
      .input("nombre", sql.NVarChar, routineName)
      .input("ID_Usuario", sql.VarChar, oid)
      .input("ID_Rutina", sql.Int, ID_Rutina)
      .input("publica", sql.Bit, ID_Rutina)
      .query(querys.updateRutina);

    // Obtener días actuales vinculados a la rutina
    const { recordset: diasActuales } = await pool.request()
      .input("ID_Rutina", sql.Int, ID_Rutina)
      .query("SELECT ID_Dia FROM Dias_Entreno WHERE ID_Rutina = @ID_Rutina");

    const idsDiasActuales = diasActuales.map(da => da.ID_Dia);

    // Determinar los días para eliminar (los que ya no están en workoutsIds)
    const diasParaEliminar = idsDiasActuales.filter(id => !workoutsIds.includes(id));

    // Eliminar los días no presentes en workoutsIds
    for (const ID_Dia of diasParaEliminar) {
      await pool.request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Dia", sql.Int, ID_Dia)
        .query("DELETE FROM Dias_Entreno WHERE ID_Rutina = @ID_Rutina AND ID_Dia = @ID_Dia");
    }

    // Determinar los días para añadir (los que están en workoutsIds pero no en la base de datos)
    const diasParaAgregar = workoutsIds.filter(id => !idsDiasActuales.includes(id));

    // Añadir los nuevos días a la rutina
    for (const ID_Dia of diasParaAgregar) {
      await pool.request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Dia", sql.Int, ID_Dia)
        .query("INSERT INTO Dias_Entreno (ID_Rutina, ID_Dia) VALUES (@ID_Rutina, @ID_Dia)");
    }


    res.status(200).json({ message: "Rutina actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar la rutina:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createEjerciciosDia = async (req, res) => {
  try {
    const { ejercicios, ID_Dia } = req.body; // Asumiendo que ejercicios es un array de { ID_Ejercicio, descanso, superset }
    console.log("Datos del cuerpo de la solicitud:", ejercicios, ID_Dia); // Registra los datos recibidos
    const pool = await getConnection();

    const resultRutina = await pool.request()
    .input('ID_Dias_Entreno', sql.Int, ID_Dia)
    .query("SELECT ID_Rutina FROM Dias_Entreno WHERE ID_Dias_Entreno = @ID_Dias_Entreno");

  // Asumiendo que cada día pertenece a una única rutina
    const ID_Rutina = resultRutina.recordset[0]?.ID_Rutina;

    const diasEntrenoResult = await pool.request()
    .input('ID_Rutina', sql.Int, ID_Rutina)
    .query("SELECT ID_Dias_Entreno FROM Dias_Entreno WHERE ID_Rutina = @ID_Rutina");
  
    const idsDiasEntreno = diasEntrenoResult.recordset.map(row => row.ID_Dias_Entreno);
    console.log("Ejercicios insertados en el día" , idsDiasEntreno);
    // Insertar los ejercicios del día
    for (const ejercicio of ejercicios) {
      await pool
        .request()
        .input("ID_Dias_Entreno", sql.Int, ID_Dia)
        .input("ID_Ejercicio", sql.Int, ejercicio.ID_Ejercicio)
        .input("descanso", sql.Time, ejercicio.restTime) // Asegúrate de que el tipo de dato coincida con tu DB
        .input("superset", sql.Bit, ejercicio.isSuperset) // Asumiendo que superset es un valor booleano
        .query(querys.createEjerciciosDia);
    }
    console.log("No llegue aqui");


    // Construye la cláusula IN de SQL manualmente
    const inClause = idsDiasEntreno.join(',');
    
    // Ejecuta la consulta con la cláusula IN construida dinámicamente
    const resultadoDificultadQuery = `
      SELECT E.ID_Dificultad, COUNT(*) AS Cantidad
      FROM Ejercicio E
      JOIN EjerciciosDia ED ON E.ID_Ejercicio = ED.ID_Ejercicio
      WHERE ED.ID_Dias_Entreno IN (${inClause})
      GROUP BY E.ID_Dificultad
    `;
    
    const resultadoDificultad = await pool.request().query(resultadoDificultadQuery);
  console.log("No llegue aqui");

     let valorNivel = 0;
    let totalEjercicios = 0;
    resultadoDificultad.recordset.forEach(row => {
      totalEjercicios += row.Cantidad;
      if (row.ID_Dificultad === 1) { // Suponiendo que 1 es fácil, 2 intermedio, 3 difícil
        valorNivel += row.Cantidad * 0;
      } else if (row.ID_Dificultad === 2) {
        valorNivel += row.Cantidad * 0.5;
      } else if (row.ID_Dificultad === 3) {
        valorNivel += row.Cantidad * 1;
      }
    });
    valorNivel /= totalEjercicios;

    // Asignar ID_Dificultad basado en valorNivel
    let ID_Dificultad;
    let ID_NivelFormaFisica;
    if (valorNivel < 0.33) {
      ID_Dificultad = 1; // Fácil
      ID_NivelFormaFisica = 3;
    } else if (valorNivel < 0.66) {
      ID_Dificultad = 2; // Intermedio
      ID_NivelFormaFisica = 2;
    } else {
      ID_Dificultad = 3; // Difícil
      ID_NivelFormaFisica = 1;
    }

    console.log("Nivel: ", valorNivel);
    console.log("ID_Dificultad: ", ID_Dificultad);

    await pool.request()
    .input('ID_Rutina', sql.Int, ID_Rutina)
    .input('ID_Dificultad', sql.Int, ID_Dificultad)
    .input('ID_NivelFormaFisica', sql.Int, ID_NivelFormaFisica)
    .query("UPDATE Rutina SET ID_Dificultad = @ID_Dificultad, ID_NivelFormaFisica = @ID_NivelFormaFisica WHERE ID_Rutina = @ID_Rutina");
  
    res
      .status(201)
      .json({ message: "Ejercicios del día creados correctamente." });
  } catch (error) {
    console.error("Error en la creación de los ejercicios del día:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getEjerciciosPorDia = async (req, res) => {
  try {
    const ID_Dia = req.params.id; // Obtiene el ID del día desde la URL
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("ID_Dias_Entreno", sql.Int, ID_Dia)
      .query(querys.getEjerciciosPorDia); // Asume que tienes esta consulta SQL en tus `querys`

    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.status(404).send("No se encontraron ejercicios para este día");
    }
  } catch (error) {
    console.error("Error al obtener los ejercicios del día:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateEjerciciosDia = async (req, res) => {
  try {
    const { ID_Dia, ejercicios } = req.body;
    const pool = await getConnection();

    // Obtener todos los ejercicios actuales para este día, incluyendo su ID_EjercicioDia
    const ejerciciosActualesRes = await pool.request()
      .input('ID_Dias_Entreno', sql.Int, ID_Dia)
      .query('SELECT ID_EjerciciosDia, ID_Ejercicio FROM EjerciciosDia WHERE ID_Dias_Entreno = @ID_Dias_Entreno');
    const ejerciciosActuales = ejerciciosActualesRes.recordset;

    // Determinar ejercicios para agregar, actualizar y eliminar
    const ejerciciosParaAgregar = ejercicios.filter(ej => !ej.ID_EjerciciosDia);
    const ejerciciosParaActualizar = ejercicios.filter(ej => ej.ID_EjerciciosDia);
    const idsEjerciciosParaActualizar = ejerciciosParaActualizar.map(ej => ej.ID_EjerciciosDia);
    const ejerciciosParaEliminar = ejerciciosActuales.filter(ej => !idsEjerciciosParaActualizar.includes(ej.ID_EjerciciosDia));

    // Eliminar ejercicios que ya no están presentes
    for (const { ID_EjerciciosDia } of ejerciciosParaEliminar) {
      await pool.request()
        .input('ID_EjerciciosDia', sql.Int, ID_EjerciciosDia)
        .query('DELETE FROM EjerciciosDia WHERE ID_EjerciciosDia = @ID_EjerciciosDia');
    }

    // Añadir nuevos ejercicios
    for (const ejercicio of ejerciciosParaAgregar) {
      await pool.request()
        .input('ID_Dias_Entreno', sql.Int, ID_Dia)
        .input('ID_Ejercicio', sql.Int, ejercicio.ID_Ejercicio)
        .input('descanso', sql.Time, ejercicio.restTime)
        .input('superset', sql.Bit, ejercicio.isSuperset)
        .query('INSERT INTO EjerciciosDia (ID_Dias_Entreno, ID_Ejercicio, descanso, superset) VALUES (@ID_Dias_Entreno, @ID_Ejercicio, @descanso, @superset)');
    }

    // Actualizar ejercicios existentes
    for (const ejercicio of ejerciciosParaActualizar) {
      await pool.request()
        .input('ID_EjerciciosDia', sql.Int, ejercicio.ID_EjerciciosDia)
        .input('descanso', sql.Time, ejercicio.restTime)
        .input('superset', sql.Bit, ejercicio.isSuperset)
        .query('UPDATE EjerciciosDia SET descanso = @descanso, superset = @superset WHERE ID_EjerciciosDia = @ID_EjerciciosDia');
    }

    res.status(200).json({ message: 'Ejercicios actualizados correctamente.' });
  } catch (error) {
    console.error('Error al actualizar ejercicios:', error);
    res.status(500).json({ error: error.message });
  }
};

export const crearBloqueSetsConSeries = async (req, res) => {
  const { ID_EjerciciosDia, series } = req.body;
  console.log(ID_EjerciciosDia, series);
  try {
    const pool = await getConnection();

    // Insertar el BloqueSets y obtener su ID
    const resultBloqueSets = await pool.request()
      .input('ID_EjerciciosDia', sql.Int, ID_EjerciciosDia)
      .query("INSERT INTO BloqueSets (ID_EjerciciosDia) OUTPUT INSERTED.ID_BloqueSets VALUES (@ID_EjerciciosDia);");
    const ID_BloqueSets = resultBloqueSets.recordset[0].ID_BloqueSets;

    for (const serie of series) {
      // Insertar la Serie principal
      const resultSerie = await pool.request()
        .input('repeticiones', sql.Int, serie.reps)
        .input('peso', sql.Int, serie.weight)
        // Asume que 'tiempo' es el campo correcto para 'descanso'; ajusta según sea necesario
        .query("INSERT INTO Serie (repeticiones, peso, tiempo, ID_SeriePrincipal) VALUES (@repeticiones, @peso, NULL, NULL); SELECT SCOPE_IDENTITY() AS ID_Serie;");
      const ID_Serie = resultSerie.recordset[0].ID_Serie;

      // Asociar la Serie principal al BloqueSets
      await pool.request()
        .input('ID_BloqueSets', sql.Int, ID_BloqueSets)
        .input('ID_Serie', sql.Int, ID_Serie)
        .query("INSERT INTO ConjuntoSeries (ID_BloqueSets, ID_Serie) VALUES (@ID_BloqueSets, @ID_Serie);");

      // Si hay subseries (dropsets), repetir el proceso para cada una
      if (serie.subsets && serie.subsets.length > 0) {
        for (const subset of serie.subsets) {
          const resultSubSerie = await pool.request()
            .input('repeticiones', sql.Int, subset.reps)
            .input('peso', sql.Int, subset.weight)
            .input('ID_SeriePrincipal', sql.Int, ID_Serie)
            // Asume que 'tiempo' es el campo correcto para 'descanso'; ajusta según sea necesario
            .query("INSERT INTO Serie (repeticiones, peso, tiempo, ID_SeriePrincipal) VALUES (@repeticiones, @peso, NULL, @ID_SeriePrincipal); SELECT SCOPE_IDENTITY() AS ID_Serie;", {
              ID_SeriePrincipal: ID_Serie // Asigna el ID de la serie principal a las subseries (dropsets)
            });
          const ID_SubSeries = resultSubSerie.recordset[0].ID_Serie;

          // Asociar cada subserie al BloqueSets
          await pool.request()
            .input('ID_BloqueSets', sql.Int, ID_BloqueSets)
            .input('ID_Serie', sql.Int, ID_SubSeries)
            .query("INSERT INTO ConjuntoSeries (ID_BloqueSets, ID_Serie) VALUES (@ID_BloqueSets, @ID_Serie);");
        }
      }
    }
    res.status(200).json({ message: 'Series actualizadas correctamente.' });
  } catch (error) {
    console.error('Error al crear BloqueSets y Series:', error);
    res.status(500).json({ error: error.message });
  }
};

export const actualizarBloqueSetsConSeries = async (req, res) => {
  const { ID_EjerciciosDia, series } = req.body;
  try {
    const pool = await getConnection();

    // Opcional: Verificar si el BloqueSets existe para el ID_EjerciciosDia dado
    // Esto es solo para confirmar que el BloqueSets a actualizar existe.

    // Primero, borrar todas las series (y subseries por cascada si tu base de datos está configurada para ello)
    // asociadas al BloqueSets que se va a actualizar.
    await pool.request()
      .input('ID_EjerciciosDia', sql.Int, ID_EjerciciosDia)
      .query(`
        DELETE Serie
        FROM Serie
        INNER JOIN ConjuntoSeries ON Serie.ID_Serie = ConjuntoSeries.ID_Serie
        INNER JOIN BloqueSets ON ConjuntoSeries.ID_BloqueSets = BloqueSets.ID_BloqueSets
        WHERE BloqueSets.ID_EjerciciosDia = @ID_EjerciciosDia;
      `);

    // Luego, insertar nuevamente las series y subseries como se hizo en la creación
    for (const serie of series) {
      // Insertar la Serie principal
      const resultSerie = await pool.request()
        .input('repeticiones', sql.Int, serie.reps)
        .input('peso', sql.Int, serie.weight)
        .query("INSERT INTO Serie (repeticiones, peso, tiempo, ID_SeriePrincipal) VALUES (@repeticiones, @peso, NULL, NULL); SELECT SCOPE_IDENTITY() AS ID_Serie;");
      const ID_Serie = resultSerie.recordset[0].ID_Serie;

      // Asociar la Serie principal al BloqueSets nuevamente
      await pool.request()
        .input('ID_EjerciciosDia', sql.Int, ID_EjerciciosDia) // Asegúrate de tener el ID_BloqueSets correcto si es necesario
        .input('ID_Serie', sql.Int, ID_Serie)
        .query("INSERT INTO ConjuntoSeries (ID_BloqueSets, ID_Serie) VALUES ((SELECT ID_BloqueSets FROM BloqueSets WHERE ID_EjerciciosDia = @ID_EjerciciosDia), @ID_Serie);");

      // Si hay subseries (dropsets), insertarlas también
      if (serie.subsets && serie.subsets.length > 0) {
        for (const subset of serie.subsets) {
          const resultSubSerie = await pool.request()
            .input('repeticiones', sql.Int, subset.reps)
            .input('peso', sql.Int, subset.weight)
            .input('ID_SeriePrincipal', sql.Int, ID_Serie)
            .query("INSERT INTO Serie (repeticiones, peso, tiempo, ID_SeriePrincipal) VALUES (@repeticiones, @peso, NULL, @ID_SeriePrincipal); SELECT SCOPE_IDENTITY() AS ID_Serie;");
          const ID_SubSeries = resultSubSerie.recordset[0].ID_Serie;

          // Asociar cada subserie al BloqueSets nuevamente
          await pool.request()
            .input('ID_EjerciciosDia', sql.Int, ID_EjerciciosDia) // Asegúrate de tener el ID_BloqueSets correcto si es necesario
            .input('ID_Serie', sql.Int, ID_SubSeries)
            .query("INSERT INTO ConjuntoSeries (ID_BloqueSets, ID_Serie) VALUES ((SELECT ID_BloqueSets FROM BloqueSets WHERE ID_EjerciciosDia = @ID_EjerciciosDia), @ID_Serie);");
        }
      }
    }

    const rutinaRelacionada = await pool.request()
  .input('ID_EjerciciosDia', sql.Int, ID_EjerciciosDia)
  .query(`
    SELECT Rutina.ID_Rutina
    FROM Rutina
    INNER JOIN Dias_Entreno ON Rutina.ID_Rutina = Dias_Entreno.ID_Rutina
    INNER JOIN EjerciciosDia ON Dias_Entreno.ID_Dias_Entreno = EjerciciosDia.ID_Dias_Entreno
    WHERE EjerciciosDia.ID_EjerciciosDia = @ID_EjerciciosDia;
  `);
  console.log("Rutina relacionada:", rutinaRelacionada.recordset);

if (rutinaRelacionada.recordset.length > 0) {
  const ID_Rutina = rutinaRelacionada.recordset[0].ID_Rutina;

  // Ahora que tienes ID_Rutina, puedes calcular la duración promedio
  // Asegúrate de corregir la consulta para calcular la duración promedio correctamente
  const resultadoDuracion = await pool.request()
    .input('ID_Rutina', sql.Int, ID_Rutina) // Asegúrate de que esta variable se declara correctamente aquí
    .query(`
    WITH DuracionPorDia AS (
      SELECT
          ED.ID_Dias_Entreno,
          SUM((S.repeticiones * 2) + DATEDIFF(SECOND, '00:00:00', ED.descanso)) AS DuracionTotal
      FROM
          EjerciciosDia ED
          INNER JOIN BloqueSets BS ON ED.ID_EjerciciosDia = BS.ID_EjerciciosDia
          INNER JOIN ConjuntoSeries CS ON BS.ID_BloqueSets = CS.ID_BloqueSets
          INNER JOIN Serie S ON CS.ID_Serie = S.ID_Serie
      GROUP BY
          ED.ID_Dias_Entreno
  )
  SELECT
      AVG(DuracionTotal) AS PromedioDuracion
  FROM
      DuracionPorDia;
    `);

    console.log("Resultado de calcular duración promedio:", resultadoDuracion.recordset);
  if (resultadoDuracion.recordset.length > 0) {
    const duracionPromedio = resultadoDuracion.recordset[0].PromedioDuracion;

    // Actualiza la duración en la rutina
    await pool.request()
      .input('ID_Rutina', sql.Int, ID_Rutina)
      .input('duracion', sql.Float, duracionPromedio) // Asegúrate de que el tipo de dato sea correcto
      .query(`
        UPDATE Rutina
        SET duracion = @duracion
        WHERE ID_Rutina = @ID_Rutina;
      `);
  }
}
    res.status(200).json({ message: 'BloqueSets y Series actualizados correctamente.' });
  } catch (error) {
    console.error('Error al actualizar BloqueSets y Series:', error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerSetsPorEjercicioDia = async (req, res) => {
  const ID_EjerciciosDia = req.params.id; // Asumiendo que pasas este ID como parámetro en la URL

  try {
    const pool = await getConnection(); // Asume que esta función obtiene la conexión a tu base de datos
    const resultadoBloqueSets = await pool.request()
      .input('ID_EjerciciosDia', sql.Int, ID_EjerciciosDia)
      .query(`
        SELECT bs.ID_BloqueSets, cs.ID_Serie, s.repeticiones, s.peso, s.tiempo, s.ID_SeriePrincipal
        FROM BloqueSets bs
        JOIN ConjuntoSeries cs ON bs.ID_BloqueSets = cs.ID_BloqueSets
        JOIN Serie s ON cs.ID_Serie = s.ID_Serie
        WHERE bs.ID_EjerciciosDia = @ID_EjerciciosDia;
      `);

    if (resultadoBloqueSets.recordset.length > 0) {
      // Transformar resultados para agrupar por sets y detectar subsets
      const sets = resultadoBloqueSets.recordset.reduce((acc, current) => {
        const setIndex = acc.findIndex(set => set.ID_Serie === current.ID_SeriePrincipal || set.ID_Serie === current.ID_Serie);
        
        if (current.ID_SeriePrincipal && setIndex !== -1) {
          // Si el actual es un subset, lo añade al set correspondiente
          acc[setIndex].subsets.push(current);
        } else if (setIndex === -1) {
          // Si es un set nuevo, lo añade a la acumulación
          const nuevoSet = {
            ...current,
            subsets: []
          };
          acc.push(nuevoSet);
        }
        return acc;
      }, []);

      res.json(sets);
    } else {
      res.status(404).send("No se encontraron sets para el ID_EjerciciosDia proporcionado");
    }
  } catch (error) {
    console.error("Error al obtener los sets:", error);
    res.status(500).json({ error: error.message });
  }
};




//Calculos de rutina en EjerciciosDia:
//Nivel de la rutina: 𝑉𝑎𝑙𝑜𝑟𝑁𝑖𝑣𝑒𝑙=𝐶𝑎𝑛𝑡𝐹𝑎𝑐𝑖𝑙𝑒𝑠∗0+𝐶𝑎𝑛𝑡𝐼𝑛𝑡𝑒𝑟𝑚𝑒𝑑𝑖𝑜𝑠∗0.5 +𝐶𝑎𝑛𝑡𝐷𝑖𝑓𝑖𝑐𝑖𝑙𝑒𝑠∗1/𝑇𝑜𝑡𝑎𝑙𝐸𝑗𝑒𝑟𝑐𝑖𝑐𝑖𝑜𝑠

//Calculos de rutina en series: 
//Objetivo de la rutina: Porcentaje de tiempo de cardio y fuerza
//Duracion: Tiempos



