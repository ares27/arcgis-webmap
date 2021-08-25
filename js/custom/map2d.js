require([
  "esri/config",
  "esri/tasks/Locator",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Expand",
  "esri/widgets/LayerList",
  "esri/widgets/Search",
  // "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery",
  "esri/Graphic",
  "esri/layers/FeatureLayer",
], (
  esriConfig,
  Locator,
  Map,
  MapView,
  Expand,
  LayerList,
  Search,
  // BasemapToggle,
  BasemapGallery,
  Graphic,
  FeatureLayer
) => {
  // esriConfig.apiKey =
  // "AAPK38d5964a655b48dbb8fb30fe5bc1098co28bAFzHHonjZPlh5QIp2DRruOGyamDWbvQJegvAQlvfxlKs94COtvB-ad44WdjI";

  const armedConflictLayer = new FeatureLayer(
    layersArray["armedConflictLayer"]
  );
  // map.add(featureLayer);

  let locatorTask = new Locator({
    url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
  });
  const map = new Map({
    // basemap: "arcgis-topographic",
    basemap: "topo",
    layers: armedConflictLayer,
  });
  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 7,
    center: [28.200526, -25.856598],
  });
  const searchWidget = new Search({
    view: view,
  });

  const layerList = new LayerList({
    view: view,
    container: document.createElement("div"),
  });

  const layerListExpand = new Expand({
    view: view,
    content: layerList.domNode,
    expandIconClass: "esri-icon-layer-list",
  });

  const basemapGallery = new BasemapGallery({
    view: view,
    container: document.createElement("div"),
  });

  const basemapGalleryExpand = new Expand({
    view: view,
    content: basemapGallery.container,
    expandIconClass: "esri-icon-basemap",
  });

  // view.popup.autoOpenEnabled = false;
  // view.when(function () {
  // Add UI elements
  view.ui.add(searchWidget, { position: "top-right" });
  view.ui.add(basemapGalleryExpand, "top-left");
  view.ui.add(layerListExpand, "top-left");
  // });

  view.on("click", (event) => {
    // console.log(event);
    view.graphics.removeAll();
    // const lats = Math.round(event.mapPoint.latitude * 1000) / 1000;
    // const long = Math.round(event.mapPoint.longitude * 1000) / 1000;
    dropPoint(event.mapPoint.longitude, event.mapPoint.latitude);

    locatorTask
      .locationToAddress({ location: event.mapPoint })
      .then(async function (response) {
        // view.popup.content = response.address;
        // console.log(response.address);

        const w = await getWeather(
          event.mapPoint.longitude,
          event.mapPoint.latitude
        );

        showToast(
          event.mapPoint.longitude.toFixed(5),
          event.mapPoint.latitude.toFixed(5),
          response.address,
          `${w.main.feels_like} \xB0C, ${w.weather[0].description}`,
          `http://openweathermap.org/img/wn/${w.weather[0].icon}.png`
        );
      })
      .catch(function (err) {
        console.error(err);
        let genErrorMsg = "No address was found for this location";
        showToast(
          event.mapPoint.longitude.toFixed(5),
          event.mapPoint.latitude.toFixed(5),
          genErrorMsg,
          null
        );
      });

    // dropPoint(event.mapPoint.longitude, event.mapPoint.latitude);
    // showToast(event.mapPoint.longitude, event.mapPoint.latitude);
  });

  // Functions
  function dropPoint(lon, lat) {
    // console.log(`dropPoint(), Lon: ${lon}, Lat: ${lat}`);
    let point = { type: "point", longitude: lon, latitude: lat };
    let simpleMarkerSymbol = {
      angle: "20px",
      type: "simple-marker",
      style: "square",
      // path: "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
      color: "coral",
      size: 8,
      outline: {
        // color: [226, 119, 40],
        color: "cornflowerblue",
        width: 0,
      },
      // yoffset: 1,
    };
    let pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol,
    });

    view.graphics.add(pointGraphic);
  }
});

let option = {
  animation: true,
  delay: 20000,
};

async function getWeather(lon, lat) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=cc19389ea496defe82b608ab55f05112`;
  const weather = await fetch(weatherURL);
  const weatherResponse = await weather.json();
  // console.log(`Get Weather: ${lon}, ${lat}`, weatherResponse);
  const obj = {
    name: weatherResponse.name,
    weather: weatherResponse.weather,
    main: weatherResponse.main,
  };
  return obj;
}

function showToast(lon, lat, address, temperature, weatherImg) {
  // toastBody.textContent = `${lon}, ${lat}\n${address}`;
  toastAddress.textContent = `${address}`;
  toastCoords.textContent = `${lon}, ${lat}`;
  toastTemperature.textContent = `${temperature}`;
  toastWeatherImg.src = `${weatherImg}`;
  // "http://openweathermap.org/img/wn/10d.png"
  let toastElement = new bootstrap.Toast(toastHTMLElement, option);
  toastElement.show();
}

function hideToast() {
  let toastElement = new bootstrap.Toast(toastHTMLElement, option);
  toastElement.hide();
}
