alert(result);
/* Versión en español usando let y textos en español */
let ingresos = [];
let gastos = [];
let entrada;

while (true) {
    entrada = prompt("Escribe 'ingreso' o 'gasto' para agregar, o 'fin' para terminar:").toLowerCase();
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

let totalIngresos = ingresos.reduce((suma, item) => suma + item.monto, 0);
let totalGastos = gastos.reduce((suma, item) => suma + item.monto, 0);
let balance = totalIngresos - totalGastos;

let resultado = "Ingresos:\n";
ingresos.forEach(i => resultado += `- ${i.descripcion}: $${i.monto}\n`);
resultado += "\nGastos:\n";
gastos.forEach(g => resultado += `- ${g.descripcion}: $${g.monto}\n`);
resultado += `\nTotal de ingresos: $${totalIngresos}\nTotal de gastos: $${totalGastos}\nBalance: $${balance}`;

alert(resultado);