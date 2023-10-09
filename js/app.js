//variables

const formulario = document.querySelector("#formulario");
const listaCosas = document.querySelector("#lista-cosas");
const inputCosa = document.querySelector("#cosa");
const contenedor = document.querySelector(".container");
let listadoCosas = [];

//eventos

formulario.addEventListener("submit", agregarCosa);
//con esto hacemos que el listado se muestre cuando el documento esté todo cargado

document.addEventListener("DOMContentLoaded", () => {
    //para que listadoCosas, si no tiene nad en el localStorageno llegue como NULL, hay que hacer una validación || [] ya que sino, la función de crearListadoHTMl() no funcionará ya que no se puede hacer un forEach de un elemento null, tiene que hacerlo sobre un array, por eso le indicamos que, si no hay nada en el localStorage, coja la opción de ARRAY VACIO
    listadoCosas = JSON.parse(localStorage.getItem("listadoCosas")) || [];

    crearListadoHTML();
});

//funciones
//le pasamos el parametro e para hacer el e.prevetDefault y detener el envío por default del formulario
function agregarCosa(e) {
    e.preventDefault();
    const cosa = inputCosa.value;
    if (cosa === "") {
        mostrarMensajeError("El campo no puede estar vacío");
        return; //con este return evitamos que, si se cumple el if, deje de ejecutar el siguiente código
    }

    //añadir cada elemento que el usuario escriba en el input al [] de listadoCosas lo que ya hubiera en listadoCosas + la cosa que es el elemento que va escribiendo en el input. Para que no se repitan los elementos dentro del array, vamos a identificarlos de alguna manera, lo hacemos con Date.now()

    const cosaObj = {
        id: Date.now(),
        cosa, //cosa: cosa, esto se puede simplificar en poner solo una vez cosa, object literal y como clave pondrá cosa
    };
    listadoCosas = [...listadoCosas, cosaObj];

    //una vez hemos recogido lo que el usuario pone en el input, vamos a crear el listado en HTML
    crearListadoHTML();

    //resetear el input
    formulario.reset();
}

function mostrarMensajeError(error) {
    //creamos el mensaje de error en HTML
    const mensajeError = document.createElement("P");
    mensajeError.textContent = error;
    mensajeError.classList.add("error");
    contenedor.appendChild(mensajeError);

    //elimina el mensaje de error después de 2 seg
    setTimeout(() => {
        mensajeError.remove();
    }, 2000);
}

function crearListadoHTML() {
    //limpiamos el HTML antes de mostrar el listado de cosas
    limpiarHTML();

    //primero validamos que esto funcione solo si se ha escrito algo en el input e itearmos sobre el [] de cosas
    if (listadoCosas.length > 0) {
        listadoCosas.forEach((item) => {
            //creamos un botónpara eliminar cada cosa de la lista
            const btnEliminar = document.createElement("a");
            btnEliminar.classList.add("borrar-tweet");
            btnEliminar.textContent = "X";

            //añadimos la función de eliminar el elemento de la lista, hay que pasarle el id del elemento que quiero borrar
            btnEliminar.onclick = () => {
                borrarElementoLista(item.id);
            };

            //creamos el HTML del listado
            const elementoQueMostrar = document.createElement("li");

            //Le añadimos texto
            elementoQueMostrar.innerText = item.cosa;

            //Asignamos el botón al elemento
            elementoQueMostrar.appendChild(btnEliminar);

            //lo apencheamos al HTML. Repite el elemento anterior cuando muestra la lisyta de cosas porque no estamos limpiando el HTML
            listaCosas.appendChild(elementoQueMostrar);
        });
    }

    //guardar elementos en el localStorage
    guardarLocalStorage();
}

function limpiarHTML() {
    while (listaCosas.firstChild) {
        listaCosas.removeChild(listaCosas.firstChild);
    }
}

function guardarLocalStorage() {
    localStorage.setItem("listadoCosas", JSON.stringify(listadoCosas));
}

function borrarElementoLista(id) {
    //borramos las cosas del [] filtrando por el id que clicamos dejando en el array todos los elementos excepto el que he clicado
    listadoCosas = listadoCosas.filter((item) => item.id !== id);

    //tenemos que llamar de nuevo a crearListadoHTML() para que se renderice el actual HTML
    crearListadoHTML();
}
