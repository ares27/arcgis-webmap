require([
  "esri/tasks/Locator",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapToggle",
], (Locator, Map, MapView, BasemapToggle) => {
  const locatorTask = new Locator({
    url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
  });
  const map = new Map({
    basemap: "topo-vector",
  });
  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 7,
    center: [28.200526, -25.856598],
  });

  const toggle = new BasemapToggle({
    view: view,
    nextBasemap: "hybrid",
  });

  // UI
  view.ui.add(toggle, "top-right");

  // Events
  view.popup.autoOpenEnabled = false;
  view.on("click", (event) => {
    // console.log(event);
    const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
    const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

    view.popup.open({
      // Set the popup's title to the coordinates of the clicked location
      title: `Reverse geocode: [ Longitude: ${lon} , Latitude: ${lat} ]`,
      location: event.mapPoint, // Set the location of the popup to the clicked location
    });

    // coords.textContent = `Longitude: ${lon} , Latitude: ${lat}`;
  });
});
