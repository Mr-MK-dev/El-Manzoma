module.exports = async params => {
  let con = params.con,
    io = params.io,
    { promises: fs } = require("fs");
  con.on("getMicrofilm", x => {
    let root_path = `//192.9.201.222/f1/افلام/`,
      deep = 5,
      paths = [[root_path]],
      canceled = false,
      // pathCounter = 1,
      // intVal = null,
      searchFunction = function(i) {
        if (i <= deep) {
          try {
            if (paths && paths[i] && paths[i].length > 0) {
              let new_paths = paths[i];
              new_paths.forEach(async path => {
                // console.log("Search Path: " + pathCounter);
                // pathCounter++;
                let entries = await fs.readdir(path, {
                    withFileTypes: true
                  }),
                  folders = entries.filter(folder => folder.isDirectory()),
                  imgs = entries.filter(
                    file =>
                      !file.isDirectory() &&
                      file.name.includes(x.militaryId) &&
                      (file.name.includes(".jpg") ||
                        file.name.includes(".JPG") ||
                        file.name.includes(".JPEG") ||
                        file.name.includes(".jpeg") ||
                        file.name.includes(".png") ||
                        file.name.includes(".PNG"))
                  );
                if (folders.length > 0) {
                  paths[i + 1] = [];
                  folders.forEach(folder => {
                    paths[i + 1].push(`${path}/${folder.name}`);
                  });
                  searchFunction(i + 1);
                }
                if (imgs && imgs.length > 0) {
                  io.to(con.id).emit("gotMicrofilm", {
                    item: {
                      path,
                      imgs: imgs.map(img => img.name)
                    },
                    error: null
                  });
                }
              });
            }
          } catch (error) {
            io.to(con.id).emit("gotMicrofilm", {
              item: null,
              error
            });
          }
        } else {
          if (!canceled) {
            canceled = true;
            console.log("Canceled");
            io.to(con.id).emit("waitFinishMicrofilm", true);
            // intVal = null;
            // intVal = setInterval(() => {
            //   io.to(con.id).emit("finishMicrofilm", true);
            //   console.log("Asked To Cancel");
            //   clearInterval(intVal);
            // }, 15000);
          }
        }
      };
    canceled = false;
    // intVal = null;
    searchFunction(0);
  });
};
