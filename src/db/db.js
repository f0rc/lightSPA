import postgres from "pg";

const pool = new postgres.Pool({
  host: process.env.DBHOST || "localhost",
  port: process.env.DBPORT || 4444,
  user: process.env.DBUSER || "test",
  password: process.env.PASSWORD || "test",
  database: process.env.DBNAME || "test",
  max: 20,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
  ssl: true,
});

/**
 *
 * @param {String} text - The Text of the Query to be Executed (SQL CODE).
 * @param {String} params - The Parameters to be Passed with the Query. ie $1 $2, etc..
 *
 * credit: https://node-postgres.com/guides/project-structure#example
 * @example
 * postgresQuery(`SELECT * FROM "User"`, [])
  .then((res) => {
    console.table(res.rows);
  })
  .catch((err) => {
    console.log(err);
  });
 * 
 * @returns Promise of postgres query result
 */
export const postgresQuery = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed,  query", {
    text,
    duration,
    rows: res.rowCount,
    // commandORSomething: res.command,
  });
  return { rows: res.rows, rowCount: res.rowCount };
};

// export default {
//   async query(text: string, params: any[]) {
//     const start = Date.now();
//     const res = await pool.query(text, params);
//     const duration = Date.now() - start;
//     console.log("executed query", { text, duration, rows: res.rowCount });
//     return res;
//   },
// };
