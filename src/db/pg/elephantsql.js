const {Client} = require('pg');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');
//SCHEMA: 'supply_management',
const pgClient = new Client({
    host: config.pgConfig.HOST,
    port: config.pgConfig.PORT,
    database: config.pgConfig.DATABASE,
    user: config.pgConfig.USER,
    password: config.pgConfig.PASSWORD,
  })


module.exports = {
    connectDB: async () => {
        pgClient.connect((err) => {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            console.log("Connected to ElephantSql Successfully");
        });
    },
    closeDB: async () => {
        pgClient.end();
    },
    executeScripts: async () => {
        const filePath = path.join(__dirname, 'pgSchema.sql')
        const dataSql = fs.readFileSync(filePath).toString();
        try {
            await pgClient.query('BEGIN')
            await pgClient.query(dataSql)
            await pgClient.query('COMMIT')
            console.log('Scripts Executed Successfully');
        } catch (e) {
            await pgClient.query('ROLLBACK')
            console.log('Scripts Execution Failed');
            console.error('Error:', e);
        }
    },
    testConnection: async () => {
        return new Promise((resolve, reject) => {
            pgClient.query('SELECT NOW() AS "theTime"', (err, result) => {
                if (err) {
                    console.error('error running query', err);
                    reject(err);
                }
                console.log(result?.rows[0]?.theTime);
                resolve(result);
            });
        })
    },
    findOne: async (query) => {
        return new Promise((resolve, reject) => {
            pgClient.query(query, (err, result) => {
                if (err) {
                    console.error('error running query', err);
                    reject(err);
                }
                let data = result?.rows
                resolve(data && data.length > 0 ? data[0] : null);
            });
        })
    }, pgClient: () => pgClient,

}