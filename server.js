require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.get("/", (req, res) => {
  res.status(200).json({ message: "mantap" });
});

const auth = require("./routes/auth");
const users = require("./routes/users");
const godevs = require("./routes/godevs");
const apps = require("./routes/applicatios");
const musics = require("./routes/musics");
const artists = require("./routes/artists");
const lyrics = require("./routes/lyrics");
const backup = require("./routes/backups");
const utils = require("./routes/utils");
const restore = require("./routes/restore");
const ytScrapper = require("./utils/scrapeYoutube/app");
const googlePlayScraper = require("./routes/googlePlayScraper");
const coba = require("./routes/coba");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

app.set("trust proxy", true);

//set secret
app.set("Secret", process.env.API_KEY);

app.use(cors());

// use morgan to log requests to the console
app.use(morgan("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.enable("trust proxy");

app.use("/auth", auth);
// app.use("/api/*", lyrics.isAvailable);
app.use("/api/users", users);
app.use("/api/godevs", godevs);
app.use("/api/apps", apps);
app.use("/api/musics", musics);
app.use("/api/artists", artists);
app.use("/yt-scrapper", ytScrapper);
app.use("/backup", backup);
app.use("/utils", utils);
app.use("/gp", googlePlayScraper);
app.use("/coba", coba);
app.use("/rahasia/kue", users);
app.use("/restore", restore);

// load public asset
app.use(express.static("public"));

// Deployment Configurations
if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"), {
      removeAttributeQuotes: true,
    });
  });
}

app.listen(port, () => console.log(`Server started on port ${port}!`));
