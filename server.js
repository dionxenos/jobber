const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { urlencoded } = require("express");
const cookieParser = require("cookie-parser")

const PORT = process.env.PORT || 3000;

// Database
const sql = require("./config/db");

// Test DB
sql.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

// Middleware
const app = express();

// Cookie-Parser
app.use(cookieParser());

// Static folder ----------------------------
app.use(express.static("./client/public/"));

app.use(urlencoded({extended: true})); 
app.use(cors({
    origin: `http://localhost:${PORT}`,
    credentials: true
}));
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

// View engine -------------------------------
app.set("view engine", "ejs");
app.set("views", "./client");

// Home page -----------------------------------
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.get("/test", (req, res) => {
    res.send("SKRRR");
})
// -----------------------------------------

// Routes
app.use("/users", require("./routes/users"));
app.use("/skills", require("./routes/skills"));
app.use("/languages", require("./routes/languages"));
app.use("/education", require("./routes/education"));
app.use("/api/userskills", require("./routes/userskills"));
app.use("/api/userlanguages", require("./routes/userlanguages"));
app.use("/api/usereducation", require("./routes/usereducation"));

app.use("/jobs", require("./routes/jobs"));

// Server port and start

app.listen(PORT, console.log(`Server started on port ${PORT}`));