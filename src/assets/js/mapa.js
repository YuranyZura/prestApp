// mapa.js - PrestApp Profesional Android WebView

let map;
let markerUsuario;
let watchId;
let polylineRuta;
let puntosRuta = [];

const DEFAULT_LOCATION = {
    lat: 7.12539,
    lng: -73.1198
};

// ===============================
// INICIAR MAPA
// ===============================
function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        center: DEFAULT_LOCATION,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true
    });

    markerUsuario = new google.maps.Marker({
        position: DEFAULT_LOCATION,
        map: map,
        title: "Mi ubicación",
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    });

    polylineRuta = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: "#0d6efd",
        strokeOpacity: 1.0,
        strokeWeight: 5
    });

    polylineRuta.setMap(map);

    iniciarGPS();
}

// ===============================
// INICIAR GPS
// ===============================
function iniciarGPS() {

    if (!navigator.geolocation) {
        mostrarMensaje("Tu dispositivo no soporta GPS");
        return;
    }

    watchId = navigator.geolocation.watchPosition(
        exitoGPS,
        errorGPS,
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

// ===============================
// GPS EXITOSO
// ===============================
function exitoGPS(position) {

    const nuevaPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    actualizarMapa(nuevaPos);

    enviarServidor(nuevaPos);
}

// ===============================
// ACTUALIZAR MAPA
// ===============================
function actualizarMapa(pos) {

    markerUsuario.setPosition(pos);

    map.setCenter(pos);

    puntosRuta.push(pos);

    polylineRuta.setPath(puntosRuta);
}

// ===============================
// ERROR GPS
// ===============================
function errorGPS(error) {

    switch (error.code) {

        case error.PERMISSION_DENIED:
            mostrarMensaje("Permiso GPS denegado");
            break;

        case error.POSITION_UNAVAILABLE:
            mostrarMensaje("Ubicación no disponible");
            break;

        case error.TIMEOUT:
            mostrarMensaje("Tiempo agotado");
            break;

        default:
            mostrarMensaje("Error GPS");
    }
}

// ===============================
// ENVIAR AL BACKEND
// ===============================
function enviarServidor(pos) {

    fetch("https://tuservidor.com/api/ubicacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            latitud: pos.lat,
            longitud: pos.lng,
            trabajador_id: 1
        })
    })
    .then(r => r.json())
    .then(data => {
        console.log("Ubicación enviada");
    })
    .catch(err => {
        console.error("Sin internet", err);
    });
}

// ===============================
// MENSAJE
// ===============================
function mostrarMensaje(msg) {
    alert(msg);
}

// ===============================
// DETENER GPS
// ===============================
function detenerGPS() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
}

// ===============================
// AL CARGAR
// ===============================
window.onload = () => {

    if (typeof google !== "undefined") {
        initMap();
    } else {
        mostrarMensaje("Google Maps no cargó");
    }
};