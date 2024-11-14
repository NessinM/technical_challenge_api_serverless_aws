const axios = require('axios');
const createError = require('http-errors');
const { formatearRespuesta } = require('../utils/formatearRespuesta');

class SWAPIService {
  constructor() {
    this.baseURL = 'https://swapi.py4e.com/api';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 5000,
    });
  }

  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          throw new createError.NotFound(data.detail || 'Recurso no encontrado en SWAPI');
        } else if (status >= 400 && status < 500) {
          throw new createError.BadRequest(data.detail || 'Error en la solicitud a SWAPI');
        } else if (status >= 500) {
          throw new createError.InternalServerError('Error en el servidor de SWAPI');
        }
      }

      if (error.code === 'ECONNABORTED') {
        throw new createError.RequestTimeout('Tiempo de espera agotado');
      }

      throw new createError.InternalServerError('Error al conectar con SWAPI');
    }
  }

  async getPersonajes() {
    const data = await this.get('/people/');
    return {
      personajes: data.results.map(formatearRespuesta),
      total: data.count,
      siguiente: data.next,
      anterior: data.previous,
    };
  }

  async getPersonajesPorPagina(page = 1) {
    const data = await this.get('/people/', { page });
    return {
      personajes: data.results.map(formatearRespuesta),
      total: data.count,
      siguiente: data.next,
      anterior: data.previous,
    };
  }

  async buscarPersonajes(query) {
    const data = await this.get('/people/', { search: query });
    return {
      personajes: data.results.map(formatearRespuesta),
      total: data.count,
    };
  }
}

module.exports = new SWAPIService();
