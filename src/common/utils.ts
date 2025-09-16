// Parse the MySQL connection string
export function parseConnectionString(connectionString: string) {
  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    username: url.username,
    password: url.password,
    database: url.pathname.substring(1), // Remove leading slash
  };
}
