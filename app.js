const express = require("express");
const axios = require("axios");
const app = express();
const getWeatherImage = require("./getWeatherImage");
const getWeatherOneHour = require("./getWeatherOneHour");

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
  const { datetime } = req.body.nlp.entities;
  if (datetime) {
    if (datetime[0].accuracy == "day") {
      const date = datetime[0].iso;
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
          const weatherOneHour = getWeatherOneHour(
            date,
            response.data.list,
            12
          );

          getWeatherImage(weatherOneHour.weather[0].id).then(result => {
            const weatherUrl = result;

            res.json({
              replies: [
                {
                  type: "card",
                  content: {
                    title: weatherOneHour.weather[0].main,
                    subtitle: location.formatted,
                    imageUrl: weatherUrl,
                    buttons: [
                      {
                        title: "Matin",
                        value: `Quel temps fait il à ${
                          location.raw
                        } demain matin ?`
                      },
                      {
                        title: "Midi",
                        value: `Quel temps fait il à ${
                          location.raw
                        } demain midi ?`
                      },
                      {
                        title: "Soir",
                        value: `Quel temps fait il à ${
                          location.raw
                        } demain soir ?`
                      }
                    ]
                  }
                }
              ]
            });
          });
        });
    }

    if (
      datetime[0].accuracy == "day,halfday" ||
      datetime[0].accuracy == "halfday"
    ) {
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
          const date = datetime[0].iso;
          let hours;

          if (new Date(datetime[0].iso).getHours() == 8) {
            hours = 9;
          } else {
            hours = new Date(datetime[0].iso).getHours() - 1;
          }

          const weatherOneHour = getWeatherOneHour(
            date,
            response.data.list,
            hours
          );

          if (!!weatherOneHour) {
            getWeatherImage(weatherOneHour.weather[0].id).then(result => {
              const weatherUrl = result;
              res.json({
                replies: [
                  {
                    type: "card",
                    content: {
                      title: weatherOneHour.weather[0].main,
                      subtitle: location.formatted,
                      imageUrl: weatherUrl,
                      buttons: [
                        {
                          title: "Merci",
                          value: "Merci"
                        }
                      ]
                    }
                  }
                ]
              });
            });
          } else {
            res.json({
              replies: [
                { type: "text", content: "Je n'ai pas la réponse désolé :(" }
              ]
            });
          }
        });
    }
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
                  subtitle: location.formatted,
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
