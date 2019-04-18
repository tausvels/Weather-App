// Getting the longitude and the latitude

window.addEventListener('load', ()=>{	// when page loads, perform an arrow function
	// DEFINING THE VARIABLES BEFOREHAND
	let long;
	let lat;
	let temperatureDescription = document.querySelector('.temperature-description');
	let temperatureDegree = document.querySelector('.temperature-degree');
	let temperatureActual = document.querySelector('.actual-temperature');
	let locationTimezone = document.querySelector('.location-timezone');
	let temperatureSection = document.querySelector('.temperature');
	//let timeNow = document.querySelector('.time-now');
	const temperatureSpan = document.querySelector('.temperature span');
	const actualTemperatureSpan = document.querySelector('.actual-feel span');


	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position =>{
			long = position.coords.longitude;
			lat = position.coords.latitude;

			const proxy = "https://cors-anywhere.herokuapp.com/"; // This is taken because the api server doesn't allow to fetch data/response from a 'local host'.
			const api = `${proxy}https://api.darksky.net/forecast/f6ac37c1d516acc667e5c2c69b3aa029/${lat},${long}`;
			
			fetch(api) // Performs a get request to the above URL
			.then(result =>{	// when the data fron the server arrives
				return result.json();	// convert the data fetched from the server so that it can be used by the JavaScript.
			})
			.then(result =>{
				console.log(result);
				const {temperature, apparentTemperature, time, summary, icon} = result.currently;	// getting only the specified information like 'temperature', 'summery' from 'currently'.
				/*
				var date = new Date(time*1000); console.log(date);
				var hours = date.getHours();
				var minutes = "0" + date.getMinutes();
				var seconds = "0" + date.getSeconds();
				var localTime = hours + '-' + minutes.substr(-2);
				var localTime2 = hours + ':' + minutes;
				console.log(localTime);
				*/

				// GETTING THE CURRENT LIVE TIME
				function checkTime(i) {
				    if (i < 10) {
				        i = "0" + i;
				    }
				    return i;
					}

				function startTime() {
				    var today = new Date();
				    var h = today.getHours();
				    var m = today.getMinutes();
				    var s = today.getSeconds();
				    // add a zero in front of numbers<10
				    m = checkTime(m);
				    s = checkTime(s);
				    document.getElementById('time-now').innerHTML = h + ":" + m + ":" + s;
				    t = setTimeout(function () {
				        startTime()
				    }, 500);
				}
				startTime();

				// FORMULA FOR CONVERTING FARENHEIT TO CELSIUS
				let celsius = (temperature - 32) * (5/9);
				let celsiusApparent = (apparentTemperature - 32) * (5/9);
				
				// SET DOM ELEMENTS FROM THE API
				//timeNow.textContent = localTime;	
				temperatureDegree.textContent = Math.floor(celsius); //temperature;
				temperatureActual.textContent = Math.floor(celsiusApparent); //apparentTemperature;
				temperatureDescription.textContent = summary;
				locationTimezone.textContent = result.timezone;


				// SET ICON (THIS IS WHERE WE INVOKE THE FUNCTION FOR SET ICON)
				setIcons(icon, document.querySelector('.icon'));

				// CHANGE TEMPERATURE TO CELSIUS/FARENHEIT FUNCTION
				//adding an event listener to listen for a 'click' event and then perform an 'arrow function'
				temperatureSection.addEventListener('click', () =>{
					if (temperatureSpan.textContent == 'C' || actualTemperatureSpan.textContent == 'C') 
						{
							temperatureSpan.textContent = 'F';
							actualTemperatureSpan.textContent = 'F';
							temperatureDegree.textContent = temperature;
							temperatureActual.textContent = apparentTemperature;
						}else 
							{
								temperatureSpan.textContent = 'C';
								actualTemperatureSpan.textContent = 'C';
								temperatureDegree.textContent = Math.floor(celsius);
								temperatureActual.textContent = Math.floor(celsiusApparent);
							}
				});
			});
		});
	}

	function setIcons(icon, iconID){
		const skycons = new Skycons({color:"white"}); // initiating skycon library
		const currentIcon = icon.replace(/-/g, "_").toUpperCase() ; // replacing every - to underscore and uppercase. e.g: 'partly-cloudy' to 'PARTLY_CLOUDY'.
		// this is done because the Skycons library requires the format to be uppercase and underscored.
		skycons.play();
		return skycons.set(iconID, Skycons[currentIcon]);
	}
})
