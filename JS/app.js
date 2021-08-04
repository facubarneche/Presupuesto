"use strict";

//Super Clase
class Dato {
    constructor({ descripcion, monto }) {
        this._descripcion = descripcion;
        this._monto = monto;
    }

    get descripcion() {
        return this._descripcion;
    }
    set descripcion(descripcion) {
        this._descripcion = descripcion;
    }
    get monto() {
        return this._monto;
    }
    set monto(monto) {
        this._monto = monto;
    }
}

//Clase Ingresos
class Ingreso extends Dato {
    static contador = 1;
    constructor({ descripcion, monto }) {
        super({ descripcion, monto })
        this._id = Ingreso.contador++;
    }
    get id() {
        return this._id;
    }
}

//Clase Egresos
class Egreso extends Dato {
    static contador = 1000;
    constructor({ descripcion, monto }) {
        super({ descripcion, monto })
        this._id = Egreso.contador++;
    }
    get id() {
        return this._id;
    }
}

//Variables
let ingresos = [];
let egresos = [];
let agregarEgresos = document.getElementById('agregar-egresos');
let agregarIngresos = document.getElementById('agregar-ingresos');
const agregar = document.getElementById('agregar'); //Boton agregar elemento a la lista
const borrarTodo = document.getElementById('borrarTodo');

//Cuentas del header
const disponible = () => {
    let ingresoTotal = document.getElementById('ingresoTotal');
    let egresoTotal = document.getElementById('egresoTotal');
    let disponible = document.getElementById('disponible');
    let total = 0;
    let totalE = 0;

    for (const i in ingresos) {
        total += Number(ingresos[i].monto);
    }
    ingresoTotal.innerHTML = formatoMoneda(total)

    for (const i in egresos) {
        totalE += Number(egresos[i].monto);
    }
    egresoTotal.innerHTML = formatoMoneda(totalE)
    disponible.innerHTML = formatoMoneda(Number(total - totalE));

    obtenerPorcentaje({ ingresos: total, egresos: totalE });
}

//Guarda un nuevo objeto en el array de ingresos o egresos
const nuevoDato = () => {
    const desc = document.getElementById('desc').value;
    const valor = document.getElementById('valor').value;
    const operacion = document.getElementById('operacion');
    if (valor == '' || desc == '') {
        alert('No ha completado los datos')
    } else {
        operacion.value == '+' ? ingresos.push(new Ingreso({ descripcion: desc, monto: valor })) : egresos.push(new Egreso({ descripcion: desc, monto: valor }));
    }
}

//Añade el ingreso o el egreso al respectivo array
const sumaLista = ({ agregar, tipo, text }) => {
    agregarEgresos = document.getElementById('agregar-egresos');
    agregarIngresos = document.getElementById('agregar-ingresos');
    let montoTotal = 0;

    tipo.forEach(element => {
        montoTotal += Number(element.monto);
    });

    agregar.innerHTML = ` 
    <tr>
        <th>${text}</th>
    </tr>`;
    if (text === 'Egresos') {
        for (const i in tipo) {
            agregar.innerHTML += `
    <tr onmouseover = 'mostrarCesto(this)' onmouseout = 'mostrarCesto(this)'>
        <td>${tipo[i].descripcion}</td>
        <td class="text-end ps-5 pe-3 dinero" >${formatoMoneda(Number(tipo[i].monto))}</td>
        <td><span class="porcentaje-egresos"  title="Porcentaje respecto todos sus egresos">${formatoPorcentaje(tipo[i].monto / montoTotal)}</span></td>
        <td class="opacity"><i class="far fa-trash-alt borrar" title="Eliminar Egreso" id="${tipo[i].id}"  onclick='eliminarEgreso(${tipo[i].id})'></i></td>
    </tr>`;
        }
    }
    else {
        for (const i in tipo) {
            agregar.innerHTML += `
    <tr onmouseover = 'mostrarCesto(this)' onmouseout = 'mostrarCesto(this)'>
        <td>${tipo[i].descripcion}</td>
        <td class="text-end pe-2 dinero">${formatoMoneda(Number(tipo[i].monto))}</td>
        <td class="opacity"><i class="far fa-trash-alt borrar" title="Eliminar Ingreso" id="${tipo[i].id}"  onclick='eliminarIngreso(${tipo[i].id})'></i></td>
    </tr>`;
        }
    }
}

//Retorna el monto en formato de divisa
const formatoMoneda = (moneda) => {
    return moneda.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatoPorcentaje = (porcentaje) => {
    return porcentaje.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

//Permite visibilisar el cesto de basura
const mostrarCesto = (id) => {
    return id.lastElementChild.classList.toggle('opacity');
}
//Obtiene el porcentaje total de egresos
const obtenerPorcentaje = ({ ingresos, egresos }) => {
    const porcentaje = document.getElementById('porcentaje');
    porcentaje.innerHTML = formatoPorcentaje((egresos / ingresos));
    return porcentaje.innerHTML;
}

//Recarga el documento con todos los valores guardados
const recargar = () => {
    const operacion = document.getElementById('operacion');
    operacion.value === '+' ? sumaLista({ agregar: agregarIngresos, tipo: ingresos, text: 'Ingresos' }) : sumaLista({ agregar: agregarEgresos, tipo: egresos, text: 'Egresos' });
}

//Limpia los inptus
const inputClean = () => {
    document.getElementById('desc').value = '';
    document.getElementById('valor').value = '';
}

//Elimina un ingreso
const eliminarIngreso = (id) => {
    for (const index in ingresos) {
        if (ingresos[index].id === id) {
            ingresos.splice(index, 1);
        }
    }

    sumaLista({ agregar: agregarIngresos, tipo: ingresos, text: 'Ingresos' })
    disponible();
}

//Elimina un egreso
const eliminarEgreso = (id) => {
    for (const index in egresos) {
        if (egresos[index].id === id) {
            egresos.splice(index, 1)
        }
    }

    sumaLista({ agregar: agregarEgresos, tipo: egresos, text: 'Egresos' });
    disponible();
}

//Borrar todo
borrarTodo.addEventListener('click', () => {
    ingresos = [];
    egresos = [];
    sumaLista({ agregar: agregarIngresos, tipo: ingresos, text: 'Ingresos' })
    sumaLista({ agregar: agregarEgresos, tipo: egresos, text: 'Egresos' });

    disponible();
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(0);
})

//Boton realiza todas las funciones creadas
agregar.addEventListener('click', () => {
    nuevoDato();
    recargar();
    disponible();
    inputClean();
})