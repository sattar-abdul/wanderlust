const Key = window.maptilerKey; //key comming from show.ejs
const coords = window.coordinates;

const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets/style.json?key=${Key}`,
  center: coords, // [Longitude, Latitude]
  zoom: 10,
});

const marker = new maplibregl.Marker()
  .setLngLat(coords)
  .addTo(map);