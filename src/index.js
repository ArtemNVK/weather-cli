import fs from 'node:fs/promises';
import inquirer from 'inquirer';

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

const saveResults = async (output, force, result) => {
  if (output) {
    if (!force && await isFileExists(output)) {
      throw new Error(`File ${output} already exists`);
    }
    await fs.writeFile(output, result);
  } else {
    console.log(result);
  }
};

export default async (options) => {
  const {
    lat, lon, mode, output, force, city,
  } = options;

  const weather = await getWeatherData(lat, lon, mode, city);
  await saveResults(output, force, weather);

  console.log(lat, lon, mode, output, force);
};

export async function handleInfoCommand() {
  const questions = [
    {
      type: 'input',
      name: 'city',
      message: 'Which city do you want to know the weather of?',
      validate(value) {
        if (value.length) {
          return true;
        }
        return 'Please enter the city name';
      },
    },
    {
      type: 'input',
      name: 'output',
      message: 'Where would you like to store the result?',
      validate(value) {
        if (value.length) {
          return true;
        }
        return 'Please enter the output path';
      },
    },
    {
      type: 'confirm',
      name: 'forceOverwrite',
      message: 'Would you like to overwrite the file if it already exists?',
      default: false,
    },
    {
      type: 'list',
      name: 'mode',
      message: 'In what format would you like the weather information?',
      choices: ['json', 'xml', 'html'],
      default: 'json',
    },
  ];

  const answers = await inquirer.prompt(questions);

  const {
    city, output, forceOverwrite, mode,
  } = answers;

  console.log(`Fetching weather data for ${city} in ${mode} format...`);
  const weather = await getWeatherData(null, null, mode, city);
  saveResults(output, forceOverwrite, weather);
}
