const Joi = require('joi');

const esquemaNave = Joi.object({
  nombre: Joi.string().required(),
  modelo: Joi.string().required(),
  fabricante: Joi.string().required(),
  costoEnCreditos: Joi.number().required(),
  longitud: Joi.string().required(),
  velocidadMaximaAtmosfera: Joi.string().required(),
  tripulacion: Joi.string().required(),
  pasajeros: Joi.string().required(),
  capacidadCarga: Joi.string().required(),
  consumibles: Joi.string().required(),
  clase: Joi.string().required(),
});

const validarNave = (nave) => esquemaNave.validate(nave);

module.exports = {
  validarNave,
};
