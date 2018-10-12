const Joi = require('joi')

module.exports = function useJoi(schema) {
  validate.schema = schema // For Øystein magic
  function validate(req, res, next) {
    var validation = schema
    if(!schema.isJoi) {
      const role = (req.payload && req.payload.role) || 'user'
      validation = Joi.object().keys(schema[role] || schema.common)
    }
    var data = Object.assign({}, req.body, req.query, req.params)
    Joi.validate(data, validation, {stripUnknown: true}, (err, value) => {
      if(err) {
        return res
          .status(422)
          .json({message: err.message})
      }
      req.joi = value
      return next()
    })
  }
  return validate
}
