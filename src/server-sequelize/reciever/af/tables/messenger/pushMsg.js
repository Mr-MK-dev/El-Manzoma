module.exports = async (db, params) => {
  let splitter = params.path ? params.path.split(".") : null,
    msg = await db.MessengerChats.create({
      user1: params.user1,
      user2: params.user2,
      msg: params.msg,
      path: params.path,
      fileSize: params.fileSize,
      type: params.type,
      sender: params.user1,
      date: params.date,
      replyOnId: params.replyOnId ? params.replyOnId : null
    }),
    fixedMsg = JSON.parse(JSON.stringify(msg)),
    replyOn = await db.MessengerChats.findOne({
      where: {
        id: fixedMsg.replyOnId
      }
    }),
    fixedReplyOn = JSON.parse(JSON.stringify(replyOn));
  fixedMsg.MessengerChats = fixedReplyOn;
  return fixedMsg;
};
