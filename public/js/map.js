
  //   maptilersdk.config.apiKey = mapApiKey;
  //   const map = new maptilersdk.Map({
  //     container: 'map', // container's id or the HTML element in which the SDK will render the map
  //     style: maptilersdk.MapStyle.STREETS,
  //     center: [ 78.4772, 17.4065], // starting position [lng, lat]
  //     zoom: 14 // starting zoom
  //   });

  // console.log(coordinates);

  //   const marker = new maptilersdk.Marker()
  //     .setLngLat([12.550343, 55.665957])
  //     .addTo(map);

  maptilersdk.config.apiKey = mapApiKey;
const map = new maptilersdk.Map({
  container: 'map',
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, // Map centered on Hyderabad
  zoom: 14
});

console.log(listing.geometry.coordinates);

const marker = new maptilersdk.Marker({
  color: "red",
  draggable: false
})
  .setLngLat(listing.geometry.coordinates) // <--- Change marker coordinates to Hyderabad
  .setPopup(new maptilersdk.Popup().setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`))
  .addTo(map);