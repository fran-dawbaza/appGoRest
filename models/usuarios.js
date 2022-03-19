import { GOREST_API_TOKEN } from '../config.js';
//import { html, renderFile } from './lib/renderFile.js';
import { renderFile } from '../lib/renderFile.js';

// lo usaremos para las peticiones con fetch, no olvidar modificar method y body

const opcionesFetch = {
    headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${GOREST_API_TOKEN}`,
        "Content-Type": "application/json",
    },
    method: "GET",

};

const eliminaUsuario = async(idUsuario, pagina) => {
    opcionesFetch.method = 'DELETE';
    delete opcionesFetch.body;

    const respuesta = await fetch("https://gorest.co.in/public/v2/users/" + idUsuario, opcionesFetch);
    if (!respuesta.ok) {
        console.log(respuesta);
        alert('Error durante la actualización')
    }
    muestraUsuarios(pagina);
};

const nuevoUsuario = async(idForm, pagina) => {
    const formu = document.getElementById(idForm);
    const user = {
        name: formu.name.value,
        email: formu.email.value,
        gender: formu.gender.value,
        status: formu.status.value
    };
    opcionesFetch.method = 'POST';
    opcionesFetch.body = JSON.stringify(user);

    const respuesta = await fetch("https://gorest.co.in/public/v2/users/", opcionesFetch);
    if (!respuesta.ok) {
        console.log(respuesta);
        alert('Error durante la actualización')
    }
    muestraUsuarios(pagina);
};

const actualizaUsuario = async(idForm, pagina) => {
    const formu = document.getElementById(idForm);
    const id = formu.id.value;
    const user = {
        name: formu.name.value,
        email: formu.email.value,
        gender: formu.gender.value,
        status: formu.status.value
    };
    opcionesFetch.method = 'PUT';
    opcionesFetch.body = JSON.stringify(user);

    const respuesta = await fetch("https://gorest.co.in/public/v2/users/" + id, opcionesFetch);
    if (!respuesta.ok) {
        console.log(respuesta);
        alert('Error durante la actualización')
    }
    muestraUsuarios(pagina);
};

const muestraFormularioUsuario = async(usuario, pagina = 1) => {
    const contenido = document.getElementById('principal');

    usuario.idBoton = 'botonUsuario';
    usuario.idFormulario = 'formularioUsuario';

    //
    if (usuario.id) {
        usuario.textoBoton = 'Actualizar usuario';
        contenido.innerHTML = await renderFile('./templates/formUsuario.html', usuario);
        document.getElementById(usuario.idBoton)
            .addEventListener('click', () => actualizaUsuario(usuario.idFormulario, pagina));
        document.getElementById('cancelar')
            .addEventListener('click', () => muestraUsuarios(pagina));
    } else {
        usuario.textoBoton = 'Generar nuevo usuario';
        contenido.innerHTML = await renderFile('./templates/formUsuario.html', usuario);
        document.getElementById(usuario.idBoton)
            .addEventListener('click', () => nuevoUsuario(usuario.idFormulario, pagina));
        document.getElementById('cancelar')
            .addEventListener('click', () => muestraUsuarios(pagina));
    }

};


const manejadorTablaUsuarios = (evento, pagina) => {
    /*if (evento.target.localName == "td") { // captura de evento click en una celda-> buscamos la fila
        console.log("td padre:", evento.target.parentNode);
        console.log("id usuario:", evento.target.parentNode.children[0].textContent);
        console.log("nombre:", evento.target.parentNode.children[1].textContent);
        console.log("email:", evento.target.parentNode.children[2].textContent);
    } else */
    if (evento.target.localName == "i") { // captura de evento click para el icono de edición o borrad
        console.log(evento.target);
        const edit_user = evento.target.getAttribute('edit_user');
        const delete_user = evento.target.getAttribute('delete_user');
        if (edit_user && edit_user != '') {
            const user = {
                id: edit_user,
                name: evento.target.parentNode.parentNode.parentNode.children[1].textContent,
                email: evento.target.parentNode.parentNode.parentNode.children[2].textContent,
                gender: (evento.target.parentNode.parentNode.parentNode.children[3].children[0].getAttribute('title') == 'hombre' ? 'male' : 'female'),
                status: (evento.target.parentNode.parentNode.parentNode.children[4].children[0].getAttribute('title') == 'activo' ? 'active' : 'inactive')
            };
            console.log("Editando el usuario ", user);
            muestraFormularioUsuario(user, pagina);
        }
        if (delete_user && delete_user != '') {
            console.log("Borrando el usuario " + delete_user);
            if (confirm(`¿Estás seguro de borrar el usuario ${delete_user}?, el borrado no se puede deshacer.`)) {
                eliminaUsuario(delete_user, pagina);
            }
            //confirmaBorradoUsuario(delete_user)
        }
    }
};

const hazPaginacion = (cabeceras) => {

    //const limit = cabeceras.get('X-Pagination-Limit') || 20; // results per page.
    //const total = cabeceras.get('X-Pagination-Total') || 'incontables'; // total number of results.
    const paginas = +cabeceras.get('X-Pagination-Pages') || 100; //total number of pages.
    const pagina = +cabeceras.get('X-Pagination-Page') || 1; //current page number.

    // Array de objetos que se usa para generar el paginador
    // cada elemento de este array se mostrará en el paginador
    const arrayPaginas = [];
    arrayPaginas.push({ // para la página 1 del paginador
        active: (pagina == 1 ? 'active' : ''),
        url: '#',
        page: 1,
        id: 'li_pag_1'
    });

    let i = Math.max(2, pagina - 3);
    let medio1 = Math.floor(i / 2);
    if (medio1 > 1 && medio1 < i) {
        arrayPaginas.push({ // página intermedia 1 del paginador
            active: (pagina == medio1 ? 'active' : ''),
            url: '#',
            page: medio1,
            id: `li_pag_${medio1}`
        });

    }
    let tope = Math.min(pagina + 4, paginas);
    while (i < tope) { // páginas alrededor de la página actual
        arrayPaginas.push({
            active: (pagina == i ? 'active' : ''),
            url: '#',
            page: i,
            id: `li_pag_${i}`
        });
        i++;
    }

    let medio2 = Math.floor((tope + paginas) / 2);
    if (medio2 > tope && medio2 < paginas) {
        arrayPaginas.push({ // página intermedia 2
            active: (pagina == medio2 ? 'active' : ''),
            url: '#',
            page: medio2,
            id: `li_pag_${medio2}`
        });
    }

    arrayPaginas.push({ // para la última página del paginador
        active: (pagina == paginas ? 'active' : ''),
        url: '#',
        page: paginas,
        id: `li_pag_${paginas}`
    });

    return arrayPaginas;

};

const muestraUsuarios = async(pagina = 1) => {
    // Obtenemos el array de usuarios y mostramos tabla

    opcionesFetch.method = 'GET';
    delete opcionesFetch.body;

    const respuesta = await fetch("https://gorest.co.in/public/v2/users?page=" + pagina, opcionesFetch);
    const usuarios = await respuesta.json();

    const contenido = document.getElementById('principal');

    //obtenemos un array de objetos para el paginador
    const paginador = hazPaginacion(respuesta.headers);

    //leemos el archivo de plantilla y rellenamos con los arrays usuarios y paginador
    contenido.innerHTML = await renderFile('./templates/tablaUsuarios.html', { usuarios, paginador });

    // para cada elemento del paginador añadimos un evento click para mostrar la página correspondiente
    paginador.forEach(p => {
        document.getElementById(p.id).addEventListener('click', () => muestraUsuarios(p.page));
    });

    // para la tabla, añado evento click. 
    document.getElementById('userTable').addEventListener('click', e => manejadorTablaUsuarios(e, pagina));

    // para el botón de nuevo usuario, añado evento click. 
    const usuario = {
        id: '',
        name: '',
        email: '',
        gender: 'male',
        status: 'active'
    };
    document.getElementById('new_user').addEventListener('click', e => muestraFormularioUsuario(usuario, pagina));

};

export { muestraUsuarios };