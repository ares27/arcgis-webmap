const toastHTMLElement = document.getElementById("EpicToast");
const toastBody = document.querySelector(".toast-body");
const toastAddress = document.querySelector("#address");
const toastCoords = document.querySelector("#coords");
const toastTemperature = document.querySelector("#temperature");
const toastWeatherImg = document.querySelector("#weather-img");

let layersArray = [];
layersArray["armedConflictLayer"] = {
  url: "https://services.arcgis.com/LG9Yn2oFqZi5PnO5/arcgis/rest/services/Armed_Conflict_Location_Event_Data_ACLED/FeatureServer",
  popupTemplate: {
    title: "{admin1} - {admin2} - {event_type}",
    content: "<p>{notes}</p> " + "<small>{source}</small>",
    fieldInfos: [
      {
        fieldName: "event_type",
      },
      {
        fieldName: "OBJECTID",
        format: {
          places: 0,
          digitSeparator: true,
        },
      },
    ],
  },
  outFields: ["*"],
};
