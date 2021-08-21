require([
  "esri/config",
  "esri/tasks/Locator",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Expand",
  "esri/widgets/LayerList",
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle",
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
  BasemapToggle,
  Graphic,
  FeatureLayer
) => {
  esriConfig.apiKey =
    "AAPK38d5964a655b48dbb8fb30fe5bc1098co28bAFzHHonjZPlh5QIp2DRruOGyamDWbvQJegvAQlvfxlKs94COtvB-ad44WdjI";

  const armedConflictLayer = new FeatureLayer(
    layersArray["armedConflictLayer"]
  );
  // map.add(featureLayer);

  let locatorTask = new Locator({
    url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
  });
  const map = new Map({
    basemap: "arcgis-topographic",
    // basemap: "arcgis-streets-night",
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
  const toggle = new BasemapToggle({
    view: view,
    nextBasemap: "arcgis-imagery",
  });

  var layerList = new LayerList({
    view: view,
    container: document.createElement("div"),
  });

  var bgExpand = new Expand({
    view: view,
    content: layerList.domNode,
    expandIconClass: "esri-icon-layer-list",
  });

  // view.popup.autoOpenEnabled = false;
  view.when(function () {
    // Add UI elements
    view.ui.add(searchWidget, { position: "top-right" });
    view.ui.add(toggle, { position: "bottom-left" });
    // view.ui.add(bgExpand, "bottom-right");
  });

  view.on("click", (event) => {
    // console.log(event);
    view.graphics.removeAll();
    const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
    const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
    dropPoint(event.mapPoint.longitude, event.mapPoint.latitude);

    locatorTask
      .locationToAddress({ location: event.mapPoint })
      .then(function (response) {
        // If an address is successfully found, show it in the popup's content
        // view.popup.content = response.address;
        console.log(response.address);
        showToast(
          event.mapPoint.longitude,
          event.mapPoint.latitude,
          response.address
        );
      })
      .catch(function (err) {
        // If the promise fails and no result is found, show a generic message
        console.log("No address was found for this location");
      });

    // dropPoint(event.mapPoint.longitude, event.mapPoint.latitude);
    // showToast(event.mapPoint.longitude, event.mapPoint.latitude);
  });

  // Functions
  function dropPoint(lon, lat) {
    // console.log(`dropPoint(), Lon: ${lon}, Lat: ${lat}`);
    let point = { type: "point", longitude: lon, latitude: lat };
    let simpleMarkerSymbol = {
      type: "simple-marker",
      style: "square",
      color: "blue",
      size: 8,
      outline: {
        // color: [226, 119, 40],
        color: "white",
        width: 1,
      },
      yoffset: 2,
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

function showToast(lon, lat, address) {
  toastBody.textContent = `${lon}, ${lat}\n${address}`;
  let toastElement = new bootstrap.Toast(toastHTMLElement, option);
  toastElement.show();
}

function hideToast() {
  let toastElement = new bootstrap.Toast(toastHTMLElement, option);
  toastElement.hide();
}
