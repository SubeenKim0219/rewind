const express = require("express");
const data = require("./data.js");
const multer = require("multer");
const path = require("path");

const app = express();

app.set("views", "templates");
app.set("view engine", "pug");

app.use("/css", express.static("resources/css"));
app.use("/images", express.static("resources/images"));
app.use("/js", express.static("resources/js"));
app.use("/uploads", express.static("resources/uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, path.join(__dirname, "resources", "uploads"));
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      done(null, `${base}-${Date.now()}${ext}`);
    },
  }),
});

//GET
app.get("/", (req, res) => {
  res.redirect("/main");
});

app.get("/main", async (req, res) => {
  const query = (req.query.query || "").toLowerCase();
  const list = Number(req.query.list) || 1;
  const limit = 6;
  const offset = (list - 1) * limit;

  const result = await data.getPosts(query, offset, limit);
  res.render("main", {
    result,
    query,
    list,
    limit,
  });
});

app.get("/post_list", async (req, res) => {
  const query = (req.query.query || "").toLowerCase();
  const list = Number(req.query.list) || 1;
  const limit = 6;
  const offset = (list - 1) * limit;

  const result = await data.getPosts(query, offset, limit);
  res.render("post_list", {
    result,
    query,
    list,
    limit,
  });
});

app.get("/post/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).render("404");
  }
  const post = await data.getPost(id);
  if (!post) return res.status(404).render("404");
  const posts = await data.getPosts("", 0, 1000);

  const index = posts.findIndex((p) => Number(p.id) === id);
  const prev = index > 0 ? posts[index - 1] : null;
  const next = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;
  const comments = await data.getComment(id);
  res.render("render_post", { post, comments, prev, next });
});

app.get("/create", (req, res) => {
  res.render("add_post");
});

app.get("/update_post/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).render("404");
  }
  const post = await data.getPost(id);
  if (!post) return res.status(404).render("404");
  res.render("update_post", { post });
});

//POST
app.post("/api/post", upload.single("image"), async (req, res) => {
  const params = req.body;
  const imagePath = req.file ? "/uploads/" + req.file.filename : null;
  const result = await data.addPost({ ...params, image_path: imagePath });
  if (!result) {
    return res.status(400).send({
      status: "error",
      errors: ["Failed to add post"],
    });
  }
  res.redirect(`/post/${result}`);
});

app.post("/api/comment", async (req, res) => {
  const params = req.body;

  const result = await data.addComment(params);
  if (!result) {
    return res.status(400).send({
      status: "error",
      errors: ["Failed to add post"],
    });
  }
  res.redirect(`/post/${params.post_id}`);
});

app.post("/api/delete_post", async (req, res) => {
  const params = req.body;

  if (!("id" in params) || !String(params.id)) {
    return res.status(400).send({
      status: "error",
      errors: ["Invalid Info"],
    });
  }

  const id = req.body.id;
  await data.deletePost(id);
  return res.redirect("/main");
});

app.post("/api/delete_comment", async (req, res) => {
  const params = req.body;

  if (!("id" in params) || !String(params.id)) {
    return res.status(400).send({
      status: "error",
      errors: ["Invalid Info"],
    });
  }

  const id = req.body.id;
  await data.deleteComment(id);
  return res.redirect(`/post/${params.post_id}`);
});

app.post("/update_post", async (req, res) => {
  const params = req.body;
  const result = await data.updatePost(params.id, params.title, params.content);

  if (!result) {
    return res.status(400).render("404");
  }

  return res.status(201).redirect("/post/" + params.id);
});

app.post("/update_comment", async (req, res) => {
  const params = req.body;
  const result = await data.updateComment(params.id, params.content);

  if (!result) {
    return res.status(400).render("404");
  }

  return res.status(201).redirect("/post/" + params.id);
});

app.use((req, res) => {
  res.status(404).render("404");
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
