const formatResponse = (statusCode, data) => ({
  statusCode,
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
});

const formatError = (error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';

  return formatResponse(statusCode, {
    error: {
      message,
      code: error.code,
      ...(process.env.STAGE === 'dev' && { stack: error.stack }),
    },
  });
};

module.exports = {
  formatResponse,
  formatError,
};
