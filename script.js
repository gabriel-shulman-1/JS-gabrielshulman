let registrosDisponibles = document.getElementById("registrosDisponibles");
let b = 1;
let numeroMov;
let descripcion;
let tipoDeMov;
let montoRegistro;
let nRegistro;
let registroF1;
let a;

//funciones principales

function guardarRegistro() {
  let prevRegistros;
  let movimientosMenusales = [];
  let agregarMovimiento = document.getElementById("agregar_mov");
  let finalizarRegistro = document.getElementById("finalizar_mov");
  let descripcion = document.getElementById("descripcion");
  let monto = document.getElementById("monto");
  let form = document.getElementById("movimiento-form");
  const selectTipo = document.getElementById("tipo");
  agregarMovimiento.addEventListener("click", () => {
    if (descripcion.value == "" || monto.value == "") {
      showToast("Atencion", "Faltan datos a ingresar");
    } else {
      a++;
      let nMovimiento = new registro(
        selectTipo.value,
        descripcion.value,
        Number(monto.value)
      );
      movimientosMenusales.push(nMovimiento);
      console.log(nMovimiento);
      form.reset();
    }
  });
  finalizarRegistro.addEventListener("click", () => {
    if (a == 1) {
      showToast("Atencion", "No ingresaste ningun registro");
    } else {
      form.reset();
      registroF1 = JSON.stringify([movimientosMenusales]);
      localStorage.setItem("registro" + b.toString(), registroF1);
      a = 1;
      if (localStorage.getItem("registros") == null) {
        localStorage.setItem(
          "registros",
          JSON.stringify(["registro" + b.toString()])
        );
      } else {
        prevRegistros = JSON.parse(localStorage.getItem("registros"));
        prevRegistros.push("registro" + b.toString());
        localStorage.setItem("registros", JSON.stringify(prevRegistros));
      }
      mostrarRegistrosDisponibles();
      b++;
      movimientosMenusales = [];
    }
  });
}

function crearResumen(key) {
  let totalIngresos = 0;
  let totalGastos = 0;
  const registrosStr = localStorage.getItem(key);
  const registrosArr = JSON.parse(registrosStr);
  const registros = Array.isArray(registrosArr[0])?registrosArr[0]:registrosArr;
  registros.forEach((registro) => {
    if (registro.tipo === "true") {
      totalIngresos += registro.monto;
    } else {
      totalGastos += registro.monto;
    }
  });
  document.getElementById("total-ingresos").textContent = totalIngresos;
  document.getElementById("total-gastos").textContent = totalGastos;
  document.getElementById("balance").textContent = totalIngresos - totalGastos;
  crearTablaRegistros(key)
}

function mostrarRegistrosDisponibles() {
  const lista = document.getElementById("lista-registros");
  const registrosStr = localStorage.getItem("registros");
  if (!registrosStr) {
    const li = document.createElement("li");
    li.textContent = "no hay registros aun";
    lista.appendChild(li);
    return;
  } else {
    const registros = JSON.parse(registrosStr);
    lista.innerHTML = registros
      .map(
        (registroKey) =>
          `<li><button id="${registroKey}" class="btn btn-primary" onclick="crearResumen('${registroKey}')">${registroKey}</button></li>`
      )
      .join("");
  }
}

//helpers

function manejarEstadoSelectTipo() {
  const selectTipo = document.getElementById("tipo");
  selectTipo.addEventListener("change", () => {
    if (selectTipo.value == true) {
      return true;
    } else {
      return false;
    }
  });
}

function showToast(toastTitle, toastError) {
  const toastElement = document.getElementById("toastAlert");
  const titleElem = document.getElementById("errorTittle");
  const bodyElem = document.getElementById("errorDesc");
  titleElem.innerHTML = "<p>" + toastTitle + "</p>";
  bodyElem.innerHTML = "<p>" + toastError + "</p>";
  const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
  toast.show();
}

function crearTablaRegistros(key) {
  const registrosStr = localStorage.getItem(key);
  const registrosArr = JSON.parse(registrosStr);
  const cont = document.getElementById("resumen-general")
  cont.innerHTML = ""
  const table = document.createElement("table");
  table.className = "table table-striped";
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Ingreso/Gasto</th>
      <th>Descripción</th>
      <th>Monto</th>
    </tr>
  `;
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  registrosArr[0].forEach((registro) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${registro.tipo === "true" ? "Ingreso" : "Gasto"}</td>
      <td>${registro.descripcion}</td>
      <td>${registro.monto}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  cont.appendChild(table)
}

class registro {
  constructor(tipo, descripcion, monto) {
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.monto = monto;
  }
}

//ejecutar modulos

function ejecutar() {
  guardarRegistro();
  mostrarRegistrosDisponibles();
}

ejecutar();
