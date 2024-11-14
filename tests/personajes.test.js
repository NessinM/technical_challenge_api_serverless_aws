const {
  obtenerPersonajes,
  obtenerPersonajesPorNumeroDePagina,
  buscarPersonajesPorNombre,
} = require('../src/handlers/personajes');
const swapiService = require('../src/services/swapi');

jest.mock('../src/services/swapi');

describe('Personajes Service', () => {
  describe('obtenerPersonajes', () => {
    it('debería retornar una lista de personajes', async () => {
      const mockPersonajes = [
        { name: 'Luke Skywalker' },
        { name: 'Darth Vader' },
      ];

      await swapiService.getPersonajes.mockResolvedValue(mockPersonajes);

      const result = await obtenerPersonajes();
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body).toEqual(mockPersonajes);
    });

    it('debería manejar errores correctamente', async () => {
      const errorMessage = 'Error de servicio';

      await swapiService.getPersonajes.mockRejectedValue(
        new Error(errorMessage),
      );

      const result = await obtenerPersonajes();
      const body = JSON.parse(result.body);
      expect(result.statusCode).toBe(500);
      expect(body.error.message).toBe(errorMessage);
    });
  });

  describe('obtenerPersonajesPorNumeroDePagina', () => {
    it('debería retornar personajes por número de página', async () => {
      const mockPersonajes = [{ name: 'Yoda' }];
      const page = 2;

      await swapiService.getPersonajesPorPagina.mockResolvedValue(
        mockPersonajes,
      );
      const event = { pathParameters: { page } };

      const result = await obtenerPersonajesPorNumeroDePagina(event);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body).toEqual(mockPersonajes);
    });

    it('debería manejar el error si falta el parámetro de página', async () => {
      const event = { pathParameters: {} };

      const result = await obtenerPersonajesPorNumeroDePagina(event);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(400);
      expect(body.error.message).toBe('El parámetro pagina es requerido');
    });

    it('debería manejar errores del servicio', async () => {
      const errorMessage = 'Error al obtener personajes por página';

      await swapiService.getPersonajesPorPagina.mockRejectedValue(
        new Error(errorMessage),
      );
      const event = { pathParameters: { page: 1 } };

      const result = await obtenerPersonajesPorNumeroDePagina(event);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(500);
      expect(body.error.message).toBe(errorMessage);
    });
  });

  describe('buscarPersonajesPorNombre', () => {
    it('debería retornar personajes por nombre', async () => {
      const mockPersonajes = [{ name: 'Han Solo' }];
      const name = 'Han Solo';

      await swapiService.buscarPersonajes.mockResolvedValue(mockPersonajes);
      const event = { pathParameters: { name } };

      const result = await buscarPersonajesPorNombre(event);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body).toEqual(mockPersonajes);
    });

    it('debería manejar el error si falta el parámetro de nombre', async () => {
      const event = { pathParameters: {} };

      const result = await buscarPersonajesPorNombre(event);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(400);
      expect(body.error.message).toBe('El parámetro nombre es requerido');
    });

    it('debería manejar errores del servicio', async () => {
      const errorMessage = 'Error al buscar personajes';

      await swapiService.buscarPersonajes.mockRejectedValue(
        new Error(errorMessage),
      );
      const event = { pathParameters: { name: 'Luke' } };

      const result = await buscarPersonajesPorNombre(event);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(500);
      expect(body.error.message).toBe(errorMessage);
    });
  });
});
