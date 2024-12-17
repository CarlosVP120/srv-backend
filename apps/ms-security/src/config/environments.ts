import 'dotenv/config';
import * as joi from 'joi';

interface EnvironmentVariables {
  NATS_SERVER: string;
  JWT_SECRET: string;
}

const environmentSchema = joi
  .object({
    NATS_SERVER: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown();

const { error, value } = environmentSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error}`);
}

const environmentVariables: EnvironmentVariables = value;

export const environments = {
  natsServer: environmentVariables.NATS_SERVER,
  jwtSecret: environmentVariables.JWT_SECRET,
};
