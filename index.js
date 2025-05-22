
function handleUserRequest(action, city) {
  if (action.toLowerCase() === "temperature" || action.toLowerCase() === "climate" || action.toLowerCase() === "weather report") {
    const city2 = city.charAt(0).toUpperCase() + city.slice(1);
    fetchTemperature(action, city2);
  }
  else{
    const message = `
      <div class="message bot-message">
        <span class="sender">Bot</span>
        Oops! Couldn't fetch the data. Please check the names provided and Try again later.
      </div>
    `;
    chatBox = document.getElementById("chat-body");
    chatBox.innerHTML += message;
    chatBox.scrollTop = chatBox.scrollHeight;;
  }
  // You can add more actions here like 'climate', 'humidity', etc.
}

function scrollInputIntoView() {
  const input = document.getElementById("chat-input");
  setTimeout(() => {
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300); // Delay gives time for keyboard to appear
}

async function fetchTemperature(action, city)
{
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=e3da758ae2664c89832154617251704&q=${city}&aqi=no`);
    const data = await response.json(); // wait for JSON to be parsed

    console.log(data); // You now have your weather data here

    // Display temperature
    const temperature = data.current.temp_c;
    const condition = data.current.condition.text;
    const cityName = data.location.name;
    const region = data.location.region;
    const country = data.location.country;
    const icon = data.current.condition.icon;
    let message = "";

    if(action.toLowerCase() === "temperature")
    {
      message = `
      <div class="message bot-message">
        <span class = "sender">Bot</span>
        📍 ${cityName}${region ? ', ' + region + ', ': ', '}${country}<br> 
        🌡️ ${temperature}°C <br>
      </div>`;
    }

    else if(action.toLowerCase() === "climate")
    {
      message = `
      <div class="message bot-message">
        <span class = "sender">Bot</span>
        📍 ${cityName}${region ? ', ' + region + ', ': ', '}${country}<br>
        <span style="display: flex; align-items: center;"><img src="https:${icon}" alt="Weather Icon" style="width: 25px; display: inline;">${condition}.</span>
      </div>`;
    }

    else if(action.toLowerCase() === "weather report")
    {
      const tempf = data.current.temp_f;
      const feelsLikec = data.current.feelslike_c;
      const feelsLikef = data.current.feelslike_f;
      const humidity = data.current.humidity;
      const uv = data.current.uv;
      const windDegree = data.current.wind_degree;
      const windDir = data.current.wind_dir;
      const windSpeedkph = data.current.wind_kph;
      const windSpeedmph = data.current.wind_mph;
      const windChillc = data.current.windchill_c;
      const windchillf = data.current.windchill_f;

      message = `
      <div class="message bot-message">
        <span class = "sender">Bot</span>
        📍 ${cityName}${region ? ', ' + region + ', ': ', '}${country}.<br><br>
        <h4>Weather report:</h4>
        🌡️ ${temperature}°C / ${tempf}°F.<br>
        <span style= "display: flex; align-items: center;"><img src="https:${icon}" alt="Weather Icon" style="width: 25px; display: inline;">${condition}.</span>
        🔺 Feels like: ${feelsLikec}°C / ${feelsLikef}°F.<br>
        🌅 Humidity: ${humidity}.<br>
        🔅 UV index: ${uv}.<br>
        💨 Wind flowing at ${windDegree}° in ${windDir} direction at the speed of ${windSpeedkph}KMPH / ${windSpeedmph}MPH.<br>
        ❄️ Wind chill: ${windChillc}°C / ${windchillf}°F.
      </div>`;
    }
    
    chatBox = document.getElementById("chat-body");
    chatBox.innerHTML += message;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.error("Error fetching weather data:", error);
    const errMessage = `<div class="message bot-message">
        <span class="sender">Bot</span>
        Oops! Couldn't fetch the data for ${city}. Try again later.
      </div>`;
      chatBox = document.getElementById("chat-body");
      chatBox.innerHTML += errMessage;
      chatBox.scrollTop = chatBox.scrollHeight;
  }
}

window.onload = function () {
  const chatBox = document.getElementById("chat-body"); // Replace with your actual message container ID
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");

  const botMessage = `
    <div class="message bot-message">
      <span class = "sender">Bot</span> Hi there! 👋 I can help you with weather updates such as temperature, climate or complete Weather report.<br>
      To ask, just type:<br><br>
      <strong>Temperature, Bangalore</strong>
      or
      <strong>Climate, New York</strong>
      or
      <strong>Weather report, Sydney</strong> for a complete weather report.<br><br>
      Let’s get started! 🌤️
    </div>
  `;

  chatBox.innerHTML += botMessage;


  sendBtn.addEventListener("click", function()
  {
    const message = userInput.value.trim();

    if(message !== "")
    {
      const userMessage = `
      <div class = "message user-message">
        <span class="sender">You</span>
        ${message}
      </div>
      `;

      chatBox.innerHTML += userMessage;
      chatBox.scrollTop = chatBox.scrollHeight;
      userInput.value = "";

      const parts = message.split(",").map(part => part.trim()); // Trim spaces

      if (parts.length === 2)
      {
          const action = parts[0];  // "Temperature", "Climate"
          const city = parts[1];

          handleUserRequest(action, city);
      }

      else
      {
        // Inform the user if they didn't enter in the correct format
        const errorMessage = `
          <div class="message bot-message">
            <span class="sender">Bot</span>
            Please enter the query in this format: <br>
            Example: <strong>Temperature, Bangalore</strong>
          </div>
        `;
        chatBox.innerHTML += errorMessage;
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
      }
    }
})

};
