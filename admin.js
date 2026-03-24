// 🔐 USUARIO ACTUAL
let currentUser = localStorage.getItem("currentUser");
console.log("Usuario actual:", currentUser);

// 📦 ROLES Y EMPLEADOS
let roles = JSON.parse(localStorage.getItem("roles")) || {};
let empleados = JSON.parse(localStorage.getItem("empleados")) || {};

// 👑 =============================
// USUARIO PRINCIPAL
const OWNER = "Beax technology";
// 👑 =============================

// FORZAR SUPERADMIN
if (currentUser === OWNER) {
  roles[currentUser] = "superadmin";
}

// SI NO HAY ROLES, EL PRIMERO ES ADMIN
if (Object.keys(roles).length === 0 && currentUser) {
  roles[currentUser] = "admin";
}

// GUARDAR
localStorage.setItem("roles", JSON.stringify(roles));

// VALIDAR ACCESO
if (
  roles[currentUser] === "admin" ||
  roles[currentUser] === "superadmin"
) {
  document.getElementById("admin-content").style.display = "block";
} else {
  document.body.innerHTML = "<h2>Acceso denegado</h2>";
}

// 🎮 =============================
// AGREGAR JUEGO
// =============================
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

// 👥 =============================
// AGREGAR TRABAJADOR
// =============================
function agregarTrabajador() {
  const nombre = document.getElementById("nombre-completo").value;
  const usuario = document.getElementById("usuario-nuevo").value;
  const correo = document.getElementById("correo-nuevo").value;
  const rol = document.getElementById("rol-usuario").value;

  if (!nombre || !usuario || !correo) {
    alert("Completa todos los campos");
    return;
  }

  if (empleados[usuario]) {
    alert("Este usuario ya existe");
    return;
  }

  empleados[usuario] = {
    nombre: nombre,
    correo: correo,
    rol: rol
  };

  roles[usuario] = rol;

  localStorage.setItem("empleados", JSON.stringify(empleados));
  localStorage.setItem("roles", JSON.stringify(roles));

  alert("Trabajador agregado");

  limpiarCampos();
  renderTrabajadores();
}

// 👀 MOSTRAR TRABAJADORES
function renderTrabajadores() {
  const contenedor = document.getElementById("lista-trabajadores");

  if (!contenedor) return;

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

// ❌ ELIMINAR TRABAJADOR
function eliminarTrabajador(user) {
  if (roles[user] === "superadmin") {
    alert("No puedes eliminar al dueño 👑");
    return;
  }

  delete empleados[user];
  delete roles[user];

  localStorage.setItem("empleados", JSON.stringify(empleados));
  localStorage.setItem("roles", JSON.stringify(roles));

  alert("Empleado eliminado");

  renderTrabajadores();
}

// 🧹 LIMPIAR CAMPOS
function limpiarCampos() {
  document.getElementById("nombre-completo").value = "";
  document.getElementById("usuario-nuevo").value = "";
  document.getElementById("correo-nuevo").value = "";
}

// 🔐 =============================
// FINANZAS
// =============================
const PASSWORD_ADMIN = "beaxcrac12";

function entrarFinanzas() {
  const pass = prompt("Contraseña de seguridad:");

  if (pass === PASSWORD_ADMIN) {
    window.location.href = "finanzas.html";
  } else {
    alert("Contraseña incorrecta");
  }
}

// INICIAR
renderTrabajadores();
