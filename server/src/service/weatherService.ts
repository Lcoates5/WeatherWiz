import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  description: string;
  temp: number;
  humidity: number;
  wind: number;
  icon: string;

  constructor(city: string, date: string, description: string, temp: number, humidity: number, wind: number, icon: string) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
    this.icon = icon;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: any;
  private apiKey: any;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.WEATHER_API_BASE_URL;
    this.apiKey = process.env.WEATHER_API_KEY;
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    return await response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geocode?apikey=${this.apiKey}&location=${this.cityName}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?apikey=${this.apiKey}&lat=${coordinates.lat}&lon=${coordinates.lon}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    return await this.fetchLocationData(query);
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { city_name, ts, weather, temp, rh, wind_spd, weather: { icon } } = response.data[0];
    return new Weather(city_name, ts, weather.description, temp, rh, wind_spd, icon);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((data: any) => {
      const { valid_date, weather: { description, icon }, temp, rh, wind_spd } = data;
      return new Weather(currentWeather.city, valid_date, description, temp, rh, wind_spd, icon);
    });
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const currentWeather = this.parseCurrentWeather(await this.fetchWeatherData(coordinates));
    const weatherData = await this.fetchWeatherData(coordinates);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.data);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
