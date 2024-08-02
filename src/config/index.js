import dotenv from "dotenv"

dotenv.config()

export default {
    baseUrl: process.env.BASE_URL || 'http://localhost',
    port: process.env.PORT || 8000,
    environment: process.env.NODE_ENV || 'development',
    dbUri: process.env.DB_URI || 'mongodb+srv://localhost:27017/recruitment',

    jwtSecret: process.env.JWT_SECRET || '1234',
    development: process.env.NODE_ENV === 'development',
    production: process.env.NODE_ENV === 'production'
}