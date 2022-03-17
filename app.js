import { GOREST_API_TOKEN } from './config.js';
//import { html, renderFile } from './lib/renderFile.js';
import { renderFile } from './lib/renderFile.js';

// lo usaremos para las peticiones con fetch, no olvidar modificar method y body

const opcionesFetch = {
    headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${GOREST_API_TOKEN}`,
        "Content-Type": "application/json",
    },
    method: "GET",

};

const actualizaUsuario = async (idForm,pagina) =>{
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
    muestraUsuarios(pagina)
};

const muestraFormularioUsuario = async (usuario,pagina=1) => {
    const contenido = document.getElementById('principal');


    //leemos el archivo de plantilla y rellenamos con los arrays usuarios y paginador
    usuario.textoBoton='Actualizar usuario';
    usuario.idBoton='botonActualiza'+usuario.id;
    usuario.idFormulario='formularioActualiza'+usuario.id;
    contenido.innerHTML = await renderFile('./templates/formUsuario.html', usuario);
    document.getElementById(usuario.idBoton)
        .addEventListener('click',()=>actualizaUsuario(usuario.idFormulario,pagina));
    document.getElementById('cancelar')
        .addEventListener('click',()=>muestraUsuarios(pagina));

};


const manejadorTablaUsuarios = (evento,pagina) => {
    if (evento.target.localName == "td") { // captura de evento click en una celda-> buscamos la fila
        console.log("td padre:", evento.target.parentNode);
        console.log("id usuario:", evento.target.parentNode.children[0].textContent);
        console.log("nombre:", evento.target.parentNode.children[1].textContent);
        console.log("email:", evento.target.parentNode.children[2].textContent);
    } else if (evento.target.localName == "i") { // captura de evento click para el icono de edición o borrad
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
            muestraFormularioUsuario(user,pagina);
        }
        if (delete_user && delete_user != '') {
            console.log("Borrando el usuario " + delete_user);
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
    document.getElementById('userTable').addEventListener('click', e=>manejadorTablaUsuarios(e,pagina));
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

document.getElementById('usuarios').addEventListener('click', () => muestraUsuarios());
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