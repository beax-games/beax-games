let currentUser = localStorage.getItem("currentUser");
console.log("Usuario actual:", currentUser);
let games = JSON.parse(localStorage.getItem("games"));

if (!games || games.length === 0) {
  games = [
    {
     name: "Resident Evil Requiem",
  price: 787,
  image: "URL_IMAGEN",
  link: "https://www.g2a.com/n/residentevilre9uiem"
    },
    {
      name: "outside house",
      price: 100,
      image: "https://picsum.photos/200/120?4"
    },
    {
      name: "Neon Battle",
      price: 90,
      image: "https://picsum.photos/200/120?3",
      badge: "⭐ Top"
    },
    {
      name: "Galaxy War",
      price: 200,
      image: "https://picsum.photos/200/120?4"
    },
    {
      name: "Zombie Escape",
      price: 80,
      image: "https://picsum.photos/200/120?5"
    },
    {
      name: "Racing X",
      price: 110,
      image: "https://picsum.photos/200/120?6"
    }
  ];
}

// USUARIO
let libraries = JSON.parse(localStorage.getItem("libraries")) || {};

// ELEMENTOS
const container = document.getElementById("games-container");
const libraryContainer = document.getElementById("library");

// TIENDA
function renderStore() {
  container.innerHTML = "";

  games.forEach(game => {
    const div = document.createElement("div");
    div.classList.add("game");

    div.onclick = () => verJuego(game.name);

    const button = document.createElement("button");
    button.textContent = "Comprar";

   button.onclick = (e) => {
  e.stopPropagation();

  if (game.link) {
    window.open(game.link, "_blank");
  } else {
    mostrarNotificacion("Próximamente disponible");
  }
};
    div.innerHTML = `
      <img src="${game.image}">
      <h3>${game.name}</h3>
      <p>$${game.price} MXN</p>
    `;

    div.appendChild(button);

    container.appendChild(div);
  });

  renderFeatured();
}
// DESTACADO
function renderFeatured() {
  const featured = document.getElementById("featured-game");

  const game = games[0];

  featured.innerHTML = `
    <h2>${game.name}</h2>
    <p>El más popular de BEAX</p>
    <h3>$${game.price} MXN</h3>
    <button onclick="verJuego('${game.name}')">Ver</button>
  `;
}

function verJuego(nombre) {
  localStorage.setItem("juegoSeleccionado", nombre);
  window.location.href = "game.html";
}

// COMPRAR
function buyGame(name) {
  let compras = JSON.parse(localStorage.getItem("compras")) || [];

compras.push({
  user: currentUser,
  game: name,
  price: games.find(g => g.name === name).price
});

localStorage.setItem("compras", JSON.stringify(compras));
  if (!currentUser) {
    mostrarNotificacion("Inicia sesión primero", "error");
    return;
  }

  if (!libraries[currentUser]) {
    libraries[currentUser] = [];
  }

  if (!libraries[currentUser].includes(name)) {
    libraries[currentUser].push(name);
    localStorage.setItem("libraries", JSON.stringify(libraries));
  

    // 🔥 SISTEMA DE VENTAS
    let ventas = JSON.parse(localStorage.getItem("ventas")) || {};

    if (!ventas[name]) {
      ventas[name] = {
        total: 0,
        ultimaVenta: Date.now()
      };
    }

    ventas[name].total += 1;
    ventas[name].ultimaVenta = Date.now();

    localStorage.setItem("ventas", JSON.stringify(ventas));

    mostrarNotificacion("Compraste " + name);

    renderLibrary();
    renderMasVendidos(); // 🔥 IMPORTANTE
  } else {
    mostrarNotificacion("Ya tienes este juego");
  }
}

// BIBLIOTECA
function renderLibrary() {
  libraryContainer.innerHTML = "";

  if (!currentUser) {
    libraryContainer.innerHTML = "Inicia sesión";
    return;
  }

  const userGames = libraries[currentUser] || [];

  userGames.forEach(name => {
    const div = document.createElement("div");
    div.classList.add("library-game");

    div.innerHTML = `
      <p>${name}</p>
      <button onclick="alert('Simulando descarga 🎮')">Descargar</button>
    `;

    libraryContainer.appendChild(div);
  });
}

// USUARIO UI
function updateUserUI() {
  const panel = document.getElementById("user-panel");

  if (currentUser) {
    panel.innerHTML = `
      <div class="user-box">
        <p>👤 ${currentUser}</p>
        <button onclick="logout()">Cerrar sesión</button>
      </div>
    `;
  } else {
    panel.innerHTML = `
      <p>No has iniciado sesión</p>
    `;
  }
}

// LOGIN
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[u] && users[u].password === p) {

    // 🔥 FORZAR ADMIN
    let roles = JSON.parse(localStorage.getItem("roles")) || {};
    if (u.trim().toLowerCase() === "beax technology") {
      roles[u] = "owner";
      localStorage.setItem("roles", JSON.stringify(roles));
    }

    currentUser = u;
    localStorage.setItem("currentUser", u);

    updateUserUI();
    renderLibrary();
    mostrarNotificacion("Bienvenido " + u);

    // 🔐 REDIRECCIÓN ADMIN
    if (roles[u] === "admin" || roles[u] === "worker" || roles[u] === "owner") {
      window.location.href = "admin.html";
    }

  } else {
    mostrarNotificacion("Datos incorrectos", "error");
  }
}

// REGISTRO
function register() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const e = document.getElementById("email").value;

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[u]) {
    mostrarNotificacion("Usuario ya existe", "error");
    return;
  }

  users[u] = {
    password: p,
    email: e
  };

  let roles = JSON.parse(localStorage.getItem("roles")) || {};

  if (Object.keys(roles).length === 0) {
    roles[u] = "owner";
  } else {
    roles[u] = "user";
  }

  localStorage.setItem("roles", JSON.stringify(roles));
  localStorage.setItem("users", JSON.stringify(users));

  mostrarNotificacion("Usuario registrado");
}

// TABS
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

  if (tab === "store") {
    document.getElementById("store").classList.add("active");
    renderStore();
    renderTopGames();
  }

  if (tab === "library") {
    document.getElementById("libraryTab").classList.add("active");
    renderLibrary();
  }

  if (tab === "account") {
    document.getElementById("account").classList.add("active");
  }
}

// INICIO
updateUserUI();
showTab("store");
renderMasVendidos();

function filtrarJuegos() {
  const texto = document.getElementById("search").value.toLowerCase();

  const juegosFiltrados = games.filter(game =>
    game.name.toLowerCase().includes(texto)
  );

  container.innerHTML = "";

  juegosFiltrados.forEach(game => {
    const div = document.createElement("div");
    div.classList.add("game");

    div.innerHTML = `
      ${game.badge ? `<div class="badge">${game.badge}</div>` : ""}
      <img src="${game.image}">
      <h3>${game.name}</h3>
      <p>$${game.price} MXN</p>
      <button onclick="buyGame('${game.name}')">Comprar</button>
    `;

    div.onclick = () => verJuego(game.name);

    container.appendChild(div);
  });
}

function ordenarJuegos() {
  const tipo = document.getElementById("ordenar").value;

  let juegosOrdenados = [...games];

  if (tipo === "precio-asc") {
    juegosOrdenados.sort((a, b) => a.price - b.price);
  }

  if (tipo === "precio-desc") {
    juegosOrdenados.sort((a, b) => b.price - a.price);
  }

  if (tipo === "nombre") {
    juegosOrdenados.sort((a, b) => a.name.localeCompare(b.name));
  }

  container.innerHTML = "";

  juegosOrdenados.forEach(game => {
    const div = document.createElement("div");
    div.classList.add("game");

    div.innerHTML = `
      ${game.badge ? `<div class="badge">${game.badge}</div>` : ""}
      <img src="${game.image}">
      <h3>${game.name}</h3>
      <p>$${game.price} MXN</p>
      <button onclick="buyGame('${game.name}')">Comprar</button>
    `;

    div.onclick = () => verJuego(game.name);

    container.appendChild(div);
  });
}

function logout() {
  localStorage.removeItem("currentUser");
  currentUser = null;

  updateUserUI();
  renderLibrary();

  mostrarNotificacion("Sesión cerrada");
}

function mostrarNotificacion(mensaje, tipo = "ok") {
  const notif = document.getElementById("notificacion");

  notif.textContent = mensaje;

  // colores según tipo
  if (tipo === "error") {
    notif.style.background = "#ff4444";
    notif.style.color = "white";
  } else {
    notif.style.background = "#00ff88";
    notif.style.color = "black";
  }

  notif.classList.remove("ocultar");
  notif.classList.add("mostrar");

  setTimeout(() => {
    notif.classList.remove("mostrar");
    notif.classList.add("ocultar");
  }, 2500);
}

let sugerencias = JSON.parse(localStorage.getItem("sugerencias")) || [];

function enviarSugerencia() {
  const texto = document.getElementById("sugerencia").value;

  if (!texto) {
    mostrarNotificacion("Escribe algo", "error");
    return;
  }

  sugerencias.push(texto);

  localStorage.setItem("sugerencias", JSON.stringify(sugerencias));

  document.getElementById("sugerencia").value = "";

  mostrarNotificacion("Sugerencia enviada");

  renderSugerencias();
}

function renderSugerencias() {
  const contenedor = document.getElementById("lista-sugerencias");

  contenedor.innerHTML = "";

  sugerencias.forEach(s => {
    const div = document.createElement("div");
    div.textContent = s;
    contenedor.appendChild(div);
  });
}

renderSugerencias();

function renderTopGames() {
  const top = document.getElementById("top-games");

  top.innerHTML = "";

  const destacados = games.slice(0, 3);

  destacados.forEach(game => {
    const div = document.createElement("div");
    div.classList.add("game");

    div.innerHTML = `
      <img src="${game.image}">
      <h3>${game.name}</h3>
      <p>$${game.price} MXN</p>
    `;

    div.onclick = () => verJuego(game.name);

    top.appendChild(div);
  });
}

function renderMasVendidos() {
  const contenedor = document.getElementById("mas-vendidos");
  if (!contenedor) return;

  let ventas = JSON.parse(localStorage.getItem("ventas")) || {};

  // convertir a array
  let lista = Object.keys(ventas).map(nombre => ({
    name: nombre,
    total: ventas[nombre].total,
    ultimaVenta: ventas[nombre].ultimaVenta
  }));

  const ahora = Date.now();

  // ⛔ eliminar juegos sin ventas en 3 días
  lista = lista.filter(j => (ahora - j.ultimaVenta) < (3 * 24 * 60 * 60 * 1000));

  // 🔥 ordenar por ventas
  lista.sort((a, b) => b.total - a.total);

  // 🔥 solo top 5
  lista = lista.slice(0, 5);

  contenedor.innerHTML = "";

  lista.forEach(juego => {
    const gameData = games.find(g => g.name === juego.name);

    const div = document.createElement("div");
    div.classList.add("game");

    div.innerHTML = `
      <img src="${gameData?.image || ''}">
      <h3>${juego.name}</h3>
      <p>$${gameData?.price || ''} MXN</p>
      <p>🔥 ${juego.total} ventas</p>
    `;

    div.onclick = () => verJuego(juego.name);

    contenedor.appendChild(div);
  });
}

function irAdmin() {
  let roles = JSON.parse(localStorage.getItem("roles")) || {};

  if (!currentUser) return;

  if (roles[currentUser] === "admin" || roles[currentUser] === "owner") {
    window.location.href = "admin.html";
  }
  if (roles[currentUser] === "admin" || roles[currentUser] === "owner") {
    window.location.href = "admin.html";
  } else {
    mostrarNotificacion("No tienes acceso", "error");
  }
}

function abrirAdmin() {
  if (!currentUser) return;

  let roles = JSON.parse(localStorage.getItem("roles")) || {};

  const userRole = roles[currentUser];

  if (userRole === "superadmin" || userRole === "admin" || userRole === "worker") {
    window.location.href = "admin.html";
  }
}
