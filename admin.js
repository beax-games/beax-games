console.log("Usuario actual:", currentUser);
// 🔐 VERIFICAR ACCESO
let currentUser = localStorage.getItem("currentUser");
let roles = JSON.parse(localStorage.getItem("roles")) || {};

// primer admin automático
if (Object.keys(roles).length === 0 && currentUser) {
  roles[currentUser] = "admin";
  if (roles[user] === "owner") {
  alert("No puedes eliminar al dueño");
  return;
}
  localStorage.setItem("roles", JSON.stringify(roles));
}

// validar acceso
if (roles[currentUser] === "admin") {
  document.getElementById("admin-content").style.display = "block";
} else {
  document.body.innerHTML = "<h2>Acceso denegado</h2>";
}

// 🎮 AGREGAR JUEGO
function agregarJuego() {
  let games = JSON.parse(localStorage.getItem("games")) || [];

  const nuevo = {
    name: document.getElementById("game-name").value,
    price: document.getElementById("game-price").value,
    images: [
      document.getElementById("img1").value,
      document.getElementById("img2").value,
      document.getElementById("img3").value
    ],
    video: document.getElementById("video").value,
    description: document.getElementById("game-desc").value
  };

  games.push(nuevo);

  localStorage.setItem("games", JSON.stringify(games));

  alert("Juego creado 🚀");

  location.reload();
}
// 👥 AGREGAR WORKER
function agregarWorker() {
  const nombre = document.getElementById("worker-name").value;
  const rol = document.getElementById("worker-role").value;

  roles[nombre] = rol;

  localStorage.setItem("roles", JSON.stringify(roles));

  renderWorkers();
}

// 👥 MOSTRAR WORKERS
function renderWorkers() {
  const cont = document.getElementById("lista-workers");
  cont.innerHTML = "";

  Object.keys(roles).forEach(user => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p>${user} - ${roles[user]}</p>
      <button onclick="eliminarWorker('${user}')">Eliminar</button>
    `;

    cont.appendChild(div);
  });
}

// ❌ ELIMINAR
function eliminarWorker(user) {
  delete roles[user];

  localStorage.setItem("roles", JSON.stringify(roles));

  renderWorkers();
}

renderWorkers();

function crearTrabajador() {
  let workers = JSON.parse(localStorage.getItem("workers")) || {};
  let roles = JSON.parse(localStorage.getItem("roles")) || {};

  const user = document.getElementById("worker-user").value;

  workers[user] = {
    nombre: document.getElementById("worker-name").value,
    correo: document.getElementById("worker-email").value
  };

  roles[user] = document.getElementById("worker-role").value;

  localStorage.setItem("workers", JSON.stringify(workers));
  localStorage.setItem("roles", JSON.stringify(roles));

  renderWorkers();
}

const PASSWORD_ADMIN = "beaxcrac12";

function entrarFinanzas() {
  const pass = prompt("Contraseña de seguridad:");

  if (pass === "beaxcrac12") {
    window.location.href = "finanzas.html";
  } else {
    mostrarNotificacion("Contraseña incorrecta", "error");
  }
}

function verFinanzas() {
  const pass = document.getElementById("admin-pass").value;

  if (pass !== PASSWORD_ADMIN) {
    alert("Contraseña incorrecta");
    return;
  }

  const cont = document.getElementById("finanzas");

  let compras = JSON.parse(localStorage.getItem("compras")) || [];

  let total = 0;

  compras.forEach(c => {
    total += Number(c.price);
  });

  cont.innerHTML = `
    <h3>Total ganado: $${total} MXN</h3>

    <table border="1" style="width:100%; margin-top:10px; color:white;">
      <tr>
        <th>Usuario</th>
        <th>Juego</th>
        <th>Precio</th>
      </tr>

      ${compras.map(c => `
        <tr>
          <td>${c.user}</td>
          <td>${c.game}</td>
          <td>$${c.price}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

document.getElementById("btn-finanzas").addEventListener("click", () => {
  const pass = document.getElementById("admin-pass").value;

  if (pass !== "1234") {
    alert("Contraseña incorrecta");
    return;
  }

  const cont = document.getElementById("finanzas");

  let compras = JSON.parse(localStorage.getItem("compras")) || [];

  if (compras.length === 0) {
    cont.innerHTML = "<p>No hay ventas aún</p>";
    return;
  }

  let total = 0;

  compras.forEach(c => total += Number(c.price));

  cont.innerHTML = `
    <h3>Total ganado: $${total} MXN</h3>

    <table border="1" style="width:100%">
      <tr>
        <th>Usuario</th>
        <th>Juego</th>
        <th>Precio</th>
      </tr>

      ${compras.map(c => `
        <tr>
          <td>${c.user}</td>
          <td>${c.game}</td>
          <td>$${c.price}</td>
        </tr>
      `).join("")}
    </table>
  `;
});

function agregarTrabajador() {
  const nombre = document.getElementById("nombre-completo").value;
  const usuario = document.getElementById("usuario-nuevo").value;
  const correo = document.getElementById("correo-nuevo").value;
  const rol = document.getElementById("rol-usuario").value;

  if (!nombre || !usuario || !correo) {
    mostrarNotificacion("Completa todos los campos", "error");
    return;
  }

  if (empleados[usuario]) {
    mostrarNotificacion("Este usuario ya existe", "error");
    return;
  }

  // guardar empleado
  empleados[usuario] = {
    nombre: nombre,
    correo: correo,
    rol: rol
  };

  roles[usuario] = rol;

  localStorage.setItem("empleados", JSON.stringify(empleados));
  localStorage.setItem("roles", JSON.stringify(roles));

  mostrarNotificacion("Trabajador agregado");

  limpiarCampos();
  renderTrabajadores();
}

function renderTrabajadores() {
  const contenedor = document.getElementById("lista-trabajadores");

  contenedor.innerHTML = "";

  for (let user in empleados) {
    const emp = empleados[user];

    const div = document.createElement("div");

    div.innerHTML = `
      <p><b>${emp.nombre}</b> (${user})</p>
      <p>${emp.correo}</p>
      <p>Rol: ${emp.rol}</p>
      <button onclick="eliminarTrabajador('${user}')">Eliminar</button>
      <hr>
    `;

    contenedor.appendChild(div);
  }
}

function eliminarTrabajador(user) {
  if (roles[user] === "superadmin") {
    mostrarNotificacion("No puedes eliminar al dueño 👑", "error");
    return;
  }

  delete empleados[user];
  delete roles[user];

  localStorage.setItem("empleados", JSON.stringify(empleados));
  localStorage.setItem("roles", JSON.stringify(roles));

  mostrarNotificacion("Empleado eliminado");

  renderTrabajadores();
}

function limpiarCampos() {
  document.getElementById("nombre-completo").value = "";
  document.getElementById("usuario-nuevo").value = "";
  document.getElementById("correo-nuevo").value = "";
}

// iniciar
renderTrabajadores();
