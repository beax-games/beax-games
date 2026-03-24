let currentUser = localStorage.getItem("currentUser");
console.log("Usuario actual:", currentUser);
const games = [
  {
  name: "cyber ball",
  price: 200,
  image: "https://picsum.photos/200/120?4",
  description: "Batallas espaciales épicas contra flotas enemigas.",
  category: "Acción",
  platform: "PC",
  developer: "BEAX Studios",
  release: "2025",
  images: [
    "https://picsum.photos/500/300?4",
    "https://picsum.photos/500/300?44",
    "https://picsum.photos/500/300?444"
  
  ]
},
  {
  name: "outside house",
  price: 200,
  image: "https://picsum.photos/200/120?4",
  description: "Batallas espaciales épicas contra flotas enemigas.",
  category: "Acción",
  platform: "PC",
  developer: "BEAX Studios",
  release: "2025",
  images: [
    "https://picsum.photos/500/300?4",
    "https://picsum.photos/500/300?44",
    "https://picsum.photos/500/300?444"
  ]
},
  {
    name: "Neon Battle",
    price: 90,
    image: "https://picsum.photos/200/120?3",
    description: "Combates futuristas con luces neón y acción rápida.",
    category: "Acción",
    platform: "PC",
    developer: "BEAX Studios",
    release: "2025",
    badge: "⭐ Top",
    images: [
  "https://picsum.photos/500/300?1",
  "https://picsum.photos/500/300?2",
  "https://picsum.photos/500/300?3"
]
  },
  {
  name: "Galaxy War",
  price: 200,
  image: "https://picsum.photos/200/120?4",
  description: "Batallas espaciales épicas contra flotas enemigas.",
  category: "Acción",
  platform: "PC",
  developer: "BEAX Studios",
  release: "2025",
  images: [
    "https://picsum.photos/500/300?4",
    "https://picsum.photos/500/300?44",
    "https://picsum.photos/500/300?444"
  ]
},
  {
  name: "Zombie escape",
  price: 200,
  image: "https://picsum.photos/200/120?4",
  description: "Batallas espaciales épicas contra flotas enemigas.",
  category: "Acción",
  platform: "PC",
  developer: "BEAX Studios",
  release: "2025",
  images: [
    "https://picsum.photos/500/300?4",
    "https://picsum.photos/500/300?44",
    "https://picsum.photos/500/300?444"
  ]
},
  {
  name: "Racing X",
  price: 200,
  image: "https://picsum.photos/200/120?4",
  description: "Batallas espaciales épicas contra flotas enemigas.",
  category: "Acción",
  platform: "PC",
  developer: "BEAX Studios",
  release: "2025",
  images: [
    "https://picsum.photos/500/300?4",
    "https://picsum.photos/500/300?44",
    "https://picsum.photos/500/300?444"
  ]
},
];

const nombre = localStorage.getItem("juegoSeleccionado");
const game = games.find(g => g.name === nombre);

const container = document.getElementById("game-info");

if (!game) {
  container.innerHTML = "<p>Error cargando juego</p>";
} else {
  container.innerHTML = `
  <div class="game-page">

    <div class="left">

      <img id="main-img" src="${game.images?.[0] || game.image}" class="game-banner">

      <div class="carousel">
        ${(game.images || [game.image]).map(img => `
          <img src="${img}" onclick="cambiarImagen('${img}')">
        `).join("")}
      </div>

      ${game.video ? `
        <iframe class="video"
          src="${game.video.replace("watch?v=", "embed/")}"
          frameborder="0"
          allowfullscreen>
        </iframe>
      ` : ""}

    </div>

    <div class="game-details">
      <h2>${game.name}</h2>
      <p class="price">$${game.price} MXN</p>
      <p class="description">${game.description}</p>
      <button id="boton-juego" class="main-btn"></button>
    </div>

  </div>
`;
}

function cambiarImagen(src) {
  document.getElementById("main-img").src = src;
}

// BOTÓN INTELIGENTE
const boton = document.getElementById("boton-juego");

if (boton) {
  boton.addEventListener("click", () => {
    let estado = juegos[nombre];

    if (estado === "no-comprado") {
      juegos[nombre] = "comprado";
      mostrarNotificacion("Comprado 🤑");
    } 
    else if (estado === "comprado") {
      mostrarNotificacion("Instalando... ⏳");
      juegos[nombre] = "instalado";
    } 
    else {
      mostrarNotificacion("Iniciando juego 🎮");
    }

    localStorage.setItem("juegos", JSON.stringify(juegos));
    actualizarBoton();
  });
}

let juegos = JSON.parse(localStorage.getItem("juegos")) || {};

if (!juegos[nombre]) {
  juegos[nombre] = "no-comprado";
}

function actualizarBoton() {
  let estado = juegos[nombre];

  if (estado === "no-comprado") {
    boton.textContent = "Comprar";
  } else if (estado === "comprado") {
    boton.textContent = "Instalar";
  } else {
    boton.textContent = "Jugar";
  }
}

boton.addEventListener("click", () => {
  let estado = juegos[nombre];

  if (estado === "no-comprado") {
    juegos[nombre] = "comprado";
    mostrarNotificacion("Comprado 🤑");
  } 
  else if (estado === "comprado") {
    mostrarNotificacion("Instalando... ⏳");
    juegos[nombre] = "instalado";
  } 
  else {
    mostrarNotificacion("Iniciando juego 🎮");
  }

  localStorage.setItem("juegos", JSON.stringify(juegos));
  actualizarBoton();
});

actualizarBoton();

function cambiarImagen(src) {
  document.getElementById("main-image").src = src;
}
