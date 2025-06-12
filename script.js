function main() {
  let movs = movimientos();
  let resultado = prepararIngresoGastos(movs.ingresos, movs.gastos);
  let balance = calcularBalance(movs.ingresos, movs.gastos);
  let final = prepararResumen(resultado, balance);
  alert(final);
}

function calcularBalance(ingresos, gastos) {
  let totalIngresos = ingresos.reduce((suma, item) => suma + item.monto, 0);
  let totalGastos = gastos.reduce((suma, item) => suma + item.monto, 0);
  let balance = totalIngresos - totalGastos;
  let resultado = [totalIngresos, totalGastos, balance];
  return resultado;
}

function prepararIngresoGastos(ingresos, gastos) {
  let resultado = "Ingresos:\n";
  ingresos.forEach((i) => (resultado += `- ${i.descripcion}: $${i.monto}\n`));
  resultado += "\nGastos:\n";
  gastos.forEach((g) => (resultado += `- ${g.descripcion}: $${g.monto}\n`));
  return resultado;
}

function movimientos() {
  let ingresos = [];
  let gastos = [];
  let entrada;
  while (true) {
    entrada = prompt(
      "Escribe 'ingreso' o 'gasto' para agregar, o 'fin' para terminar:"
    ).toLowerCase();
    if (entrada === "fin") break;
    if (entrada !== "ingreso" && entrada !== "gasto") {
      alert("Opción inválida. Por favor escribe 'ingreso', 'gasto' o 'fin'.");
      continue;
    }
    let descripcion = prompt(`Ingresa la descripción del ${entrada}:`);
    let monto = parseFloat(prompt(`Ingresa el monto del ${entrada}:`));
    if (isNaN(monto) || monto < 0) {
      alert("Monto inválido. Intenta de nuevo.");
      continue;
    }
    if (entrada === "ingreso") {
      ingresos.push({ descripcion, monto });
    } else {
      gastos.push({ descripcion, monto });
    }
  }
  return { ingresos, gastos };
}

function prepararResumen(resultado, balance) {
  let resumen = "Resumen de movimientos:\n";
  resumen += resultado;
  resumen += `\nTotal de ingresos: $${balance[0]}\n`;
  resumen += `Total de gastos: $${balance[1]}\n`;
  resumen += `Balance: $${balance[2]}\n`;
  return resumen;
}

function calculador() {
  let fisrt = true;
  alert("Bienvenido al sistema de gestión de ingresos y gastos.");
  alert(
    "Por favor, sigue las instrucciones para ingresar tus movimientos financieros."
  );
  while (fisrt) {
    main();
    let confirmacion = confirm(
      "¿Deseas continuar con el sistema de gestión de ingresos y gastos?"
    );
    if (confirmacion) {
      alert("Continuando con el sigiente ingreso de datos.");
      fisrt = true;
    } else {
      alert("Saliendo del sistema.");
      break;
    }
  }
}

calculador();
