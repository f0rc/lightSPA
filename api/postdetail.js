import { postgresQuery } from "../src/server/db/db";

async function handleDetailPost(req, res, id) {
  console.log("DEATIL POST", req.url, id);

  const post = await postgresQuery(
    `SELECT * FROM "POST" p WHERE id = $1 AND p."user_id" = $2;`,
    [id, req.user]
  );

  console.log(post.rows[0]);
  console.log(req.user);
  console.log(id);

  if (post.rowCount > 0) {
    console.log("FOUND POST");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "POST FOUND",
        code: "SUCCESS",
        post: post.rows[0],
      })
    );
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "POST NOT FOUND", code: "FAIL" }));
  }
}
