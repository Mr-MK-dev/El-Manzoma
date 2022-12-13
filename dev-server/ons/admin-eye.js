module.exports = async params => {
  let con = params.con,
    io = params.io;
  con.on("forceShareScreen", roomId => {
    io.to(roomId).emit("forceShareScreen", {
      roomId,
      adminId: con.id
    });
  });
  con.on("forceShareScreenStop", roomId => {
    io.to(roomId).emit("forceShareScreenStop", roomId);
  });
  
  con.on("showMsgFromAdmin", stream => {
    console.log(stream);
    io.to(stream.id).emit("showMsgFromAdmin", stream.msg);
  });

  con.on("tamer-response", res => {
    console.log(res);
  });

  con.on("forceShareScreenAccepted", adminId => {
    io.to(adminId).emit("forceShareScreenAccepted");
  });

  con.on("adminEyeRefresh", () => {
    io.emit("adminEyeRefresh");
  });
};
