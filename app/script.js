// API

const weatherAPI = '673d0423ff1aec6d869b535e82b0d5e7';

let weatherData = {
    cityName: '',
    state: '',
    description: '',
    temperature: 0,
    feelsLike: 0,
    humidity: 0,
    pressure: 0,
    windSpeed: 0,
    timezone: 0,
}

const loading = document.createElement('img');
loading.src = 'img/loading.svg'
loading.classList.add('loading');
const mainScreen = document.querySelector('section');

const fetchData = async (city) => {
    document.querySelector('section').append(loading)

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAPI}`);

    if (response.status === 404) {
        throw new Error('Wrong city name. Try again');
    } else if (response.status !== 200){
        throw new Error('Something went wrong: Unknown Error');
    }

    const data = await response.json();

    const { name:cityName, timezone } = data;
    let { main:state, description } = data.weather[0];
    const { temp:temperature, feels_like:feelsLike, humidity, pressure } = data.main;
    const { speed:windSpeed } = data.wind;

    if (state === 'Clouds') state = 'Overcast';
    if (description === 'few clouds') state = 'Cloudy';

    weatherData = {
        cityName,
        state,
        description,
        temperature,
        feelsLike,
        humidity,
        pressure,
        windSpeed,
        timezone,
    }

    renderWeather()
}

// Weather

const renderWeather = () => {

    document.getElementById('city').textContent = weatherData.cityName;
    document.querySelector('.temperature').textContent = Math.round(weatherData.temperature) + '°';
    document.getElementById('feelsLike').textContent = Math.round(weatherData.feelsLike);
    document.getElementById('wind').textContent = weatherData.windSpeed.toFixed(1);
    document.getElementById('humidity').textContent = weatherData.humidity;
    document.getElementById('pressure').textContent = Math.round(weatherData.pressure * 75/100);
    document.getElementById('weatherState').textContent = weatherData.state;
    renderWeatherState(weatherData.state);

    let date = String(new Date());
    let dateFormatted = date.split(' ').slice(1, 4).join(' ');

    document.querySelector('.city_date').textContent = dateFormatted;

}

const renderWeatherState = (state) => {

    switch (state) {
        case 'Clear':
            document.getElementById('weatherPattern').src = 'img/clear.svg';
            break;
        case 'Cloudy':
            document.getElementById('weatherPattern').src = 'img/cloudy.svg';
            break;
        case 'Overcast':
            document.getElementById('weatherPattern').src = 'img/overcast.svg';
            break;
        case 'Rain':
            document.getElementById('weatherPattern').src = 'img/rain.svg';
            break;
        case 'Drizzle':
            document.getElementById('weatherPattern').src = 'img/drizzle.svg';
            break;
        case 'Snow':
            document.getElementById('weatherPattern').src = 'img/snow.svg';
            break;
        case 'Mist':
            document.getElementById('weatherPattern').src = 'img/mist.svg';
            break;
        case 'Smoke':
            document.getElementById('weatherPattern').src = 'img/mist.svg';
            break;
        case 'Haze':
            document.getElementById('weatherPattern').src = 'img/mist.svg';
            break;
        case 'Fog':
            document.getElementById('weatherPattern').src = 'img/mist.svg';
            break;
    }
}

const searchScreen = document.getElementById('searchScreen');
const searchHeader = document.getElementById('searchHeader');
let errorMessageState = 0;

searchScreen.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        fetchData(event.currentTarget.value)
            .then(r => {
                fetchForecast().then(r => {
                    document.querySelector('.search').classList.remove('search_invisible');
                    mainScreen.classList.add('invisible');

                    setTimeout(() => {
                        document.querySelector('section').classList.add('hidden');
                    }, 500);
                }).catch(err => {
                    console.log('forecast error')
                })

            }).catch(err => {
            loading.remove();

            if (errorMessageState) return;

            let errorMessage = document.createElement('p')
            errorMessage.textContent = err.message;
            errorMessage.classList.add('error');

            document.querySelector('section').append(errorMessage);

            errorMessageState = 1;
        });

        localStorage.setItem('lastQuery', event.currentTarget.value);
    }
})

searchHeader.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        fetchData(event.currentTarget.value)
            .then(r => {
                fetchForecast().then(r => {
                    document.querySelector('.search').classList.remove('search_invisible');
                    mainScreen.classList.add('invisible');

                    setTimeout(() => {
                        document.querySelector('section').classList.add('hidden');
                    }, 500);
                }).catch(err => {
                    console.log('forecast error')
                })

            })
            .catch(err => {
                if (errorMessageState) return;

                let errorMessage = document.createElement('p');
                errorMessage.textContent = err.message;
                errorMessage.classList.add('error_header');

                document.querySelector('div.logo').after(errorMessage);

                errorMessageState = 1;
            });

        localStorage.setItem('lastQuery', event.currentTarget.value);

        event.currentTarget.value = '';
    }
})

// Forecast

let forecastData;

const fetchForecast = async () => {
    const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${weatherData.cityName}&limit=1&appid=${weatherAPI}`);
    let geoData = await geoResponse.json();

    const lat = geoData[0].lat.toFixed(2);
    const lon = geoData[0].lon.toFixed(2);

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`)
    const data = await response.json();

    forecastData = data.daily;

    renderForecast();

    // for (let el of Object.keys(data.list)) {
    //     if (!(el % 8)) forecastData.push(data.list[el]);
    // }
}

const renderForecast = () => {
    for (let i = 0; i < 7; i++) {
        let card = document.querySelector(`#c${i}`);
        let date = document.querySelector(`#d${i}`)

        if (!card) break;

        card.firstElementChild.textContent = Math.round(forecastData.temperature_2m_max[i]);
        card.lastElementChild.textContent = Math.round(forecastData.temperature_2m_min[i]);

        if (!date) continue;

        let dateValue = new Date(forecastData.time[i]).toString().split(' ').slice(1, 3).join(' ');

        date.textContent = dateValue;

    }

    for (let i = 0; i < 7; i++) {

    }
}

// if (localStorage.key('lastQuery')) {
//     fetchData(localStorage.getItem('lastQuery'));
// }
