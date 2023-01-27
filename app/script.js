const owmAPI = '673d0423ff1aec6d869b535e82b0d5e7';

let weather = {
    lat: 0,
    lon: 0,

    renderWeather() {
        document.getElementById('city').textContent = weather.data.cityName;
        document.getElementById('temp').textContent = Math.round(weather.data.temperature) + '°';
        document.getElementById('feelsLike').textContent = Math.round(weather.data.apparentTemperature);
        document.getElementById('wind').textContent = weather.data.windSpeed.toFixed(1);
        document.getElementById('humidity').textContent = weather.data.humidity;
        document.getElementById('pressure').textContent = Math.round(weather.data.pressure * 75/100);
        document.getElementById('weatherState').textContent = weather.data.condition;
        document.getElementById('weatherState').textContent = weather.data.condition;
        document.getElementById('uv').textContent = weather.data.uv;

        let date = String(new Date());
        let dateFormatted = date.split(' ').slice(1, 4).join(' ');

        let timeRaw = new Date().toLocaleString("en-US", {timeZone: weather.data.timezone});
        let time = timeRaw.split(' ').slice(1, 2).join(' ');
        let timeFormatted = time.split(':').slice(0, 2).join(':') + ' PM';

        document.querySelector('.city_date').textContent = dateFormatted + ', ' + timeFormatted;

        switch (weather.data.condition) {
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
    },

    renderForecast() {
        for (let i = 0; i < 7; i++) {
            let card = document.querySelector(`#c${i}`);
            let date = document.querySelector(`#d${i}`);

            card.firstElementChild.textContent = Math.round(weather.forecast.temperature_2m_max[i]);
            card.lastElementChild.textContent = Math.round(weather.forecast.temperature_2m_min[i]);

            if (!date) continue;

            let dateValue = new Date(weather.forecast.time[i]).toString().split(' ').slice(1, 3).join(' ');

            date.textContent = dateValue;

        }
    },

    renderAirQuality() {
        document.getElementById('aqi').textContent = weather.aq.aqi;
        document.getElementById('pm25').textContent = weather.aq.pm25;
        document.getElementById('pm10').textContent = weather.aq.pm10;
        document.getElementById('co').textContent = weather.aq.co;
        document.getElementById('no2').textContent = weather.aq.no2;
        document.getElementById('o3').textContent = weather.aq.o3;

        if (weather.aq.aqi <= 51) {
            document.querySelector('.aq_index').style.backgroundColor = 'var(--green)';
            document.querySelector('.aq_index__state').style.color = '#608234';
            document.querySelector('.aq_index__state').textContent = 'Good';
        }

        if (weather.aq.aqi >= 51 && weather.aq.aqi <= 100) {
            document.querySelector('.aq_index').style.backgroundColor = 'var(--yellow)';
            document.querySelector('.aq_index__state').style.color = '#73683F';
            document.querySelector('.aq_index__state').textContent = 'Moderate';
        }

        if (weather.aq.aqi >= 101 && weather.aq.aqi <= 150) {
            document.querySelector('.aq_index').style.backgroundColor = 'var(--orange)';
            document.querySelector('.aq_index__state').style.color = '#7f4015';
            document.querySelector('.aq_index__state').style.fontSize = '25px';
            document.querySelector('.aq_index__state').textContent = 'Unhealthy For Sensitive Groups';
        }

        if (weather.aq.aqi >= 151 && weather.aq.aqi <= 200) {
            document.querySelector('.aq_index').style.backgroundColor = 'var(--red)';
            document.querySelector('.aq_index__state').style.color = '#6F2B2B';
            document.querySelector('.aq_index__state').textContent = 'Unhealthy';
        }

        if (weather.aq.aqi >= 201 && weather.aq.aqi <= 300) {
            document.querySelector('.aq_index').style.backgroundColor = 'var(--purple)';
            document.querySelector('.aq_index__state').style.color = '#6F2B2B';
            document.querySelector('.aq_index__state').textContent = 'Very Unhealthy';
        }

        if (weather.aq.aqi >= 301) {
            document.querySelector('.aq_index').style.backgroundColor = 'var(--maroon)';
            document.querySelector('.aq_index__state').style.color = '#6F2B2B';
            document.querySelector('.aq_index__state').textContent = 'Hazardous';
        }

    },

    renderAqAlert() {
        if (weather.aq.pm25 < 7.5) {
            document.querySelector('.alert').classList.add('hidden');
            document.querySelector('.aq_alert__none').classList.remove('hidden');
        }

        if (weather.aq.pm25 > 7.5) {
            const alertNone = document.querySelector('.aq_alert__none');

            if (alertNone) alertNone.classList.add('hidden');

            const alert = document.querySelector('.alert');
            const alertCity = document.querySelector('#alert__description__city');
            const exceedingValue = document.querySelector('.alert__block__value');
            const exceedingValueDesc = document.querySelector('#alert__description__value');

            const exceeding = weather.aq.pm25 / 5;

            alertCity.textContent = weather.data.cityName;
            exceedingValue.textContent = 'x' + exceeding;
            exceedingValueDesc.textContent = exceeding;

            if (exceeding > 5) {
                alert.classList.add('alert_dangerous');
                alert.classList.remove('alert_moderate')
            } else {
                alert.classList.add('alert_moderate');
                alert.classList.remove('alert_dangerous')
            }

            document.querySelector('.alert').classList.remove('hidden');
        }
    }

}

async function queryGeo(city) {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${owmAPI}`);

    if (response.status === 404) {
        throw new Error('Wrong city name. Try again');
    } else if (response.status !== 200){
        throw new Error('Something went wrong: Unknown Error');
    }

    return response;
}

async function queryGeneral(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${owmAPI}`);

    if (response.status === 404) {
        throw new Error('Wrong city name. Try again');
    } else if (response.status !== 200){
        throw new Error('Something went wrong: Unknown Error');
    }

    return response;
}

async function queryForecast() {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${weather.lat}&longitude=${weather.lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);

    if (response.status !== 200){
        throw new Error('Something went wrong: Unknown Error');
    }

    return response;
}

async function queryAirQuality() {
    const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${weather.lat}&longitude=${weather.lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,uv_index,us_aqi&timezone=auto`);

    if (response.status !== 200){
        throw new Error('Something went wrong: Unknown Error');
    }

    return response;
}

async function fetchData(city) {
    const responseGeocode = await queryGeo(city);

    let dataGeocode = await responseGeocode.json();

    weather.lat = dataGeocode[0].lat.toFixed(2);
    weather.lon = dataGeocode[0].lon.toFixed(2);

    const responseGeneral = await queryGeneral(city);
    const responseForecast = await queryForecast();
    const responseAirQuality = await queryAirQuality()

    const dataGeneral = await responseGeneral.json();
    const dataForecast = await responseForecast.json();
    const dataAirQuality = await responseAirQuality.json();

    let { name:cityName } = dataGeneral;
    let { timezone } = dataForecast;
    let { main:condition, conditionDescription } = dataGeneral.weather[0];
    let { temp:temperature, feels_like:apparentTemperature, humidity, pressure } = dataGeneral.main;
    let { speed:windSpeed } = dataGeneral.wind;
    let uv = dataAirQuality.hourly['uv_index'][36];

    if (condition === 'Clouds') condition = 'Overcast';
    if (conditionDescription === 'few clouds') conditionDescription = 'Cloudy';

    let forecast = dataForecast.daily;

    let pm25 = dataAirQuality.hourly['pm2_5'][36];
    let pm10 = dataAirQuality.hourly['pm10'][36];
    let co = dataAirQuality.hourly['carbon_monoxide'][36];
    let no2 = dataAirQuality.hourly['nitrogen_dioxide'][36];
    let o3 = dataAirQuality.hourly['ozone'][36];
    let aqi = dataAirQuality.hourly['us_aqi'][36];

    weather = {
        ...weather,
        data: {
            cityName,
            condition,
            conditionDescription,
            temperature,
            apparentTemperature,
            humidity,
            pressure,
            windSpeed,
            uv,
            timezone,
        },

        forecast,

        aq: {
            pm25,
            pm10,
            co,
            no2,
            o3,
            aqi,
        },
    }
}

//

const loading = document.createElement('img');
loading.src = 'img/loading.svg';
loading.classList.add('loading');

const mainScreen = document.querySelector('section');
const searchScreen = document.getElementById('searchScreen');
const searchHeader = document.getElementById('searchHeader');

let errorMessageState = 0;

searchScreen.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        document.querySelector('section').append(loading);

        fetchData(event.currentTarget.value).then(r => {

            weather.renderWeather();
            weather.renderForecast();
            weather.renderAirQuality();
            weather.renderAqAlert();

            document.querySelector('.search').classList.remove('search_invisible');
            mainScreen.classList.add('invisible');

            setTimeout(() => {
                document.querySelector('section').classList.add('hidden');
            }, 500);

        }).catch(err => {
            loading.remove();

            if (errorMessageState) return;

            let errorMessage = document.createElement('p')
            errorMessage.textContent = err.message;
            errorMessage.classList.add('error');

            document.querySelector('section').append(errorMessage);

            errorMessageState = 1;

        })
    }
})

searchHeader.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        fetchData(event.currentTarget.value).then(r => {
            weather.renderWeather();
            weather.renderForecast();
            weather.renderAirQuality();
            weather.renderAqAlert();
        }).catch(err => {
            if (errorMessageState) return;

            let errorMessage = document.createElement('p');
            errorMessage.textContent = err.message;
            errorMessage.classList.add('error_header');

            document.querySelector('div.logo').after(errorMessage);

            errorMessageState = 1;
        });


        event.currentTarget.value = '';
    }
})