export const querys = {
  //Usuarios
    getUsers: "SELECT * FROM Usuario",
    getUserById: "SELECT * FROM Usuario WHERE ID_Usuario = @ID_Usuario",
    getUserByUsername: "SELECT * FROM Usuario WHERE Nombre_Usuario = @Nombre_Usuario",
    createUser: "INSERT INTO Usuario () VALUES",
    //Dias
    getDays: "SELECT * FROM Dia",
    addNewProduct:
      "INSERT INTO [webstore].[dbo].[Products] (name, description, quantity) VALUES (@name,@description,@quantity);",
    deleteProduct: "DELETE FROM [webstore].[dbo].[Products] WHERE Id= @Id",
    getTotalProducts: "SELECT COUNT(*) FROM webstore.dbo.Products",
    updateProductById:
      "UPDATE [webstore].[dbo].[Products] SET Name = @name, Description = @description, Quantity = @quantity WHERE Id = @id",
  };