import { GOREST_API_TOKEN } from './config.js';
import { html, renderFile } from './lib/renderFile.js';

// lo usaremos para las peticiones con fetch, no olvidar modificar method y body

const opcionesFetch = {
    headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${GOREST_API_TOKEN}`,
        "Content-Type": "application/json",
    },
    method: "GET",

};


const muestraUsuario = evento => {
    if (evento.target.localName == "td") { // captura de evento click en una celda-> buscamos la fila
        console.log("td padre:", evento.target.parentNode);
        console.log("id usuario:", evento.target.parentNode.children[0].textContent);
        console.log("nombre:", evento.target.parentNode.children[1].textContent);
        console.log("email:", evento.target.parentNode.children[2].textContent);
    }
    console.log(evento.currentTarget.localName);
    console.log(evento)
};

const hazPaginacion = (cabeceras) => {

    const limit = cabeceras.get('X-Pagination-Limit') || 20; // results per page.
    const total = cabeceras.get('X-Pagination-Total') || 'incontables'; // total number of results.
    const paginas = cabeceras.get('X-Pagination-Pages') || '100'; //total number of pages.
    const pagina = cabeceras.get('X-Pagination-Page') || paginaActual || 1; //current page number.

    // Array de objetos que se usa para generar el paginador
    // cada elemento de este array se mostrará en el paginador
    const arrayPaginas = [];
    arrayPaginas.push({ // para la página 1 del paginador
        disabled: (pagina == 1 ? 'disabled' : ''),
        url: '#',
        page: 1,
        id: 'li_pag_1'
    });

    let i = Math.max(2, +pagina - 3);
    let medio1 = Math.floor(i / 2);
    if (medio1 > 1 && medio1 < i) {
        arrayPaginas.push({ // página intermedia 1 del paginador
            disabled: (pagina == medio1 ? 'disabled' : ''),
            url: '#',
            page: medio1,
            id: `li_pag_${medio1}`
        });

    }
    let tope = Math.min(+pagina + 4, +paginas);
    while (i < tope) { // páginas alrededor de la página actual
        arrayPaginas.push({
            disabled: (pagina == i ? 'disabled' : ''),
            url: '#',
            page: i,
            id: `li_pag_${i}`
        });
        i++;
    }

    let medio2 = Math.floor((tope + +paginas) / 2);
    if (medio2 > tope && medio2 < +paginas) {
        arrayPaginas.push({ // página intermedia 2
            disabled: (pagina == medio2 ? 'disabled' : ''),
            url: '#',
            page: medio2,
            id: `li_pag_${medio2}`
        });
    }

    arrayPaginas.push({ // para la última página del paginador
        disabled: (pagina == paginas ? 'disabled' : ''),
        url: '#',
        page: paginas,
        id: `li_pag_${paginas}`
    });

    return arrayPaginas;

};

const muestraUsuarios = async(evento, pagina = 1) => {
    // Obtenemos el array de usuarios y mostramos tabla

    opcionesFetch.method = 'GET';
    delete opcionesFetch.body;

    const respuesta = await fetch("https://gorest.co.in/public/v2/users?page=" + pagina, opcionesFetch);
    const usuarios = await respuesta.json();

    const contenido = document.getElementById('principal');

    const arrayPaginas = hazPaginacion(respuesta.headers);

    await renderFile('./templates/tablaUsuarios.html', {
        usuarios,
        arrayPaginas
    }, contenido);

    // para cada elemento del paginador añadimos un evento click para mostrar la página correspondiente
    arrayPaginas.forEach(p => {
        document.getElementById(p.id).addEventListener('click', (e) => muestraUsuarios(e, p.page));
    });
};

const nuevoUsuario = evento => {
    evento.preventDefault();
    const nombre = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const genero = document.getElementById('genderMale').checked ? 'male' : 'female';
    const estado = document.getElementById('statusActive').checked ? 'male' : 'female';
    const formu = new FormData('usuario');
    console.log(formu);

}

document.getElementById('usuarios').addEventListener('click', muestraUsuarios);
document.getElementById('buscarPorEntrada').addEventListener('click', () => {
    const buscar = document.getElementById('buscar');
    buscar.attributes['tipobusqueda'].value = 'posts';
    buscar.attributes['placeholder'].value = 'Buscar en entradas';
});
document.getElementById('buscarPorComentario').addEventListener('click', () => {
    const buscar = document.getElementById('buscar');
    buscar.attributes['tipobusqueda'].value = 'comments';
    buscar.attributes['placeholder'].value = 'Buscar en comentarios';
});
document.getElementById('buscarPorUsuario').addEventListener('click', () => {
    const buscar = document.getElementById('buscar');
    buscar.attributes['tipobusqueda'].value = 'users';
    buscar.attributes['placeholder'].value = 'Buscar en usuarios';
});
document.getElementById('buscarPorTarea').addEventListener('click', () => {
    const buscar = document.getElementById('buscar');
    buscar.attributes['tipobusqueda'].value = 'todos';
    buscar.attributes['placeholder'].value = 'Buscar en tareas';
});
document.getElementById('buscarGeneral').addEventListener('click', () => {
    const buscar = document.getElementById('buscar');
    buscar.attributes['tipobusqueda'].value = '*';
    buscar.attributes['placeholder'].value = 'Buscar';
});
document.getElementById('formBuscar').addEventListener('submit', (e) => {
    e.preventDefault();
    const tipoBusqueda = document.getElementById('buscar').attributes['tipobusqueda'].value;
});

//document.getElementById('formUsuario').addEventListener('submit', nuevoUsuario);