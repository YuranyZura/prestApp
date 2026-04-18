let map;
let marcador;

function iniciarMapa() {
    if (!navigator.geolocation) {
        alert("Tu navegador no soporta ubicación");
        return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
        const ubicacion = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };

        map = new google.maps.Map(document.getElementById("map"), {
            center: ubicacion,
            zoom: 15
        });

        marcador = new google.maps.Marker({
            position: ubicacion,
            map,
            title: "Tu ubicación",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });

        cargarClientes();

        setInterval(actualizarUbicacion, 10000);
    });
}

// 📍 Actualiza ubicación
function actualizarUbicacion() {
    navigator.geolocation.getCurrentPosition((pos) => {
        const nueva = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };

        marcador.setPosition(nueva);

        fetch("/api/rutas/ubicacion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nueva)
        });
    });
}

// 📍 Clientes en mapa
async function cargarClientes() {
    try {
        const res = await fetch("/api/rutas/hoy");
        const clientes = await res.json();

        clientes.forEach(c => {
            const marker = new google.maps.Marker({
                position: { lat: c.lat, lng: c.lng },
                map,
                title: c.nombre
            });

            const info = new google.maps.InfoWindow({
                content: `
                    <strong>${c.nombre}</strong><br>
                    <button onclick="alert('Pago registrado')">Cobrar</button>
                `
            });

            marker.addListener("click", () => info.open(map, marker));
        });

    } catch (err) {
        console.error(err);
    }
}

window.onload = iniciarMapa;