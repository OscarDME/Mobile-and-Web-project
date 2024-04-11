import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";



export const getWarnings = async (req, res) => {
  try {
    const pool = await getConnection();
    const oid = req.params.id;
    
    const result = await pool.request()
    .input("ID_Usuario", sql.VarChar, oid)
    .query(`
    select a.ID_Advertencia, r.nombre, a.ID_AdvertenciaTiempo, d.dia, a.ID_Rutina, a.ID_Usuario, a.ID_DescripcionAdvertencia, t.Descripcion
    from Advertencia a
    left join Dias_Entreno e on a.ID_Dias_Entreno = e.ID_Dias_Entreno
    left join Dia d on e.ID_Dia = d.ID_Dia
    inner join Rutina r on a.ID_Rutina = r.ID_Rutina
    inner join DescripcionAdvertencia da on a.ID_DescripcionAdvertencia = da.ID_DescripcionAdvertencia
    inner join TipoAdvertencia t on da.ID_TipoAdvertencia = t.ID_TipoAdvertencia
    where a.ID_Usuario = @ID_Usuario
    `)

    res.status(200).json(result.recordset);
  }
  catch (error) {
    console.error("Error al consultar las advertencias", error);
    res.status(500).json({ error: error.message });
  }
}

export const createWarningFourExercisesSameMuscleADay = async (req, res) => {
    try {
      const { ID_Ejercicios } = req.body;
      const ID_Rutina = req.params.id; 
      const ID_Dias_Entreno = req.params.ID_Dias_Entreno; // Asumiendo que 'id' en los params es para ID_Dias_Entreno también
  
      const pool = await getConnection();
  
      // Obtén el ID del usuario para esta rutina
      const UserResult = await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("SELECT ID_Usuario FROM Rutina WHERE ID_Rutina = @ID_Rutina");
  
      const ID_Usuario = UserResult.recordset[0].ID_Usuario;
  
      // Elimina las advertencias actuales para este usuario y descripción
      await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 1) // Asumiendo que 1 es el código para 'más de 4 ejercicios'
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina AND ID_Dias_Entreno = @ID_Dias_Entreno");
  
      // Cuenta los ejercicios por músculo
      const result = await pool
        .request()
        .input("ID_Ejercicios", sql.VarChar, ID_Ejercicios.join(',')) 
        .query(`
          SELECT e.ID_Musculo, COUNT(*) as Count
          FROM Ejercicio e
          WHERE e.ID_Ejercicio IN (SELECT value FROM STRING_SPLIT(@ID_Ejercicios, ','))
          GROUP BY e.ID_Musculo
          HAVING COUNT(*) > 4
        `);

      if (result.recordset.length > 0) {
        // Hay músculos con más de 4 ejercicios, inserta advertencias
          const addingWarningResult = await pool
            .request()
            .input("ID_Rutina", sql.Int, ID_Rutina)
            .input("ID_Usuario", sql.VarChar, ID_Usuario)
            .input("ID_DescripcionAdvertencia", sql.Int, 1) 
            .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
            .input("ID_AdvertenciaTiempo", sql.Int, 1)
            .query(`
              INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_Dias_Entreno, ID_AdvertenciaTiempo)
              VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_Dias_Entreno, @ID_AdvertenciaTiempo)
            `);

            console.log("Resultado de la insercion de advertencia:", addingWarningResult);

        return res.status(200).json({
          warning: "Hay uno o más músculos con más de 4 ejercicios en un día.",
          details: result.recordset
        });
      } else {
        // No hay músculos con más de 4 ejercicios
        return res.status(200).json({ message: "Este día de entrenamiento no contiene más de 4 ejercicios que trabajen el mismo músculo. Todo bien." });
      }
    } catch (error) {
      console.error("Error al crear la advertencia:", error);
      res.status(500).json({ error: error.message });
    }
  };
  

  export const createWarningEightExercisesADay = async (req, res) => {
    try {
      const { exercises } = req.body;
      const ID_Rutina = req.params.id; 
      const ID_Dias_Entreno = req.params.ID_Dias_Entreno; // Asumiendo que 'id' en los params es para ID_Dias_Entreno también

    
      const pool = await getConnection();
      // Obtén el ID del usuario para esta rutina
      const UserResult = await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("SELECT ID_Usuario FROM Rutina WHERE ID_Rutina = @ID_Rutina");
  
      const ID_Usuario = UserResult.recordset[0].ID_Usuario;
  
      // Elimina las advertencias actuales para este usuario y descripción
      await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 3)
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina AND ID_Dias_Entreno = @ID_Dias_Entreno");


        if (!(exercises.length > 8)) {
            return res.status(200).json({ message: "Este día de entrenamiento no contiene más de 8 ejercicios. Todo bien." });
            }

          const addingWarningResult = await pool
            .request()
            .input("ID_Rutina", sql.Int, ID_Rutina)
            .input("ID_Usuario", sql.VarChar, ID_Usuario)
            .input("ID_DescripcionAdvertencia", sql.Int, 3) 
            .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
            .input("ID_AdvertenciaTiempo", sql.Int, 1)
            .query(`
              INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_Dias_Entreno, ID_AdvertenciaTiempo)
              VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_Dias_Entreno, @ID_AdvertenciaTiempo)
            `);

        console.log("Resultado de la insercion de advertencia:", addingWarningResult);

    return res.status(200).json({ message: "Se agrego la advertencia por tener mas de 8 ejercicios en un día, correctamente." });

    } catch (error) {
      console.error("Error al crear la advertencia:", error);
      res.status(500).json({ error: error.message });
    }
  };
  

  export const createWarningFourExercisesSameMaterialADay = async (req, res) => {
    try {
      const { ID_Ejercicios } = req.body;
      const ID_Rutina = req.params.id; 
      const ID_Dias_Entreno = req.params.ID_Dias_Entreno; 
  
      const pool = await getConnection();
  
      // Obtén el ID del usuario para esta rutina
      const UserResult = await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("SELECT ID_Usuario FROM Rutina WHERE ID_Rutina = @ID_Rutina");
  
      const ID_Usuario = UserResult.recordset[0].ID_Usuario;
  
      // Elimina las advertencias actuales para este usuario y descripción
      await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 10) 
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina AND ID_Dias_Entreno = @ID_Dias_Entreno");
  
      // Cuenta los ejercicios por músculo
      const result = await pool
        .request()
        .input("ID_Ejercicios", sql.VarChar, ID_Ejercicios.join(',')) 
        .query(`
          SELECT e.ID_Equipo , COUNT(*) as Count
          FROM Ejercicio e
          WHERE e.ID_Ejercicio IN (SELECT value FROM STRING_SPLIT(@ID_Ejercicios, ','))
		  AND e.ID_Equipo IS NOT NULL
          GROUP BY e.ID_Equipo
          HAVING COUNT(*) > 3
        `);

      if (result.recordset.length > 0) {
          const addingWarningResult = await pool
            .request()
            .input("ID_Rutina", sql.Int, ID_Rutina)
            .input("ID_Usuario", sql.VarChar, ID_Usuario)
            .input("ID_DescripcionAdvertencia", sql.Int, 10) 
            .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
            .input("ID_AdvertenciaTiempo", sql.Int, 1)
            .query(`
              INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_Dias_Entreno, ID_AdvertenciaTiempo)
              VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_Dias_Entreno, @ID_AdvertenciaTiempo)
            `);

            console.log("Resultado de la insercion de advertencia:", addingWarningResult);

        return res.status(200).json({
          warning: "Hay uno o más ejercicio con el mismo material en más de 4 ejercicios en un día.",
          details: result.recordset
        });
      } else {

        return res.status(200).json({ message: "Este día de entrenamiento no contiene más de 4 ejercicios que trabajen el mismo material. Todo bien." });
      }
    } catch (error) {
      console.error("Error al crear la advertencia:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const createWarningThreeExercisesHighIntensityADay = async (req, res) => {
    try {
      const { ID_Ejercicios } = req.body;
      const ID_Rutina = req.params.id; 
      const ID_Dias_Entreno = req.params.ID_Dias_Entreno; 
  
      const pool = await getConnection();
  
      // Obtén el ID del usuario para esta rutina
      const UserResult = await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("SELECT ID_Usuario FROM Rutina WHERE ID_Rutina = @ID_Rutina");
  
      const ID_Usuario = UserResult.recordset[0].ID_Usuario;
  
      // Elimina las advertencias actuales para este usuario y descripción
      await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 11) 
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina AND ID_Dias_Entreno = @ID_Dias_Entreno");
  
      const result = await pool
        .request()
        .input("ID_Ejercicios", sql.VarChar, ID_Ejercicios.join(',')) 
        .query(`
          SELECT e.ID_Dificultad, COUNT(*) as Count
          FROM Ejercicio e
          WHERE e.ID_Ejercicio IN (SELECT value FROM STRING_SPLIT(@ID_Ejercicios, ','))
		  AND e.ID_Dificultad = 3
          GROUP BY e.ID_Dificultad
          HAVING COUNT(*) > 2
        `);

      if (result.recordset.length > 0) {
          const addingWarningResult = await pool
            .request()
            .input("ID_Rutina", sql.Int, ID_Rutina)
            .input("ID_Usuario", sql.VarChar, ID_Usuario)
            .input("ID_DescripcionAdvertencia", sql.Int, 11) 
            .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
            .input("ID_AdvertenciaTiempo", sql.Int, 1)
            .query(`
              INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_Dias_Entreno, ID_AdvertenciaTiempo)
              VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_Dias_Entreno, @ID_AdvertenciaTiempo)
            `);

            console.log("Resultado de la insercion de advertencia:", addingWarningResult);

        return res.status(200).json({
          warning: "Hay mas de 3 ejercicios con intensidad alta en un día.",
          details: result.recordset
        });
      } else {

        return res.status(200).json({ message: "Este día de entrenamiento no contiene más de 3 ejercicios con intensidad alta. Todo bien." });
      }
    } catch (error) {
      console.error("Error al crear la advertencia:", error);
      res.status(500).json({ error: error.message });
    }
  };


  export const createWarningLessThanAMinuteOfRestPerExercise = async (req, res) => {
    try {
      const { exercises } = req.body;
      const ID_Rutina = req.params.id; 
      const ID_Dias_Entreno = req.params.ID_Dias_Entreno;

    
      const pool = await getConnection();
      // Obtén el ID del usuario para esta rutina
      const UserResult = await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("SELECT ID_Usuario FROM Rutina WHERE ID_Rutina = @ID_Rutina");
  
      const ID_Usuario = UserResult.recordset[0].ID_Usuario;
  
      // Elimina las advertencias actuales para este usuario y descripción
      await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 7)
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina AND ID_Dias_Entreno = @ID_Dias_Entreno");
        const allExercisesHaveRestTime = exercises.every(exercise => 
          exercise.restTime && parseInt(exercise.restTime.trim()) >= 60
        );

        if (allExercisesHaveRestTime) {
            return res.status(200).json({ message: "Este día de entrenamiento no contiene más de 8 ejercicios. Todo bien." });
            }

          const addingWarningResult = await pool
            .request()
            .input("ID_Rutina", sql.Int, ID_Rutina)
            .input("ID_Usuario", sql.VarChar, ID_Usuario)
            .input("ID_DescripcionAdvertencia", sql.Int, 7) 
            .input("ID_Dias_Entreno", sql.Int, ID_Dias_Entreno)
            .input("ID_AdvertenciaTiempo", sql.Int, 1)
            .query(`
              INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_Dias_Entreno, ID_AdvertenciaTiempo)
              VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_Dias_Entreno, @ID_AdvertenciaTiempo)
            `);

        console.log("Resultado de la insercion de advertencia:", addingWarningResult);

    return res.status(200).json({ message: "Se agrego la advertencia por tener mas de 8 ejercicios en un día, correctamente." });

    } catch (error) {
      console.error("Error al crear la advertencia:", error);
      res.status(500).json({ error: error.message });
    }
  };


  export const createWarningWeeklyCheck = async (req, res) => {
    try {
      const { workouts } = req.body;
      const ID_Rutina = req.params.id; 
    
      const pool = await getConnection();
      // Obtén el ID del usuario para esta rutina
      const UserResult = await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("SELECT ID_Usuario FROM Rutina WHERE ID_Rutina = @ID_Rutina");
  
      const ID_Usuario = UserResult.recordset[0].ID_Usuario;
  
      // Elimina las advertencias actuales para este usuario y descripción
      await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 2)
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina");

        await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 4)
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina");

        await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 5)
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina");

        await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 8)
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina");

        await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 9)
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query("DELETE FROM Advertencia WHERE ID_Usuario = @ID_Usuario AND ID_DescripcionAdvertencia = @ID_DescripcionAdvertencia AND ID_Rutina = @ID_Rutina");


        const checkForConsecutiveDays = (workouts) => {
          const sortedIds = workouts.map(workout => workout.ID_Dia).sort((a, b) => a - b);
          for (let i = 0; i < sortedIds.length - 4; i++) {
            if (sortedIds[i + 4] - sortedIds[i] === 4) { 
              console.log("Se encontraron 5 días consecutivos de entrenamiento");
              return true; 
            }
          }
          return false; 
        }
        
        // Una rutina tiene 5 o mas dias de entrenamiento sin ningun dia de descanso entre ellos
        if (checkForConsecutiveDays(workouts)) {
          await pool
            .request()
            .input("ID_Rutina", sql.Int, ID_Rutina)
            .input("ID_Usuario", sql.VarChar, ID_Usuario)
            .input("ID_DescripcionAdvertencia", sql.Int, 5) 
            .input("ID_AdvertenciaTiempo", sql.Int, 1)
            .query(`
              INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_AdvertenciaTiempo)
              VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_AdvertenciaTiempo)
            `);
        }

        //Una rutina entrena menos de 4 musculos diferentes
        const differentMuscles = await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query(`
        SELECT R.ID_Rutina, COUNT(DISTINCT E.ID_Musculo) AS CantidadMusculos
        FROM Rutina R
        JOIN Dias_Entreno DE ON R.ID_Rutina = DE.ID_Rutina
        JOIN EjerciciosDia ED ON DE.ID_Dias_Entreno = ED.ID_Dias_Entreno
        JOIN Ejercicio E ON ED.ID_Ejercicio = E.ID_Ejercicio
        WHERE R.ID_Rutina = @ID_Rutina
        GROUP BY R.ID_Rutina
        HAVING COUNT(DISTINCT E.ID_Musculo) < 4;
      `);

      if(differentMuscles.recordset.length > 0 && differentMuscles.recordset[0].CantidadMusculos < 4) {
        await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 9) 
        .input("ID_AdvertenciaTiempo", sql.Int, 1)
        .query(`
          INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_AdvertenciaTiempo)
          VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_AdvertenciaTiempo)
        `);
      }

      //Una rutina realiza un ejercicio 3 veces o mas en la semana
      const countExercises = await pool
        .request()
       .input("ID_Rutina", sql.Int, ID_Rutina)
       .query(`
       SELECT E.ID_Ejercicio, COUNT(*) AS Cantidad
       FROM Dias_Entreno DE
       JOIN EjerciciosDia ED ON DE.ID_Dias_Entreno = ED.ID_Dias_Entreno
       JOIN Ejercicio E ON ED.ID_Ejercicio = E.ID_Ejercicio
       WHERE DE.ID_Rutina = @ID_Rutina
       GROUP BY E.ID_Ejercicio
       HAVING COUNT(*) >= 3;
      `);

      if(countExercises.recordset.length > 0) {
        await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 8) 
        .input("ID_AdvertenciaTiempo", sql.Int, 1)
        .query(`
          INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_AdvertenciaTiempo)
          VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_AdvertenciaTiempo)
        `);
      }

      //Una rutina tiene dos dias consecutivos en los que se trabaja un mismo musculo

      const countTwoConsecutiveDays = await pool
      .request()
      .input("ID_Rutina", sql.Int, ID_Rutina)
      .query(`
      WITH MusculosDias AS (
        SELECT 
          DE.ID_Dia, 
          E.ID_Musculo, 
          LAG(DE.ID_Dia) OVER (ORDER BY DE.ID_Dia) as PrevDiaID,
          LAG(E.ID_Musculo) OVER (ORDER BY DE.ID_Dia) as PrevMuscleID
        FROM 
          Dias_Entreno DE
          INNER JOIN EjerciciosDia ED ON DE.ID_Dias_Entreno = ED.ID_Dias_Entreno
          INNER JOIN Ejercicio E ON ED.ID_Ejercicio = E.ID_Ejercicio
        WHERE 
          DE.ID_Rutina = @ID_Rutina
      )
      SELECT DISTINCT
        MD.ID_Dia,
        MD.ID_Musculo
      FROM 
        MusculosDias MD
      WHERE 
        MD.ID_Dia - MD.PrevDiaID = 1 AND MD.ID_Musculo = MD.PrevMuscleID
      
      `)

      if(countTwoConsecutiveDays.recordset.length > 0) {
        await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 4) 
        .input("ID_AdvertenciaTiempo", sql.Int, 1)
        .query(`
          INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_AdvertenciaTiempo)
          VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_AdvertenciaTiempo)
        `);t
      }


      //Una rutina tiene mas de 12 ejercicios de un mismo musculo a la semana

      const countTwelveExercises = await pool
      .request()
      .input("ID_Rutina", sql.Int, ID_Rutina)
      .query(`
      SELECT 
        E.ID_Musculo, 
        COUNT(*) AS NumeroDeEjercicios
      FROM 
        Dias_Entreno DE
        JOIN EjerciciosDia ED ON DE.ID_Dias_Entreno = ED.ID_Dias_Entreno
        JOIN Ejercicio E ON ED.ID_Ejercicio = E.ID_Ejercicio
      WHERE 
        DE.ID_Rutina = @ID_Rutina
      GROUP BY 
        E.ID_Musculo
      HAVING 
        COUNT(*) > 12;
     `);

     if(countTwelveExercises.recordset.length > 0) {
       await pool
       .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .input("ID_DescripcionAdvertencia", sql.Int, 2)
        .input("ID_AdvertenciaTiempo", sql.Int, 1)
        .query(`
          INSERT INTO Advertencia (ID_Rutina, ID_Usuario, ID_DescripcionAdvertencia, ID_AdvertenciaTiempo)
          VALUES (@ID_Rutina, @ID_Usuario, @ID_DescripcionAdvertencia, @ID_AdvertenciaTiempo)
        `);
     }


    return res.status(200).json({ message: "Se agregaron las advertencias al crear una rutina correctamente." });

    } catch (error) {
      console.error("Error al crear las advertencias semanales", error);
      res.status(500).json({ error: error.message });
    }
  };