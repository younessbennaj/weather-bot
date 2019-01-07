const express = require("express");
const axios = require("axios");
var recastai = require("recastai").default;
const app = express();
var bodyParser = require("body-parser");
const port = 5000;
const API_KEY = "d8226f44f17257daa0c78241180a1474";
let url = "http://api.openweathermap.org/data/2.5/weather";
const REQUEST_TOKEN = "74adb2a99aaf8cecc36496a94003fce2";

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Ceci est un test");
  res.send("Hello !!");
});

const weatherImageUrl = [
  {
    id: 200,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  },
  {
    id: 201,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  },
  {
    id: 202,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  },
  {
    id: 210,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  },
  {
    id: 211,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  },
  {
    id: 212,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  },
  {
    id: 221,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  },
  {
    id: 230,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  },
  {
    id: 231,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  },
  {
    id: 300,
    url: "https://i.imgur.com/BWKyZbr.jpg"
  },
  {
    id: 301,
    url: "https://i.imgur.com/BWKyZbr.jpg"
  },
  {
    id: 302,
    url: "https://i.imgur.com/BWKyZbr.jpg"
  },
  {
    id: 310,
    url: "https://i.imgur.com/BWKyZbr.jpg"
  },
  {
    id: 311,
    url: "https://i.imgur.com/BWKyZbr.jpg"
  },
  {
    id: 312,
    url: "https://i.imgur.com/BWKyZbr.jpg"
  },
  {
    id: 313,
    url: "https://i.imgur.com/BWKyZbr.jpg"
  },
  {
    id: 314,
    url: "https://i.imgur.com/BWKyZbr.jpg"
  },
  {
    id: 321,
    url: "https://i.imgur.com/BWKyZbr.jpg"
  },
  {
    id: 500,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 501,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 502,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 503,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 504,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 511,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 520,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 521,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 522,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 531,
    url: "https://i.imgur.com/rnP01FI.jpg"
  },
  {
    id: 600,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 601,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 602,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 611,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 612,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 615,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 616,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 620,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 621,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 622,
    url: "https://i.imgur.com/d0iyMIq.jpg"
  },
  {
    id: 701,
    url: "https://i.imgur.com/hq08stL.jpg"
  },
  {
    id: 711,
    url: "https://i.imgur.com/a7vUsO2.jpg"
  },
  {
    id: 721,
    url: "https://i.imgur.com/CsB5rjs.jpg"
  },
  {
    id: 731,
    url: "https://i.imgur.com/FtpFXBt.jpg"
  },
  {
    id: 741,
    url: "https://i.imgur.com/QVcFf8Q.jpg"
  },
  {
    id: 751,
    url: "https://i.imgur.com/QEUHNY7.jpg"
  },
  {
    id: 761,
    url: "https://i.imgur.com/CsB5rjs.jpg"
  },
  {
    id: 762,
    url: "https://i.imgur.com/a7vUsO2.jpg"
  },
  {
    id: 771,
    url: "https://i.imgur.com/CsB5rjs.jpg"
  },
  {
    id: 781,
    url: "https://i.imgur.com/CsB5rjs.jpg"
  },
  {
    id: 800,
    url: "https://i.imgur.com/vJqY07d.jpg"
  },
  {
    id: 801,
    url: "https://i.imgur.com/cfPffS4.png"
  },
  {
    id: 802,
    url: "https://i.imgur.com/pFChd8r.jpg"
  },
  {
    id: 803,
    url: "https://i.imgur.com/IdeovmQ.jpg"
  },
  {
    id: 804,
    url: "https://i.imgur.com/AqkJBm3.jpg"
  }
];

function getWeatherImage(weatherId) {
  let elementUrl;
  weatherImageUrl.map(element => {
    if (element.id == weatherId) {
      elementUrl = element.url;
    }
  });
  return elementUrl;
}

app.post("/weather", (req, res) => {
  const { lat, lng, name, country } = req.body.conversation.memory.location;
  axios
    .get(url, {
      params: {
        lat: lat,
        lon: lng,
        appid: API_KEY
      }
    })
    .then(response => {
      const { id, main } = response.data.weather[0];
      const weatherUrl = getWeatherImage(id);
      console.log(response.data.weather[0]);
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
    })
    .catch(error => {});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
