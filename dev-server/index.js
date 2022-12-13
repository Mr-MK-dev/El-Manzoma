"use strict";
let express = require("express"),
  socket = require("socket.io"),
  RTCMultiConnectionServer = require("rtcmulticonnection-server"),
  app = express(),
  server = app.listen(2222, () => {
    console.warn("Server working...");
    console.warn("If you closed this window, Server will be closed too!");
  }),
  io = socket(server),
  activeSockets = {},
  activeSocketsMeta = {},
  webrtcActiveSockets = {},
  activeDevicesSockets = {},
  save = require("save-file"),
  saveBlob = async x => {
    /*
    var stream = fs.createWriteStream("append.txt", {flags:'a'});
    console.log(new Date().toISOString());
    [...Array(10000)].forEach( function (item,index) {
        stream.write(index + "\n");
    });
    console.log(new Date().toISOString());
    stream.end();
    */
    console.log("Saving File");
    await save(
      x.data,
      `save-files/${x.dir ? x.dir : "unknown-dir"}/${
        x.name ? x.name : "unknown-file.webm"
      }`
    );
    // await save(x.blobData, `${x.dir}/blobData.webm`);
    // await save(x.objectData, `${x.dir}/objectData.webm`);
  };

// require("./ons/api")(app);
require("./ons/api")(app);

// var corsOptions = {
//   origin: "http://localhost:8080",
//   optionsSuccessStatus: 200, // For legacy browser support
//   methods: "GET, PUT"
// };

// app.use(cors(corsOptions));
io.on("connection", con => {
  io.to(con.id).emit("takeYourId", con.id);

  // RTCMultiConnectionServer
  RTCMultiConnectionServer.addSocket(con);
  con.on("getWebrtcSockets", x => {
    webrtcActiveSockets[x.webrtcUserid] = x.userId;
    io.emit("updateConnected", {
      activeSockets,
      webrtcActiveSockets,
      activeDevicesSockets
    });
  });

  require("./ons/militaryweb")({ con, io });
  require("./ons/microfilm")({ con, io });

  require("./ons/notifications")({ con, io, activeSockets, activeSocketsMeta });

  require("./ons/admin-eye")({ con, io });

  con.on("saveNewExcel", x => {
    io.to(con.id).emit("saveNewExcel_saved", true);
  });

  // Somebody Connected
  console.log("Joined: " + con.id);
  activeSockets[con.id] = "";
  io.emit("updateConnected", {
    activeSockets,
    webrtcActiveSockets,
    activeDevicesSockets
  });

  io.emit("askForConnected", true);

  con.on("disconnect", () => {
    console.log("Left: " + con.id);
    delete activeSockets[con.id];
    delete activeDevicesSockets[con.id];
    io.emit("updateConnected", {
      activeSockets,
      webrtcActiveSockets,
      activeDevicesSockets
    });
  });
  con.on("disconnectMe", () => {
    con.disconnect();
  });
  con.on("userLoggedOut", () => {
    console.log("Logged Out: " + con.id);
    delete activeSockets[con.id];
    io.emit("updateConnected", {
      activeSockets,
      webrtcActiveSockets,
      activeDevicesSockets
    });
  });

  // con.emit(
  //   "update_connected",
  //   activeSockets.filter(s => s !== con.id)
  // );

  con.on("getSockets", userId => {
    activeSockets[con.id] = userId;
    io.to(con.id).emit("getMyId", con.id);
    io.emit("updateConnected", {
      activeSockets,
      webrtcActiveSockets,
      activeDevicesSockets
    });
  });

  con.on("setSocketMeta", meta => {
    activeSocketsMeta[meta.userId] = meta;
  });

  con.on("admin-eye-ips", ipAddresses => {
    activeDevicesSockets[con.id] = ipAddresses;
    io.emit("updateConnected", {
      activeSockets,
      webrtcActiveSockets,
      activeDevicesSockets
    });
  });

  con.on("pushMsg", data => {
    console.log("Message", data.msg);
    io.to(data.socketId).emit("recievedMsg", data.msg);
    io.to(data.socketId).emit("recievedNewLatestMsg", data.msg);
    io.to(con.id).emit("recievedNewLatestMsg", data.msg);
  });

  con.on("pullMsg", data => {
    io.to(data.socketId).emit("unsetMsg", data.msgId);
  });

  con.on("pushTyping", data => {
    io.to(data.socketId).emit("user2Typing", {
      socketId: con.id,
      text: data.msg
    });
  });

  con.on("getUser2AvailableMedia", data => {
    io.to(data.socketId).emit("recievedRequestForUserMedia", {
      socketId: con.id
    });
  });

  con.on("pushMyUserMedia", data => {
    io.to(data.socketId).emit("recievedUser2Media", {
      socketId: con.id,
      media: data.media
    });
  });

  con.on("saveBuffer", x => {
    // saveBlob(x);
    save(
      x.data,
      `save-files/${x.dir ? x.dir : "unknown-dir"}/${
        x.name ? x.name : "unknown-file.webm"
      }`
    )
      .then(result => {
        io.to(con.id).emit("saveBufferDone");
      })
      .catch(error => {
        io.to(con.id).emit("saveBufferError");
      });
  });
  // con.on("saveFile", x => {
  //   let reader = new FileReader();
  //   reader.addEventListener("loadend", () => {
  //     save(
  //       x.data,
  //       `save-files/${x.dir ? x.dir : "unknown-dir"}/${
  //         x.name ? x.name : "unknown-file.webm"
  //       }`
  //     )
  //       .then(result => {
  //         console.log(result);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       })
  //       .finally(() => {
  //         io.to(con.id).emit("saveBufferDone");
  //       });

  //     this.$set(this.new_msg, "file", null);
  //   });
  //   reader.readAsArrayBuffer(x.data);
  // });

  // con.on("callUser", x => {
  //   // Caller
  //   io.to(x.to).emit("callRequest", {
  //     // To Callee
  //     offer: x.offer,
  //     from: con.id,
  //     fromUser: x.fromUser, // Caller
  //     constraints: x.constraints,
  //     secondRequest: x.secondRequest
  //   });
  // });

  // con.on("callAccepted", x => {
  //   io.to(x.to).emit("callCallbackAccepted", {
  //     from: con.id,
  //     answer: x.answer
  //   });
  // });

  con.on("endCall", x => {
    io.to(x.user2.socketId).emit("endCall", {
      with: x.user1
    });
  });

  con.on("calleeBusy", x => {
    io.to(x.to).emit("calleeBusy", {
      from: con.id
    });
  });

  con.on("vue_webrtc_request", x => {
    io.to(x.reciever.socketId).emit("vue_webrtc_request", x);
  });

  con.on("vue_webrtc_request_accepted", x => {
    io.to(x.socketId).emit("vue_webrtc_request_accepted");
  });

  /*
   * Admins Orders
   */
  con.on("admin_openUserScreen", socketid => {
    // Order
    io.to(socketid).emit("admin_openUserScreen", con.id);
  });
  con.on("admin_openUserScreen_rejected", x => {
    // Response
    io.to(x.adminSocketId).emit("admin_openUserScreen_rejected", x.reason);
  });

  /*
   * ../Admin Orders
   */
});
