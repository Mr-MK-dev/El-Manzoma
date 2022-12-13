let SMB2 = require("smb2");
module.exports = async params => {
  let con = params.con,
    io = params.io,
    activeSockets = params.activeSockets,
    activeSocketsMeta = params.activeSocketsMeta;
  con.on("new-gate-task-notification", ({ task, section }) => {
    let users = activeSocketsMeta
      ? Object.values(activeSocketsMeta)
          .filter(f => f.section == section)
          .map(f => f.userId)
      : [];
    users.forEach(userId => {
      let socket = Object.keys(activeSockets)[
        Object.values(activeSockets).indexOf(userId)
      ];
      io.to(socket).emit("newGateTaskNotification", task);
    });
  });
  con.on("test-smba", dirPath => {
    console.log("Begin");
    let smb2Client = new SMB2({
      share: "\\\\192.9.201.15\\web",
      domain: "nozom-pc",
      username: "segelat",
      password: "NozomHodod21"
    });
    console.log("Created Instance");
    console.log(smb2Client);
    smb2Client.mkdir(dirPath, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Folder created!");
      }
    });
    console.log("Finished");
  });
};
