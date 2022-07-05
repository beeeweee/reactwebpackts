const dotEnv  = require("dotenv");

if (process.env.NODE_ENV !== 'prod') {
    const configFile =  `./.env.${process.env.NODE_ENV}`;
    dotEnv.config({ path:  configFile });
} else {
    dotEnv.config();
}

module.exports = {

    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET
}
 