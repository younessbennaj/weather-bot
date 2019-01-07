const axios = require("axios");

function getWeatherImage(weatherId) {
  const p = new Promise((resolve, reject) => {
    axios.get("https://api.myjson.com/bins/md2iw").then(response => {
      let elementUrl;
      response.data.map(element => {
        if (element.id == weatherId) {
          elementUrl = element.url;
        }
      });
      resolve(elementUrl);
    });
  });
  return p;
}

module.exports = getWeatherImage;
