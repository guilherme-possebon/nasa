const form = document.getElementById("impact-form");
const results = document.getElementById("results");

// Leaflet map
const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Fetch cities from Overpass API within radius
async function fetchCities(lat, lon, radius) {
  const query = `[out:json];
    node(around:${radius},${lat},${lon})["place"="city"];
    out body;`;
  const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
  const response = await fetch(url);
  const data = await response.json();
  return data.elements || [];
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const diameter = parseFloat(document.getElementById("diameter").value);
  const velocityKm = parseFloat(document.getElementById("velocity").value);
  const lat = parseFloat(document.getElementById("lat").value);
  const lon = parseFloat(document.getElementById("lon").value);

  // Physics
  const density = 3000; // kg/m³
  const radius = diameter / 2;
  const volume = (4/3) * Math.PI * Math.pow(radius, 3);
  const mass = density * volume;
  const velocity = velocityKm * 1000;
  const energy = 0.5 * mass * velocity * velocity; // Joules
  const tnt = energy / 4.184e9;

  // Blast radius (in meters)
  const blastRadius = diameter * 100;

  results.innerHTML = `
    <p>Mass: ${(mass/1e9).toFixed(2)} billion kg</p>
    <p>Impact Energy: ${(tnt/1e6).toFixed(2)} Megatons TNT</p>
    <p>Blast radius: ${(blastRadius/1000).toFixed(2)} km</p>
    <p>Loading affected cities...</p>
  `;

  // Clear map overlays
  map.eachLayer((layer) => {
    if (layer instanceof L.Circle || layer instanceof L.Marker) {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    }
  });

  // Add impact marker and circle
  L.marker([lat, lon]).addTo(map).bindPopup("Impact site").openPopup();
  L.circle([lat, lon], {
    radius: blastRadius,
    color: "red",
    fillOpacity: 0.3,
  }).addTo(map);

  map.setView([lat, lon], 3);

  try {
    const cities = await fetchCities(lat, lon, blastRadius);

    if (cities.length === 0) {
      results.innerHTML += "<p>No cities found in blast radius.</p>";
    } else {
      results.innerHTML += `<p>Affected cities: ${cities.map(c => c.tags.name).join(", ")}</p>`;

      cities.forEach(city => {
        L.marker([city.lat, city.lon])
          .addTo(map)
          .bindPopup(city.tags.name + " (affected)");
      });
    }
  } catch (error) {
    console.error(error);
    results.innerHTML += "<p>Error fetching cities data.</p>";
  }
});
