import Ajv from 'ajv';

const ajv = new Ajv();

const IResult = {
  result: 'boolean',
  response: 'object',
  error: 'string'
};
export const validateIResult = (data) => {
  const validate = ajv.compile(IResult);
  const valid = validate(data);
  if (!valid) console.log(validate.errors);
  return valid ? true : false;
};

export const validateObject = (data) => {
  return typeof data == 'object' ? true : false;
};

export const validateArray = (data) => {
  return Array.isArray(data);
};

export const validateString = (data) =>
  typeof data == 'string' ? true : false;
