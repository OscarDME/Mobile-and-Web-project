import sql from 'mssql';

const config = {
    user: 'FHAdmin', // better stored in an app setting such as process.env.DB_USER
    password: '4rXzVfK5vBSNp5M', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'fithubmx.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'FitHubDB', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}


export const getConnection = async () => {
    try {
      const pool = await sql.connect(config);
      console.log("Conexion realizada exitosamente");
      return pool;
    } catch (error) {
      console.error(error);
    }
  };
  
export { sql };