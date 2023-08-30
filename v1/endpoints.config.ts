require("dotenv").config();

export default {
    KEY_JWT: process.env.KEY_JWT ?? '',
    PRODUCTION_MODE: process.env.PRODUCTION_MODE ?? '',
    DB_LINK: process.env.DB_LINK ?? '',
}