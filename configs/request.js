import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()

const MAX_REQUEST_BODY_SIZE = process.env.MAX_REQUEST_BODY_SIZE;

export { MAX_REQUEST_BODY_SIZE }
