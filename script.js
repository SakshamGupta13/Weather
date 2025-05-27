const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const aqiValue = document.getElementById('aqi-value'); // AQI Element

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
const verifyBtn = document.querySelector('.verifyBtn');
const verifyBox = document.querySelector('.verifyBox');
const verify = document.querySelector('.verify');

let verificationCode = 0;

function checkOTP(){
    const first = document.querySelector('#first').value;
    const second = document.querySelector('#second').value;
    const third = document.querySelector('#third').value;
    const fourth = document.querySelector('#fourth').value;
    console.log(first);

    const str = first + second + third + fourth;
    console.log(str);
    if(str === verificationCode.toString()){
        verifyBox.style.display = "none";
        searchBox.style.display = "flex";
        
    }else{
        alert("Wrong OTP Entered");
    }
}

// Email Sending Function
function sendWeatherEmail(weather_data, city, aqi, aqiDesc) {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    const templateParams = {
        user_name: userName,
        user_email: userEmail,
        location: city,
        temperature: `${Math.round(weather_data.main.temp - 273.15)}°C`,
        description: weather_data.weather[0].description,
        humidity: `${weather_data.main.humidity}%`,
        wind_speed: `${weather_data.wind.speed} Km/H`,
        aqi: `${aqi} (${aqiDesc})` // Include AQI
    };

    emailjs.send("service_thm31dr", "template_di0xi1p", templateParams)
        .then(() => {
            console.log("Email sent successfully!");
        })
        .catch((error) => {
            console.error("Email sending failed:", error);
        });
}

function sendVerificationEmail() {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    verificationCode = Math.floor(1000 + Math.random() * 9000); // 4-digit code
    localStorage.setItem("verificationCode", verificationCode); // Store for later verification

    const templateParams = {
        user_name: userName,
        user_email: userEmail,
        verification_code: verificationCode
    };

    emailjs.send("service_thm31dr", "template_g6xlthm", templateParams)
        .then(() => {
            console.log("Verification email sent successfully!");
        })
        .catch((error) => {
            console.error("Verification email sending failed:", error);
        });
}



// AQI Fetch Function
async function fetchAQI(lat, lon) {
    const api_key = "693a0a8b2c20f1addee7bdf153490488";
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.list && data.list.length > 0) {
        const aqi = data.list[0].main.aqi;
        const aqiDesc = getAQIDescription(aqi);
        aqiValue.innerText = `${aqi} (${aqiDesc})`;
        return { aqi, aqiDesc };
    } else {
        aqiValue.innerText = "N/A";
        return { aqi: "N/A", aqiDesc: "Unknown" };
    }
}


// AQI Description Helper
function getAQIDescription(aqi) {
    switch (aqi) {
        case 1: return "Good";
        case 2: return "Fair";
        case 3: return "Moderate";
        case 4: return "Poor";
        case 5: return "Very Poor";
        default: return "Unknown";
    }
}

// Main Weather Function
async function checkWeather(city) {
    const api_key = "693a0a8b2c20f1addee7bdf153490488";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    const weather_data = await fetch(`${url}`).then(response => response.json());

    if (weather_data.cod === `404`) {
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

    const lat = weather_data.coord.lat;
    const lon = weather_data.coord.lon;
    const { aqi, aqiDesc } = await fetchAQI(lat, lon);

    switch (weather_data.weather[0].main) {
        case 'Clouds':
            weather_img.src = "assets/cloud.png";
            break;
        case 'Clear':
            weather_img.src = "assets/clear.png";
            break;
        case 'Rain':
            weather_img.src = "assets/rain.png";
            break;
        case 'Mist':
            weather_img.src = "assets/mist.png";
            break;
        case 'Snow':
            weather_img.src = "assets/snow.png";
            break;
    }

    sendWeatherEmail(weather_data, city, aqi, aqiDesc);
    console.log(weather_data);
}

// Event Listener for Search Button
searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

// === NAME ===
function saveData1(name) {
    localStorage.setItem("userName", name);
    appNameInput.value = '';
    emailDiv.style.display = "flex";
    nameDiv.style.display = "none";
    verifyBox.style.display = "none";
    desc.style.display = "none";
}

nameBtn.addEventListener('click', (event) => {
    event.preventDefault();
    saveData1(appNameInput.value);
});

verifyBtn.addEventListener('click',()=>{
    checkOTP();
})

// === EMAIL ===
function saveData2(email) {
    if (!email.includes('@') || !email.includes('.')) {
        alert("Please enter a valid email address.");
        return;
    }

    localStorage.setItem("userEmail", email);
    appEmailInput.value = '';
    // searchBox.style.display = "flex";
    emailDiv.style.display = "none";
    verifyBox.style.display = "flex";
    verify.style.display = "flex";
    desc.style.display = "none";

    sendVerificationEmail();
}

emailBtn.addEventListener('click', (event) => {
    event.preventDefault();
    saveData2(appEmailInput.value);
});

// === ENTER KEY FUNCTIONALITY ===

// For name input
appNameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveData1(appNameInput.value);
    }
});

// For email input
appEmailInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveData2(appEmailInput.value);
    }
});

// For search (city) input
inputBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        checkWeather(inputBox.value);
    }
});