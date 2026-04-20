// mapa.js - Optimizado para Android WebView

let map;
let marcadorUsuario;
let watchId;

// Inicializar mapa
function initMap() {
    const defaultLocation = { lat: 7.12539, lng: -73.1198 }; // Puedes cambiar (Colombia ejemplo)

    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });

    // Marcador inicial
    marcadorUsuario = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Ubicación actual",
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    });

    obtenerUbicacion();
}

// Obtener ubicación en tiempo real
function obtenerUbicacion() {
    if (!navigator.geolocation) {
        alert("Tu dispositivo no soporta geolocalización");
        return;
    }

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const nuevaPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            actualizarUbicacion(nuevaPos);
        },
        (error) => {
            console.error("Error de ubicación:", error);
            manejarErrorUbicacion(error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }
    );
}

// Actualizar marcador y mapa
function actualizarUbicacion(posicion) {
    if (!map || !marcadorUsuario) return;

    marcadorUsuario.setPosition(posicion);
    map.panTo(posicion);
}

// Manejo de errores
function manejarErrorUbicacion(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Permiso de ubicación denegado");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Ubicación no disponible");
            break;
        case error.TIMEOUT:
            alert("Tiempo de espera agotado");
            break;
        default:
            alert("Error desconocido");
    }
}

// Detener seguimiento (opcional)
function detenerUbicacion() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
}

// Esperar a que cargue todo
window.addEventListener("load", () => {
    if (typeof google !== "undefined") {
        initMap();
    } else {
        console.error("Google Maps no cargó");
    }
});