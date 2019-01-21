export interface OWMForecastApiResponse {
  list: OWMForecastListItem[];
}

export interface OWMForecastListItem {
  dt_txt: Date | string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: OWMForecastWeatherItem[];
}

export interface OWMForecastWeatherItem {
  id: number;
  main: string;
  description: string;
}
