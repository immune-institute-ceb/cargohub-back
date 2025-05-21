import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  JWT_SECRET: string;
  MONGODB_URI: string;
  EMAIL_USER: string;
  EMAIL_CLIENT_ID: string;
  EMAIL_CLIENT_SECRET: string;
  EMAIL_REFRESH_TOKEN: string;
  REDIRECT_URI: string;
  FRONTEND_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required().default(3000),
    JWT_SECRET: joi.string().required(),
    MONGODB_URI: joi.string().required(),
    EMAIL_USER: joi.string().required(),
    EMAIL_CLIENT_ID: joi.string().required(),
    EMAIL_CLIENT_SECRET: joi.string().required(),
    EMAIL_REFRESH_TOKEN: joi.string().required(),
    REDIRECT_URI: joi.string().required(),
    FRONTEND_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  mongodbUri: envVars.MONGODB_URI,
  emailUser: envVars.EMAIL_USER,
  emailClientId: envVars.EMAIL_CLIENT_ID,
  emailClientSecret: envVars.EMAIL_CLIENT_SECRET,
  emailRefreshToken: envVars.EMAIL_REFRESH_TOKEN,
  redirectUri: envVars.REDIRECT_URI,
  frontendUrl: envVars.FRONTEND_URL,
};
