const apikey = '673d0423ff1aec6d869b535e82b0d5e7';

let weather = {
    fetchWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`)
            .then(response => response.json())
            .then(data => this.renderWeather(data))
    },
    renderWeather(data) {
        const { name } = data;
        const { main:description } = data.weather[0];
        const { temp, feels_like:feelsLike, humidity, pressure } = data.main;
        const { speed:windSpeed } = data.wind;
        console.log(name, description, temp, feelsLike, windSpeed)
    }
}
