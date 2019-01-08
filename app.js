const express = require("express");
const axios = require("axios");
const app = express();
const getWeatherImage = require("./getWeatherImage");

//Listening on port 5000
const port = 5000;

//OpenWeatherMap API Config
const API_KEY = "d8226f44f17257daa0c78241180a1474";
const API_URL = "http://api.openweathermap.org/data/2.5/weather";
const API_FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello !!");
});

/*Recast send us a POST request to /weather to get the weather when a user has filled
his search criterias*/
app.post("/weather", (req, res) => {
  const { location } = req.body.conversation.memory;

  if (req.body.nlp.entities.datetime) {
    const datetime = req.body.nlp.entities.datetime[0].iso;

    //Access to 5 day forecast for any location or city
    axios
      .get(API_FORECAST_URL, {
        params: {
          lat: location.lat,
          lon: location.lng,
          appid: API_KEY
        }
      })
      .then(response => {
        //Access weather for a specific day
        const weatherOneDay = response.data.list.filter((element, index) => {
          let actuelDay = new Date(datetime).getDate();
          let dateElement = new Date(element.dt_txt).getDate();
          if (dateElement == actuelDay) {
            return element;
          }
        });
      });
  } else {
    axios
      .get(API_URL, {
        params: {
          lat: location.lat,
          lon: location.lng,
          appid: API_KEY
        }
      })
      .then(response => {
        const { id, main } = response.data.weather[0];
        getWeatherImage(id).then(result => {
          const weatherUrl = result;
          res.json({
            replies: [
              {
                type: "card",
                content: {
                  title: main,
                  subtitle: "subtitle",
                  imageUrl: weatherUrl,
                  buttons: [
                    {
                      title: "En savoir plus !",
                      type: "BUTTON_TYPE",
                      value: "BUTTON_VALUE"
                    }
                  ]
                }
              }
            ]
          });
        });
      })
      .catch(error => {});
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
