const formatearRespuesta = (dato) => {
  const traduccion = {
    name: 'nombre',
    height: 'altura',
    mass: 'masa',
    hair_color: 'colorCabello',
    skin_color: 'colorPiel',
    eye_color: 'colorOjos',
    birth_year: 'periodoNacimiento',
    gender: 'genero',
    films: 'peliculas',
    homeworld: 'mundoNatal',
    species: 'especies',
    vehicles: 'vehiculos',
    starships: 'navesEstelares',
    created: 'creado',
    edited: 'editado',
    url: 'enlace',
  };

  return Object.keys(dato).reduce((acc, key) => {
    const traducidoKey = traduccion[key] || key;
    acc[traducidoKey] = dato[key];
    return acc;
  }, {});
};

module.exports = {
  formatearRespuesta,
};
