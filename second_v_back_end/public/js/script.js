// const socket = io()

// navigator.geolocation.watchPosition(success,error)
//let marker
// function success(position){
//     const lat =position.coords.latitude;
//     const lng =position.coords.latitude;
//     const accuracy=position.coords.accuracy
//     if(marker){
//      map.removelayer(marker)
//          }
//     L.marker([lat,lng]).addTo(map)

// }

// function error(err){
//     if(err.code===1){
//         alert("Please allow geolocation access")
//     }else{
//         alert("Cannot get current")
//     }

// }
const socket = io();

let currentMarker;
const map = L.map("map").setView([0, 0], 10); // Initial zoom level (temporary)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Code Man Corp",
    maxZoom: 30
}).addTo(map);

// Get current geolocation and set initial map view
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 16); // Adjust zoom level as needed

        // Create initial marker at current location
        currentMarker = L.marker([latitude, longitude]).addTo(map); // Use default marker

        // Emit initial location to server
        socket.emit("send_location", { latitude, longitude });
    }, (error) => {
        console.error(error);
    });
}

// Add a click event listener to the map:
map.on('click', (e) => {
    const { lat, lng } = e.latlng; // Get clicked coordinates

    // Update map view and socket location
    map.setView([lat, lng], 16); // Adjust zoom level as needed
    socket.emit("send_location", { latitude: lat, longitude: lng });

    // Update or create the marker for the current user
    if (currentMarker) {
        currentMarker.setLatLng([lat, lng]);
    } else {
        currentMarker = L.marker([lat, lng]).addTo(map); // Use default marker
    }

    // Reverse geocode the coordinates using Nominatim
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    fetch(nominatimUrl)
        .then(response => response.json())
        .then(data => {
            const address = data.address;
            console.log(address)
            const streetName = address.road || address.street;
            const neighbourhood = address.suburb || address.neighbourhood;
            console.log(`Clicked at: ${streetName}, ${address.city},${neighbourhood}, ${address.country},${lat},${lng}`);
        })
        .catch(error => console.error(error));
});