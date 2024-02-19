export const querys = {
  //Usuarios
    getUsers: "SELECT * FROM Usuario",
    getUserById: "SELECT * FROM Usuario WHERE ID_Usuario = @ID_Usuario",
    checkUserExists: "SELECT ID_Usuario FROM Usuario WHERE ID_Usuario = @oid",
    createUser:  "INSERT INTO Usuario (ID_Usuario, nombre_usuario, nombre, apellido, correo, sexo, fecha_nacimiento) VALUES (@oid, @username, @givenName, @surname, @email, @gender, @dateOfBirth)",
    getBirthDate: "SELECT fecha_nacimiento, sexo FROM Usuario WHERE ID_Usuario = @ID_Usuario",

    //Usuario Movil
    createMovileUser: "INSERT INTO UsuarioMovil (ID_Tipo, ID_Usuario) VALUES (1, @ID_Usuario)",
    getMobileUser: "SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario",

    //Equipo
    getMaterials: "SELECT equipo FROM Equipo",
    getMaterialByName: "SELECT ID_Equipo FROM Equipo WHERE equipo = @nombre",

    //Cuestionario
    createCuestionario: "INSERT INTO Cuestionario (ID_UsuarioMovil, tiempo_disponible, ID_Objetivo, ID_NivelFormaFisica, ID_EspacioDisponible, ID_Musculo ) OUTPUT INSERTED.ID_Cuestionario VALUES (@ID_UsuarioMovil, @tiempo_disponible, @ID_Objetivo, @ID_NivelFormaFisica, @ID_EspacioDisponible, @ID_Musculo)",

    //Espacio
    getSpaceByName: "SELECT ID_EspacioDisponible FROM EspacioDisponible WHERE espacio_disponible = @nombre",

    //PuedeEntrenar
    createPuedeEntrenar: "INSERT INTO PuedeEntrenar (ID_Cuestionario, ID_Dia) VALUES (@ID_Cuestionario, @ID_Dia)",
    createPadece: "INSERT INTO Padece (ID_Cuestionario, ID_Lesion) VALUES (@ID_Cuestionario, @ID_Lesion)",
    createDispone: "INSERT INTO Dispone (ID_Cuestionario, ID_Equipo) VALUES (@ID_Cuestionario, @ID_Equipo)",

    //QuiereEntrenar
    createQuiereEntrenar:"INSERT INTO QuiereEntrenar (ID_Dia, ID_Musculo, ID_Cuestionario) OUTPUT INSERTED.ID_QuiereEntrenar VALUES (@ID_Dia, @ID_Musculo, @ID_Cuestionario) ",
    createQuiereEntrenarDia:"INSERT INTO QuiereEntrenarDia (ID_Dia, ID_Musculo) OUTPUT INSERTED.ID_QuiereEntrenarDia VALUES (@ID_Dia, @ID_Musculo)",

    //Ejercicio
    createEjercicio: "INSERT INTO Ejercicio (ejercicio, preparacion, ejecucion, ID_Musculo, ID_Tipo_Ejercicio, ID_Dificultad, ID_Equipo, ID_Modalidad, ID_Lesion) OUTPUT INSERTED.ID_Ejercicio VALUES (@ejercicio, @preparacion, @ejecucion, @ID_Musculo, @ID_Tipo_Ejercicio, @ID_Dificultad, @ID_Equipo, @ID_Modalidad, @ID_Lesion)",
    updateEjercicio:`UPDATE Ejercicio SET ejercicio = @ejercicio, preparacion = @preparacion, ejecucion = @ejecucion, ID_Musculo = @ID_Musculo,
    ID_Tipo_Ejercicio = @ID_Tipo_Ejercicio, ID_Dificultad = @ID_Dificultad, ID_Equipo = @ID_Equipo, ID_Modalidad = @ID_Modalidad, ID_Lesion = @ID_Lesion WHERE ID_Ejercicio = @ID_Ejercicio`,
    getEjercicios: "SELECT E.ID_Ejercicio, E.ejecucion, E.ejercicio, E.preparacion, D.dificultad AS Dificultad, M.modalidad AS Modalidad, Mu.descripcion AS Musculo, TE.descripcion AS Tipo_Ejercicio, EQ.equipo AS Equipo FROM Ejercicio E JOIN Dificultad D ON E.ID_Dificultad = D.ID_Dificultad JOIN Modalidad M ON E.ID_Modalidad = M.ID_Modalidad JOIN Musculo Mu ON E.ID_Musculo = Mu.ID_Musculo JOIN Tipo_Ejercicio TE ON E.ID_Tipo_Ejercicio = TE.ID_Tipo_Ejercicio JOIN Equipo EQ ON E.ID_Equipo = EQ.ID_Equipo", 
    getEjerciciosById: "SELECT * FROM Ejercicio WHERE ID_Ejercicio = @ID_Ejercicio",

    //Tambien Entrena
    createTambienEntrena: "INSERT INTO TambienEntrena (ID_Musculo, ID_Ejercicio) VALUES (@ID_Musculo, @ID_Ejercicio)",
    getMusculosSecundarios: `
    SELECT M.descripcion FROM TambienEntrena TE JOIN Musculo M ON TE.ID_Musculo = M.ID_Musculo WHERE TE.ID_Ejercicio = @ID_Ejercicio`,
    getMusculosSecs: "SELECT ID_Musculo FROM TambienEntrena WHERE ID_Ejercicio = @ID_Ejercicio",
    

    //Alimentos
    createAlimento: "INSERT INTO Alimento(nombre, calorias, peso, ID_Categoria) OUTPUT INSERTED.ID_Alimento VALUES (@nombre, @calorias, @peso, @ID_Categoria)",
    getAlimento:"select a.ID_Alimento, a.nombre, a.calorias, a.peso, c.categoria from Alimento as a JOIN categoria as c ON a.ID_Categoria = c.ID_Categoria",
    getAlimentoById: "SELECT * FROM Alimento WHERE ID_Alimento = @ID_Alimento",
    updateAlimento: `UPDATE Alimento SET nombre = @nombre, calorias = @calorias, peso = @peso, ID_Categoria = @ID_Categoria WHERE ID_Alimento = @ID_Alimento`,
  
    //Contiene (Macronutrientes del alimento)
    createContiene: "INSERT INTO Contiene(ID_Alimento, ID_Macronutriente, cantidad) VALUES (@ID_Alimento, @ID_Macronutriente, @cantidad)",
    getContiene: "select m.macronutriente, c.cantidad from Macronutriente as M join Contiene as c ON c.ID_Macronutriente = m.ID_Macronutriente where ID_Alimento=@ID_Alimento",
    updateContiene: `UPDATE Contiene SET cantidad = @cantidad WHERE ID_Alimento = @ID_Alimento AND ID_Macronutriente = @ID_Macronutriente`,
    getContieneById: "SELECT ID_Macronutriente, cantidad FROM Contiene WHERE ID_Alimento = @ID_Alimento",

    //Recetas
    createReceta: "INSERT INTO Receta (receta, calorias, preparacion, link) OUTPUT INSERTED.ID_Receta VALUES (@receta, @calorias, @preparacion, @link)",
    getReceta: "SELECT ID_Receta, receta, calorias, preparacion, link FROM Receta",
    updateReceta: `UPDATE Receta SET receta = @receta, calorias = @calorias, preparacion = @preparacion, link = @link WHERE ID_Receta = @ID_Receta`,

    //TieneIngredientes
    createTieneIngredientes: "INSERT INTO TieneIngredientes(ID_Receta, ID_Alimento, porcion) VALUES (@ID_Receta, @ID_Alimento, @porcion)",
    getIngredientes: "SELECT a.nombre, i.porcion FROM TieneIngredientes AS i JOIN Alimento as a ON a.ID_Alimento = i.ID_Alimento WHERE ID_Receta = @ID_Receta",
    getIngredientesById: "SELECT ID_Alimento, porcion FROM TieneIngredientes WHERE ID_Receta = @ID_Receta",
    deleteIngredientesByReceta: "DELETE FROM TieneIngredientes WHERE ID_Receta = @ID_Receta",

    //Clasficiacion Recetas
    createClasificaReceta: "INSERT INTO ClasificaReceta(ID_Receta, ID_Clasificacion) VALUES (@ID_Receta, @ID_Clasificacion)",  
    getClasificaReceta: "SELECT c.clasificacion FROM ClasificaReceta AS ca JOIN Clasificacion as c ON ca.ID_Clasificacion = c.ID_Clasificacion WHERE ID_Receta = @ID_Receta",
    deleteClasificaReceta: "DELETE FROM ClasificaReceta WHERE ID_Receta = @ID_Receta",

    //Obtiene
    createObtiene: "INSERT INTO Obtiene (ID_Receta, ID_Macronutriente, cantidad) VALUES (@ID_Receta, @ID_Macronutriente, @cantidad)",
    getObtiene: "SELECT ID_Macronutriente, cantidad FROM Obtiene WHERE ID_Receta = @ID_Receta",
    deleteObtieneByReceta: "DELETE FROM Obtiene WHERE ID_Receta = @ID_Receta",
};