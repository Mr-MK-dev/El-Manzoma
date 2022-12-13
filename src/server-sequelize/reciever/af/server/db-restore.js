module.exports = async (db, params) => {
  record = await db.sequelize.query(
    `
      use master;
      RESTORE DATABASE [${params.dbname}] FROM DISK = '${params.dbpath}' WITH REPLACE, RECOVERY;

      `
  );
  return record;
};
