let ingresos = [];
let gastos = [];
let input;

while (true) {
    input = prompt("Enter 'ingreso' or 'gasto' to add, or 'end' to finish:").toLowerCase();
    if (input === "end") break;
    if (input !== "ingreso" && input !== "gasto") {
        alert("Invalid option. Please enter 'ingreso', 'gasto', or 'end'.");
        continue;
    }
    let desc = prompt(`Enter ${input} description:`);
    let monto = parseFloat(prompt(`Enter ${input} amount:`));
    if (isNaN(monto) || monto < 0) {
        alert("Invalid amount. Try again.");
        continue;
    }
    if (input === "income") {
        ingresos.push({ desc, monto });
    } else {
        gastos.push({ desc, monto });
    }
}

let totalIngresos = ingresos.reduce((sum, item) => sum + item.monto, 0);
let totalGastos = gastos.reduce((sum, item) => sum + item.monto, 0);
let balance = totalIncome - totalGastos;

let result = "ingreso:\n";
ingresos.forEach(i => result += `- ${i.desc}: $${i.monto}\n`);
result += "\ngastos:\n";
gastos.forEach(b => result += `- ${b.desc}: $${b.monto}\n`);
result += `\nTotal Income: $${totalIngresos}\nTotal gastos: $${totalGastos}\nBalance: $${balance}`;

alert(result);