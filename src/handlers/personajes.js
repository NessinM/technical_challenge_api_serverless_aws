const createError = require('http-errors');
const swapiService = require('../services/swapi');
const { formatResponse, formatError } = require('../utils/responseFormatter');
const { logger } = require('../utils/logger');

const obtenerPersonajes = async () => {
  try {
    logger.info('Obteniendo personajes');
    const resultado = await swapiService.getPersonajes();
    return formatResponse(200, resultado);
  } catch (error) {
    logger.error('Error al obtener personajes', { error: error.message });
    return formatError(error);
  }
};

const obtenerPersonajesPorNumeroDePagina = async (event) => {
  try {
    const { page } = event.pathParameters;
    logger.info('Obteniendo personajes por numero de pagina', page);

    if (!page) {
      throw new createError.BadRequest('El parámetro pagina es requerido');
    }
    const resultado = await swapiService.getPersonajesPorPagina(page);

    return formatResponse(200, resultado);
  } catch (error) {
    logger.error('Error al obtener personajes', { error: error.message });
    return formatError(error);
  }
};

const buscarPersonajesPorNombre = async (event) => {
  try {
    const { name } = event.pathParameters;
    logger.info('Obteniendo personajes por nombre de personaje', name);

    if (!name) {
      throw new createError.BadRequest('El parámetro nombre es requerido');
    }
    const resultado = await swapiService.buscarPersonajes(name);

    return formatResponse(200, resultado);
  } catch (error) {
    logger.error('Error al obtener personajes', { error: error.message });
    return formatError(error);
  }
};

module.exports = {
  obtenerPersonajes,
  obtenerPersonajesPorNumeroDePagina,
  buscarPersonajesPorNombre,
};
