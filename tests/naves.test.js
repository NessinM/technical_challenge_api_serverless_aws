const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const {
  crearNave, obtenerNaves, obtenerNavePorId, buscarNavesPorFabricante,
} = require('../src/handlers/naves');
const navesService = require('../src/services/naves');

jest.mock('../src/services/naves');
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Handlers de Naves', () => {
  const mockNave = {
    nombre: 'X-wing',
    modelo: 'T-65 X-wing',
    fabricante: 'Incom Corporation',
    costoEnCreditos: 149999,
    longitud: '12.5',
    velocidadMaximaAtmosfera: '1050',
    tripulacion: '1',
    pasajeros: '0',
    capacidadCarga: '110',
    consumibles: '1 week',
    clase: 'Starfighter',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ddbMock.reset();
  });

  describe('crearNave', () => {
    it('debe crear una nave exitosamente', async () => {
      const naveInput = { ...mockNave };
      delete naveInput.id;
      delete naveInput.createdAt;
      delete naveInput.estado;

      navesService.crearNave.mockResolvedValue(mockNave);

      const event = { body: JSON.stringify(naveInput) };
      const response = await crearNave(event);

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual(mockNave);
      expect(navesService.crearNave).toHaveBeenCalledWith(naveInput);
    });

    it('debe manejar errores de validación', async () => {
      const naveInvalida = { nombre: 'X-wing' };
      navesService.crearNave.mockRejectedValue(new Error('Error de validación'));

      const event = { body: JSON.stringify(naveInvalida) };
      const response = await crearNave(event);

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body)).toHaveProperty('error');
    });

    it('debe manejar JSON inválido', async () => {
      const event = { body: 'invalid-json' };
      const response = await crearNave(event);

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body)).toHaveProperty('error');
    });
  });

  describe('obtenerNaves', () => {
    it('debe obtener lista de naves exitosamente', async () => {
      const mockNaves = [mockNave];
      navesService.obtenerNaves.mockResolvedValue(mockNaves);

      const response = await obtenerNaves({});

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ naves: mockNaves });
    });

    it('debe manejar errores al obtener naves', async () => {
      navesService.obtenerNaves.mockRejectedValue(new Error('Error DB'));

      const response = await obtenerNaves({});

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body)).toHaveProperty('error');
    });
  });

  describe('obtenerNavePorId', () => {
    it('debe obtener una nave específica exitosamente', async () => {
      navesService.obtenerNavePorId.mockResolvedValue(mockNave);

      const event = { pathParameters: { id: '123' } };
      const response = await obtenerNavePorId(event);

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual(mockNave);
    });

    it('debe manejar nave no encontrada', async () => {
      navesService.obtenerNavePorId.mockRejectedValue({
        statusCode: 404,
        message: 'Nave no encontrada',
      });

      const event = { pathParameters: { id: 'no-existe' } };
      const response = await obtenerNavePorId(event);

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toHaveProperty('error');
    });
  });

  describe('buscarNavesPorFabricante', () => {
    it('debe buscar naves por fabricante exitosamente', async () => {
      const mockNaves = [mockNave];
      navesService.buscarNavesPorFabricante.mockResolvedValue(mockNaves);

      const event = { queryStringParameters: { fabricante: 'Incom Corporation' } };
      const response = await buscarNavesPorFabricante(event);

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ naves: mockNaves });
    });

    it('debe requerir parámetro fabricante', async () => {
      const event = { queryStringParameters: {} };
      const response = await buscarNavesPorFabricante(event);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toHaveProperty('error');
    });
  });
});
