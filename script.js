let registrosDisponibles = document.getElementById("registrosDisponibles");
let b = Math.floor(1000 + Math.random() * 9000);
let numeroMov;
let descripcion;
let tipoDeMov;
let montoRegistro;
let nRegistro;
let registroF1;
let a;

//API's

async function getCotizacionBlue(tipe) {
  try {
    const respuesta = await fetch("https://api.bluelytics.com.ar/v2/latest");
    const data = await respuesta.json();
    const dolar = data.blue.value_avg;
    const euro = data.blue_euro.value_avg;
    let cotizacion = [dolar, euro];
    return cotizacion;
  } catch (error) {
    console.error("Error al obtener la cotización:", error);
    return null;
  }
}

async function monedaExtranjera(monto, tipe) {
  const cotizacion = await getCotizacionBlue();
  let result;
  if (cotizacion && tipe) {
    result = monto / cotizacion[0];
    return result;
  } else if (cotizacion && !tipe) {
    result = monto / cotizacion[1];
    return result;
  } else {
    throw new Error("No se pudo obtener la cotización.");
  }
}

//Funciones principales

function guardarRegistro() {
  let prevRegistros;
  let movimientosMenusales = [];
  let form = document.getElementById("movimiento-form");
  const agregarMovimiento = document.getElementById("agregar_mov");
  const finalizarRegistro = document.getElementById("finalizar_mov");
  const selectTipo = document.getElementById("tipo");
  const descripcion = document.getElementById("descripcion");
  const monto = document.getElementById("monto");
  agregarMovimiento.addEventListener("click", () => {
    const desc = descripcion.value.trim();
    const montoVal = Number(monto.value);
    if (desc === "" || isNaN(montoVal) || montoVal <= 0) {
      showToast("Atencion", "Faltan datos a ingresar");
      console.log("shot");
      return;
    } else {
      let nMovimiento = new registro(selectTipo.value, desc, montoVal);
      movimientosMenusales.push(nMovimiento);
      form.reset();
    }
    form.reset();
  });
  finalizarRegistro.addEventListener("click", () => {
    if (movimientosMenusales.length === 0) {
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
  const registros = Array.isArray(registrosArr[0])
    ? registrosArr[0]
    : registrosArr;
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
  crearTablaRegistros(key);
  crearTablaRegistros(key);
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
    console.log(registros);
    lista.innerHTML = registros
      .map(
        (registroKey) =>
          `<li><button id="${registroKey}" class="btn btn-primary" onclick="crearResumen('${registroKey}')"><i class="bi bi-file-earmark"></i> ${registroKey}</button>
        <button class="btn btn-danger" onclick="borrarResumen('${registroKey}')"><i class="bi bi-trash"></i> Borrar</button></li>`
      )
      .join("");
  }
}

//helpers

function borrarResumen(registro) {
  localStorage.removeItem(registro);
  showToast("Atencion!", registro + " borrado.");
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros = registros.filter((r) => r !== registro);
  localStorage.setItem("registros", JSON.stringify(registros));
  mostrarRegistrosDisponibles();
  document.getElementById("resumen-general").innerHTML = "";
  document.getElementById("total-ingresos").textContent = "0";
  document.getElementById("total-gastos").textContent = "0";
  document.getElementById("balance").textContent = "0";
}

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
  const cont = document.getElementById("resumen-general");
  cont.innerHTML = "";
  const table = document.createElement("table");
  table.className = "table table-striped";
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Ingreso/Gasto</th>
      <th>Descripción</th>
      <th>Monto (Pesos)</th>
      <th><i class="bi bi-currency-dollar"></i></th>
      <th><i class="bi bi-currency-euro"></i></th>
    </tr>
  `;
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  registrosArr[0].forEach((registro) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${registro.tipo === "true" ? "Ingreso" : "Gasto"}</td>
      <td>${registro.descripcion}</td>
      <td>${registro.monto}$</td>
      <td><p class="dolar-value">Cargando...</p></td>
      <td><p class="euro-value">Cargando...</p></td>
    `;
    // Mostrar el resultado de monedaExtranjera en los <p>
    monedaExtranjera(registro.monto, true).then((dolar) => {
      tr.querySelector(".dolar-value").textContent = dolar
        ? dolar.toFixed(2)
        : "Error";
    });
    monedaExtranjera(registro.monto, false).then((euro) => {
      tr.querySelector(".euro-value").textContent = euro
        ? euro.toFixed(2)
        : "Error";
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  cont.appendChild(table);
  cont.appendChild(table);
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
  mostrarRegistrosDisponibles();
  guardarRegistro();
}

ejecutar();
