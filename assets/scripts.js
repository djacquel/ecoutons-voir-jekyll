
    // 1. Initialisation de la carte centrée sur Sarrey (Haute-Marne)
    const latSarrey = 48.0034;
    const lngSarrey = 5.427;
    
    const map = L.map('map').setView([latSarrey, lngSarrey], 15);

    // 2. Fond de carte OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // 3. Données des 6 étapes
    const etapes = [
      { id: "etape-1", number: 1, title: "Sarrey : L'origine du nom", lat: 48.0056, lng: 5.4384 },
      { id: "etape-2", number: 2, title: "La coutellerie", lat: 48.0031, lng: 5.429 },
      { id: "etape-3", number: 3, title: "Le cerisier de Jeanne", lat: 48.0051, lng: 5.4246 }
    ];

    // 4. Ajout des marqueurs des étapes
    etapes.forEach(etape => {
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color:#2e5a44; color:white; font-weight:bold; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3); font-size:12px;">${etape.number}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const popupContent = `
        <div style="text-align: center; font-family: sans-serif;">
          <strong>Étape ${etape.number}</strong><br>
          ${etape.title}<br>
          <a href="#${etape.id}" class="map-popup-link">Écouter &amp; Visualiser &rarr;</a>
        </div>
      `;

      L.marker([etape.lat, etape.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    // ==========================================
    // 5. GÉOLOCALISATION DE L'UTILISATEUR
    // ==========================================
    let userMarker = null;
    const geolocAlert = document.getElementById('geolocAlert');
    const retryGeolocBtn = document.getElementById('retryGeolocBtn');

    function requestGeoloc() {
      if (!navigator.geolocation) {
        showGeolocAlert();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Masquer la bannière en cas de succès
          geolocAlert.style.display = 'none';

          // Création ou mise à jour du pointeur de géolocalisation
          const userIcon = L.divIcon({
            className: 'user-position-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          if (userMarker) {
            userMarker.setLatLng([lat, lng]);
          } else {
            userMarker = L.marker([lat, lng], { icon: userIcon })
              .addTo(map)
              .bindPopup('<strong>Vous êtes ici</strong>');
          }

          // Ajuster la vue de la carte pour inclure la position de l'utilisateur
          map.setView([lat, lng], 16);
        },
        (error) => {
          // Si l'utilisateur me refuse la géolocalisation ou autre erreur
          showGeolocAlert();
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    function showGeolocAlert() {
      geolocAlert.style.display = 'flex';
    }

    // Lancement au chargement
    requestGeoloc();

    // Bouton pour relancer la demande d'autorisation de géolocalisation
    retryGeolocBtn.addEventListener('click', () => {
      requestGeoloc();
    });

/*
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("lat=" + position.coords.latitude + " lon=" + position.coords.longitude);
  });
} else {
  console.log("Geoloc KO")
}*/
