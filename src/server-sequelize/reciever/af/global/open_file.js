const fs = require("fs");
module.exports = async (db, params) => {
    require('child_process').exec(`${params.path}`);
};
