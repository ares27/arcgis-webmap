require([
  "esri/config",
  "esri/tasks/Locator",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle",
  "esri/Graphic",
], (esriConfig, Locator, Map, MapView, Search, BasemapToggle, Graphic) => {
  esriConfig.apiKey = apiKey;
  const locatorTask = new Locator({
    url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
  });

  const map = new Map({
    basemap: "arcgis-topographic",
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
  const toggle = new BasemapToggle({
    view: view,
    nextBasemap: "arcgis-imagery",
  });

  // Add UI elements
  view.ui.add(searchWidget, { position: "top-right" });
  view.ui.add(toggle, { position: "bottom-left" });

  // Events
  // view.popup.autoOpenEnabled = false;
  view.on("click", (event) => {
    // console.log(event);
    view.graphics.removeAll();
    const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
    const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
    dropPoint(event.mapPoint.longitude, event.mapPoint.latitude);
    showToast(event.mapPoint.longitude, event.mapPoint.latitude);
  });

  // Functions
  function dropPoint(lon, lat) {
    console.log(`dropPoint(), Lon: ${lon}, Lat: ${lat}`);
    let point = { type: "point", longitude: lon, latitude: lat };
    let simpleMarkerSymbol = {
      type: "simple-marker",
      path: "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
      color: "orange",
      size: 15,
      outline: {
        // color: [226, 119, 40],
        color: "darkorange",
        width: 1,
      },
      yoffset: 5,
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

function showToast(lon, lat) {
  toastBody.textContent = `${lon}, ${lat}`;
  let toastElement = new bootstrap.Toast(toastHTMLElement, option);
  toastElement.show();
}

function hideToast() {
  let toastElement = new bootstrap.Toast(toastHTMLElement, option);
  toastElement.hide();
}
