const mysql = require("mysql2/promise");
require("dotenv").config();

var connPool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  database: process.env.MYSQLDATABASE,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT || 3306,
});

async function addPost(data) {
  let ct = null;
  try {
    ct = await connPool.getConnection();

    let value = await ct.execute(
      "insert into Posts(user_id, title, content, image_path) values (?, ?, ?, ?)",
      [data.user_id, data.title, data.content, data.image_path]
    );
    return value[0].insertId;
  } catch (error) {
    console.log("addPost error:", error.code, error.sqlMessage);
    return null;
  } finally {
    if (ct) {
      ct.release();
    }
  }
}

async function getPost(postId) {
  let ct = null;
  try {
    ct = await connPool.getConnection();
    let [value] = await ct.execute("select * from Posts where id = ?;", [
      postId,
    ]);
    return value[0] || null;
  } catch (error) {
    console.log(error);
  } finally {
    if (ct) {
      ct.release();
    }
  }
}

async function getPosts(query, offset, limit) {
  let ct = null;
  try {
    ct = await connPool.getConnection();
    const filter = `%${query}%`;
    let params = [filter];

    let val = `select * from Posts where lower(title) like lower(?) order by id DESC limit ${Number(
      offset
    )}, ${Number(limit)}`;
    const [value] = await ct.execute(val, params);

    return value;
  } catch (error) {
    console.log(error);
    return [];
  } finally {
    if (ct) {
      ct.release();
    }
  }
}

async function updatePost(id, title, content) {
  let ct = null;
  try {
    ct = await connPool.getConnection();
    let [value] = await ct.execute(
      "update Posts set title = ?, content = ? where id = ?;",
      [title, content, id]
    );

    return true;
  } catch (error) {
    console.log(error);
  } finally {
    if (ct) {
      ct.release();
    }
  }
}

async function deletePost(id) {
  let ct = null;
  try {
    ct = await connPool.getConnection();
    let [value] = await ct.execute("DELETE FROM Posts where id = ?;", [id]);
    return true;
  } catch (error) {
    console.log(error);
  } finally {
    if (ct) {
      ct.release();
    }
  }
}

async function addComment(data) {
  let ct = null;
  try {
    ct = await connPool.getConnection();

    let value = await ct.execute(
      "insert into Comments(user_id, post_id, content) values (?, ?, ?)",
      [data.user_id, data.post_id, data.content]
    );
    return value[0].insertId;
  } catch (error) {
    console.log(error);
  } finally {
    if (ct) {
      ct.release();
    }
  }
}

async function getComment(id) {
  let ct = null;
  try {
    ct = await connPool.getConnection();
    let [value] = await ct.execute(
      "select * from Comments where post_id = ? order by created_time ASC;",
      [id]
    );
    return value;
  } catch (error) {
    console.log(error);
  } finally {
    if (ct) {
      ct.release();
    }
  }
}

async function updateComment(id, content) {
  let ct = null;
  try {
    ct = await connPool.getConnection();
    let [value] = await ct.execute(
      "update Comments set content = ? where id = ?;",
      [content, id]
    );
    return true;
  } catch (error) {
    console.log(error);
  } finally {
    if (ct) {
      ct.release();
    }
  }
}

async function deleteComment(id) {
  let ct = null;
  try {
    ct = await connPool.getConnection();
    let [value] = await ct.execute("DELETE FROM Comments where id = ?;", [id]);
    return true;
  } catch (error) {
    console.log(error);
  } finally {
    if (ct) {
      ct.release();
    }
  }
}

module.exports = {
  getPost,
  addPost,
  getPosts,
  updatePost,
  deletePost,
  addComment,
  getComment,
  updateComment,
  deleteComment,
};
