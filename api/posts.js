import { postgresQuery } from "../src/server/db/db";

async function handlePostList(req, res) {
  console.log("Incoming request:", req.url);

  const posts = await postgresQuery(
    `SELECT p."id", p."title", p."body" from "POST" p WHERE p."user_id" = $1 ORDER BY p."created_at"`,
    [req.user]
  );

  if (posts.rowCount > 0) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: `${posts.rowCount} Posts found.`,
        posts: posts.rows,
      })
    );
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "No POSTS FOUND" }));
  }
}
