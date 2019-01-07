const express = require("express");
const axios = require("axios");
const app = express();
const getWeatherImage = require("./getWeatherImage");

//Listening on port 5000
const port = 5000;

//OpenWeatherMap API Config
const API_KEY = "d8226f44f17257daa0c78241180a1474";
const API_URL = "http://api.openweathermap.org/data/2.5/weather";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello !!");
});

/*Recast send us a POST request to /weather to get the weather when a user has filled
his search criterias*/
app.post("/weather", (req, res) => {
  const { lat, lng, name, country } = req.body.conversation.memory.location;
  axios
    .get(API_URL, {
      params: {
        lat: lat,
        lon: lng,
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
    .catch(error => {
      console.log(error);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
