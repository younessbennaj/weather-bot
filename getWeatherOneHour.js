const getWeatherOneHour = (date, weatherList, specificHour) => {
  const weatherOneDay = weatherList.filter((element, index) => {
    let actuelDay = new Date(date).getDate();
    let dateElement = new Date(element.dt_txt).getDate();
    if (dateElement == actuelDay) {
      return element;
    }
  });

  const weatherOneHour = weatherOneDay.filter((element, index) => {
    let actualHour = specificHour || new Date(date).getHours();
    let hourElement = new Date(element.dt_txt).getHours();
    if (actualHour == hourElement) {
      return element;
    }
  });

  return weatherOneHour[0];
};

module.exports = getWeatherOneHour;
