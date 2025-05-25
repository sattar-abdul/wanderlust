const Key = maptilerKey; //key comming from show.ejs

//show New Map
const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets/style.json?key=${Key}`,
  center: listing.geometry.coordinates, // [Longitude, Latitude]
  zoom: 10,
});

//custom marker for map
const el = document.createElement('div');
el.className = 'custom-marker';
el.innerHTML = '<i class="fa-solid fa-house"></i>';


//Adding marker pointing to location
const marker = new maplibregl.Marker({ element: el })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maplibregl.Popup({ offset: 25 }).setHTML(
      `<H5>${listing.location}</H5> <P>Exact location provided after booking.</P>`
    )
  )
  .addTo(map);
