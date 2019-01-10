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
  //Get datetime and locaiton informations about the user request
  const { location } = req.body.conversation.memory;
  const { datetime } = req.body.nlp.entities;
  //If the user want the weather for a specific hour (not the actual moment)
  if (datetime) {
    if (datetime[0].accuracy == "day") {
      //The date in iso format
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
          //Get weather for a specific hour in a day
          const weatherOneHour = getWeatherOneHour(
            date,
            response.data.list,
            12
          );

          //Get the image to illustrate the weather
          getWeatherImage(weatherOneHour.weather[0].id).then(result => {
            const weatherUrl = result;

            //Send card with weather informations and button for a specific hour
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

    //If the user want the weather for a specific moment in a day
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
          //To find the corresponding weather in the API return
          if (new Date(datetime[0].iso).getHours() == 8) {
            hours = 9;
          } else {
            hours = new Date(datetime[0].iso).getHours() - 1;
          }

          //Get weather for a specific hour in a day
          const weatherOneHour = getWeatherOneHour(
            date,
            response.data.list,
            hours
          );

          if (!!weatherOneHour) {
            getWeatherImage(weatherOneHour.weather[0].id).then(result => {
              const weatherUrl = result;
              //Send a message with the weather for a specific hour in a day
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
    //The user want the weather for the actual moment
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
          //Send a card with the weather informations
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
