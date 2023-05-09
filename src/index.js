import fs from 'node:fs/promises';

const isFileExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

const getWeatherData = async (lat, lon, mode, city) => {
  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  const appid = process.env.API_KEY ?? '';
  let params;
  if (city) {
    params = new URLSearchParams({
      q: city,
      mode,
      appid,
    });
  } else {
    params = new URLSearchParams({
      lat,
      lon,
      mode,
      appid,
    });
  }
  url.search = params.toString();
  const response = await fetch(url);
  return response.text();
};

export default async (options) => {
  const {
    lat, lon, mode, output, force, city,
  } = options;

  const weather = await getWeatherData(lat, lon, mode, city);

  if (output) {
    if (!force && await isFileExists(output)) {
      throw new Error(`File ${output} already exists`);
    }
    await fs.writeFile(output, weather);
  } else {
    console.log(weather);
  }

  console.log(lat, lon, mode, output, force);
};
