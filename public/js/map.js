const Key = maptilerKey; //key comming from show.ejs
const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets/style.json?key=${Key}`,
  center: [77.209, 28.6139], // [Longitude, Latitude]
  zoom: 10,
});
