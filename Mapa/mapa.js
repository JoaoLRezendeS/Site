const map = L.map('map').setView([-13.005587, -38.518158], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('clinicas.json')
  .then(response => response.json())
  .then(clinics => {
    const clinicList = document.getElementById("clinic-list");

    clinics.forEach(clinic => {
      const marker = L.marker([clinic.latitude, clinic.longitude])
        .addTo(map)
        .bindPopup(`
          <strong>${clinic.nome}</strong><br>
          ${clinic.servico}<br>
          <a href="${clinic.link}" target="_blank">📍 Ver no Google Maps</a>
        `);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar clínicas:", error);
  });
