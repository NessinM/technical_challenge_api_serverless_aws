const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, QueryCommand,
} = require('@aws-sdk/lib-dynamodb');
const createError = require('http-errors');

class DynamoDBService {
  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
    this.tableName = process.env.DYNAMODB_TABLE;
  }

  async create(item) {
    try {
      await this.docClient.send(new PutCommand({
        TableName: this.tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(id)',
      }));
      return item;
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new createError.Conflict(`El item con id ${item.id} ya existe`);
      }
      throw new createError.InternalServerError('Error al crear el item en DynamoDB');
    }
  }

  async getAll() {
    try {
      const result = await this.docClient.send(new ScanCommand({
        TableName: this.tableName,
      }));
      return result.Items;
    } catch (error) {
      throw new createError.InternalServerError('Error al obtener items de DynamoDB');
    }
  }

  async getById(id) {
    try {
      const result = await this.docClient.send(new GetCommand({
        TableName: this.tableName,
        Key: { id },
      }));
      if (!result.Item) {
        throw new createError.NotFound(`No se encontró el item con id ${id}`);
      }
      return result.Item;
    } catch (error) {
      if (error.statusCode === 404) throw error;
      throw new createError.InternalServerError('Error al obtener item de DynamoDB');
    }
  }

  async queryByIndex(indexName, keyName, keyValue) {
    try {
      const result = await this.docClient.send(new QueryCommand({
        TableName: this.tableName,
        IndexName: indexName,
        KeyConditionExpression: '#key = :value',
        ExpressionAttributeNames: {
          '#key': keyName,
        },
        ExpressionAttributeValues: {
          ':value': keyValue,
        },
      }));
      return result.Items;
    } catch (error) {
      throw new createError.InternalServerError('Error al consultar items en DynamoDB');
    }
  }
}

module.exports = new DynamoDBService();
