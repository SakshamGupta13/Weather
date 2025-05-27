const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');

const weather_body = document.querySelector('.weather-body');
const desc = document.querySelector('.desc p');

const nameBtn = document.querySelector('.nameBtn');
const appNameInput = document.querySelector('.app-name');

const emailBtn = document.querySelector('.emailBtn');
const appEmailInput = document.querySelector('.app-email');
const searchBox = document.querySelector('.search-box');
const emailDiv = document.querySelector('.email');
const nameDiv = document.querySelector('.name');
const dataEmail = document.querySelector('.dataEmail');


async function checkWeather(city){
    const api_key = "693a0a8b2c20f1addee7bdf153490488";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    const weather_data = await fetch(`${url}`).then(response => response.json());


    if(weather_data.cod === `404`){
        location_not_found.style.display = "flex";
        desc.style.display = "none";
        weather_body.style.display = "none";
        console.log("error");
        return;
    }

    console.log("run");
    location_not_found.style.display = "none";
    desc.style.display = "none";
    dataEmail.style.display = "flex";
    weather_body.style.display = "flex";
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
    description.innerHTML = `${weather_data.weather[0].description}`;

    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;


    switch(weather_data.weather[0].main){
        case 'Clouds':
            weather_img.src = "/assets/cloud.png";
            break;
        case 'Clear':
            weather_img.src = "/assets/clear.png";
            break;
        case 'Rain':
            weather_img.src = "/assets/rain.png";
            break;
        case 'Mist':
            weather_img.src = "/assets/mist.png";
            break;
        case 'Snow':
            weather_img.src = "/assets/snow.png";
            break;

    }

    console.log(weather_data);
}


searchBtn.addEventListener('click', ()=>{
    checkWeather(inputBox.value);
});




// === NAME ===
function saveData1(name) {
  localStorage.setItem("userName", name);
//   alert("Name saved: " + name);

  appNameInput.value = '';

  emailDiv.style.display = "flex"; // Show email input
    nameDiv.style.display = "none"; // Hide the name input
}

nameBtn.addEventListener('click', (event) => {
  event.preventDefault();
  saveData1(appNameInput.value);
});


// === EMAIL ===
function saveData2(email) {
  if (!email.includes('@') || !email.includes('.')) {
    alert("Please enter a valid email address.");
    return;
  }

  localStorage.setItem("userEmail", email);
//   alert("Email saved: " + email);

  appEmailInput.value = '';
  searchBox.style.display = "flex"; // Show the search box
  emailDiv.style.display = "none"; // Hide the email input
}

emailBtn.addEventListener('click', (event) => {
  event.preventDefault();
  saveData2(appEmailInput.value);
});
