let registrosDisponibles = [];
let registros = [];

function main() {
  movimientos();
  mostrarRegistrosDisponibles()
}

//funciones principales
//registrar y guardar movimientos
//1
function movimientos() {
  let nRegistro,
    nMovimiento = 1;
  let tipo = document.getElementById("tipo");
  let descripcion = document.getElementById("descripcion");
  let monto = document.getElementById("monto");
  let agregarMovimiento = document.getElementById("agregar_mov");
  let finalizarRegistro = document.getElementById("finalizar_mov");
  agregarMovimiento.addEventListener("click", () => {
    if (descripcion.value == null || monto.value == null || monto.value <= 0) {
      showToast("Atencion", "faltan argumentos");
    } else {
      let newRegistro = new registro(
        tipo.value,
        descripcion.value,
        Number(monto.value)
      );
      registros.push(newRegistro);
      nMovimiento++;
    }
  });
  finalizarRegistro.addEventListener("click", () => {
    if (registros.length == 0) {
      showToast("Atencion", "debe haber al menos 1 registro");
    } else {
      localStorage.setItem(
        "registro" + (nRegistro++).toString(),
        JSON.stringify(registros)
      );
      registrosDisponibles.push("registro" + (nRegistro++).toString())
      showToast("Éxito", "Registro guardado en localStorage");
      registros = [];
    }
  });
}
//2
function calcularTotalesPorRegistro(registroKey) {
  let totalIngresos = 0;
  let totalGastos = 0;
  const registrosStr = localStorage.getItem(registroKey);
  if (!registrosStr) return { ingresos: 0, gastos: 0, saldo: 0 };
  const registros = JSON.parse(registrosStr);
  registros.forEach(registro => {
    if (registro.tipo === "ingreso") {
      totalIngresos += registro.monto;
    } else if (registro.tipo === "gasto") {
      totalGastos += registro.monto;
    }
  });
  return {
    ingresos: totalIngresos,
    gastos: totalGastos,
    saldo: totalIngresos - totalGastos
  };
}
document.getElementById("lista-registros")?.addEventListener("click", function(e) {
  if (e.target.tagName === "BUTTON") {
    const registroKey = e.target.id;
    const totales = calcularTotalesPorRegistro(registroKey);
    document.getElementById("total-ingresos").textContent = totales.ingresos;
    document.getElementById("total-gastos").textContent = totales.gastos;
    document.getElementById("balance").textContent = totales.saldo;
  }
});
//muestro los registros disponibles
//3
function mostrarRegistrosDisponibles() {
  const lista = document.getElementById("lista-registros");
  if (!lista) return;
  lista.innerHTML = "";
  if (registrosDisponibles.length === 0) {
    const li = document.createElement("li");
    li.textContent = "no hay registros aun";
    lista.appendChild(li);
  } else {
    lista.innerHTML = registrosDisponibles
      .map(
      registroKey =>
        `<li><button id="${registroKey}"class="btn btn-primary">${registroKey}</button></li>`
      )
      .join("");
  }
}

//Helpers

function showToast(toastTitle, toastError) {
  const toastElement = document.getElementById("toastAlert");
  const titleElem = document.getElementById("errorTittle");
  const bodyElem = document.getElementById("errorDesc");
  titleElem.innerHTML = "<p>" + toastTitle + "</p>";
  bodyElem.innerHTML = "<p>" + toastError + "</p>";
  const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
  toast.show();
}

class registro {
  constructor(tipo, descripcion, monto) {
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.monto = monto;
  }
}

main();
