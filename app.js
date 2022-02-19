// lo usaremos para las peticiones con fetch, no olvidar modificar method y body

const opcionesFetch = {
    headers: {
        "Accept": "application/json",
        "Authorization": "Bearer d4b968ff7bfb0f7628a4f7739ce00634169fbd6d352526c8c50f01cf18c3c7c9",
        "Content-Type": "application/json",
    },
    method: "GET",

};

fetch("https://gorest.co.in/public/v2/users", opcionesFetch)
    .then(res => {
        console.log(res);

        for (var pair of res.headers.entries()) {
            console.log(pair[0], pair[1]);
        }
        // iterate over all headers
        for (let [key, value] of res.headers) {
            console.log(`${key} = ${value}`);
        }
        console.log('limit: ', res.headers.get('X-Pagination-Limit'));
        //res.headers.forEach(function(val, key) { console.log(key + ' -> ' + val); });
        return res.json();
    })
    .then(users => {
        console.log(users);
    })
    .catch(console.log);

let res;

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

const hazPaginacion = (url, paginaActual, cabeceras) => {
    const limit = cabeceras.get('X-Pagination-Limit') || 20; // results per page.
    const total = cabeceras.get('X-Pagination-Total') || 'incontables'; // total number of results.
    const paginas = cabeceras.get('X-Pagination-Pages') || '100'; //total number of pages.
    const pagina = cabeceras.get('X-Pagination-Page') || paginaActual || 1; //current page number.

    const statusAnterior = pagina == 1 ? 'disabled' : '" onclick="muestraUsuarios(null,' + (pagina - 1) + ')';
    const statusSiguiente = pagina == paginas ? 'disabled' : '" onclick="muestraUsuarios(null,' + (pagina + 1) + ')';
    const statusPrimera = pagina == 1 ? 'disabled' : '" onclick="muestraUsuarios(null,1)';
    const statusUltima = pagina == paginas ? 'disabled' : '" onclick="muestraUsuarios(null,' + (paginas) + ')';

    let paginasCercanas = '';

    for (let i = pagina - 5; i < pagina + 5; i++) {
        if (i > 1 && i < paginas - 1) {
            let disabled = (i == pagina) ? 'disabled' : '" onclick="muestraUsuarios(null,' + i + ')';
            paginasCercanas += `<li class="page-item ${disabled}"><a class="page-link" href="#">${i}</a></li>
            `;
        }
    }

    let plantilla = `<nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item ${statusAnterior}"><a class="page-link" href="#">Anterior</a></li>
      <li class="page-item ${statusPrimera}"><a class="page-link" href="#">Primera</a></li>
      ${paginasCercanas}
      <li class="page-item ${statusUltima}"><a class="page-link" href="#">Última</a></li>
      <li class="page-item ${statusSiguiente}"><a class="page-link" href="#">Siguiente</a></li>
    </ul>
  </nav>`;
    return plantilla;

};

const muestraUsuarios = async(evento, pagina = 1) => {
    // Obtenemos el array de usuarios y mostramos tabla

    opcionesFetch.method = 'GET';
    delete opcionesFetch.body;

    const respuesta = await fetch("https://gorest.co.in/public/v2/users?page=" + pagina, opcionesFetch);
    const usuarios = await respuesta.json();
    res = respuesta;
    //res.headers.forEach(function(val, key) { console.log(key + ' -> ' + val); });

    const contenido = document.getElementById('principal');
    contenido.removeEventListener('click', muestraUsuario, false);

    let filas = '';
    usuarios.forEach(usuario => {
        filas += `
    <tr>
        <th scope="row">${usuario.id}</th>
        <td>${usuario.name}</td>
        <td>${usuario.email}</td>
        <td>${usuario.gender=='male'?'hombre':'mujer'}</td>
        <td>${usuario.status=='active'?'activo':'inactivo'}</td>
        <td>botones</td>
    </tr>`;
    });

    const paginacion = hazPaginacion('https://gorest.co.in/public/v2/users?page=', pagina, respuesta.headers);

    contenido.innerHTML = `<div class="table-responsive"><table id="userTable" class="table table-striped table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Email</th>
        <th scope="col">Género</th>
        <th scope="col">Estado</th>
        <th scope="col">acciones</th>
      </tr>
    </thead>
    <tbody>${filas}
    </tbody>
  </table>
</div>${paginacion}`;
    contenido.addEventListener('click', muestraUsuario, false);
    //JSON.stringify(usuarios);
};



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