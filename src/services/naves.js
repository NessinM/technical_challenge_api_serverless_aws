const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');
const dynamoDBService = require('./dynamodb');
const { validarNave } = require('../utils/validaciones');
const { logger } = require('../utils/logger');

class NavesService {
  async crearNave(naveData) {
    try {
      const { error, value } = validarNave(naveData);
      if (error) {
        throw new createError.BadRequest(error.details[0].message);
      }

      const nave = {
        id: uuidv4(),
        ...value,
        creado: new Date().toISOString(),
        editado: new Date().toISOString(),
        estado: 'ACTIVO',
      };

      logger.info('Creando nueva nave', { naveId: nave.id });
      await dynamoDBService.create(nave);
      logger.info('Nave creada exitosamente', { naveId: nave.id });

      return nave;
    } catch (error) {
      logger.error('Error al crear nave', { error: error.message });
      throw error;
    }
  }

  async obtenerNaves() {
    try {
      logger.info('Obteniendo lista de naves');
      const naves = await dynamoDBService.getAll();
      return naves.filter((nave) => nave.estado === 'ACTIVO');
    } catch (error) {
      logger.error('Error al obtener naves', { error: error.message });
      throw error;
    }
  }

  async obtenerNavePorId(id) {
    try {
      logger.info('Obteniendo nave por ID', { naveId: id });
      const nave = await dynamoDBService.getById(id);
      if (nave.estado !== 'ACTIVO') {
        throw new createError.NotFound('Nave no encontrada');
      }
      return nave;
    } catch (error) {
      logger.error('Error al obtener nave por ID', { error: error.message, naveId: id });
      throw error;
    }
  }

  async buscarNavesPorFabricante(fabricante) {
    try {
      logger.info('Buscando naves por fabricante', { fabricante });
      const naves = await dynamoDBService.queryByIndex('FabricanteIndex', 'fabricante', fabricante);
      return naves.filter((nave) => nave.estado === 'ACTIVO');
    } catch (error) {
      logger.error('Error al buscar naves por fabricante', { error: error.message, fabricante });
      throw error;
    }
  }
}

module.exports = new NavesService();
