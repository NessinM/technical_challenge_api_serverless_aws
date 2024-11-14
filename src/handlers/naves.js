const createError = require('http-errors');
const navesService = require('../services/naves');
const { formatResponse, formatError } = require('../utils/responseFormatter');

const crearNave = async (event) => {
  try {
    const naveData = JSON.parse(event.body);
    const nave = await navesService.crearNave(naveData);
    return formatResponse(201, nave);
  } catch (message) {
    return formatError(message);
  }
};

const obtenerNaves = async () => {
  try {
    const naves = await navesService.obtenerNaves();
    return formatResponse(200, { naves });
  } catch (error) {
    return formatError(error);
  }
};

const obtenerNavePorId = async (event) => {
  try {
    const { id } = event.pathParameters;
    const nave = await navesService.obtenerNavePorId(id);
    return formatResponse(200, nave);
  } catch (error) {
    return formatError(error);
  }
};

const buscarNavesPorFabricante = async (event) => {
  try {
    const { fabricante } = event.queryStringParameters || {};
    if (!fabricante) {
      throw new createError.BadRequest('El parámetro fabricante es requerido');
    }
    const naves = await navesService.buscarNavesPorFabricante(fabricante);
    return formatResponse(200, { naves });
  } catch (error) {
    return formatError(error);
  }
};

module.exports = {
  crearNave,
  obtenerNaves,
  obtenerNavePorId,
  buscarNavesPorFabricante,
};
