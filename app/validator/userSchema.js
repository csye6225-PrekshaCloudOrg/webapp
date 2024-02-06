const Ajv = require('ajv');
const craete_user = require('./createUser.json');
const update_user = require('./updateUser.json');
const ajv = new Ajv();

const createUserJson = ajv.compile(craete_user);
const updateUserJson = ajv.compile(update_user);

const create_user_validator = (req,res,next) => {
  const contentType = req.headers['content-type'];
    if (contentType && contentType !== 'application/json') {
        return res.status(400).send('Content-Type must be application/json');
    }
    if (Object.keys(req.query).length > 0) {
        return res.status(400).send('Query parameters are not allowed');
    }
  const valid = createUserJson(req.body);
    if (!valid) {
        return res.status(400).json({ errors: createUserJson.errors });
    }
    next();
}

const update_user_validator = (req,res,next) => {
  const contentType = req.headers['content-type'];
    if (contentType && contentType !== 'application/json') {
        return res.status(400).send('Content-Type must be application/json');
    }
    if (Object.keys(req.query).length > 0) {
        return res.status(400).send('Query parameters are not allowed');
    }
  const valid = updateUserJson(req.body);
    if (!valid) {
        return res.status(400).json({ errors: updateUserJson.errors });
    }
    next();
}

module.exports = {create_user_validator, update_user_validator};
