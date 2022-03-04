const muestraPasajero = evento => {
    if (evento.target.localName == "td") { // captura de evento click en una celda-> buscamos la fila
        console.log("td padre:", evento.target.parentNode);
        console.log("id:", evento.target.parentNode.children[0].textContent);
        console.log("name:", evento.target.parentNode.children[1].textContent);
        console.log("trips:", evento.target.parentNode.children[2].textContent);
        console.log("airline:", evento.target.parentNode.children[3].textContent);
    }
    console.log(evento.currentTarget.localName);
    console.log(evento)
};

const hazPaginacion = (total, paginas, pagina) => {

    const tamano = Math.round(+total / +paginas);

    const statusPrimera = pagina == 1 ? 'disabled' : `" onclick="getPassengersFetch(1, ${tamano}, muestraPasajeros)"`;
    const statusUltima = pagina == paginas ? 'disabled' : `" onclick="getPassengersFetch(${paginas}, ${tamano}, muestraPasajeros)"`;

    let paginasCercanas = '';
    let i = Math.max(2, +pagina - 4);
    let fin = Math.min(i + 10, +paginas);
    while (i < fin) {
        let disabled = (i == pagina) ? 'disabled' : `" onclick="getPassengersFetch(${i}, ${tamano}, muestraPasajeros)"`;
        paginasCercanas += `<li class="page-item ${disabled}"><a class="page-link" href="#">${i}</a></li>
            `;
        i++;
    }

    let plantilla = `<nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item ${statusPrimera}"><a class="page-link" href="#">Primera</a></li>
      ${paginasCercanas}
      <li class="page-item ${statusUltima}"><a class="page-link" href="#">Última</a></li>
    </ul>
  </nav>`;
    return plantilla;

};

const getPassengersFetch = (pagina = 0, tamano = 15, callBack) => {
    fetch(`https://api.instantwebtools.net/v1/passenger?page=${pagina}&size=${tamano}`)
        .then(resultado => resultado.json())
        .then(datos => {
            const datosPasajeros = {
                total: datos.totalPassengers,
                paginas: datos.totalPages,
                pagina: pagina,
                pasajeros: datos.data
            };

            callBack(null, datosPasajeros);
        })
        .catch(error => callBack(error, null));
};

const getPassengersAAFetch = async(pagina = 0, tamano = 15, callBack) => {
    try {
        const resultado = await fetch(`https://api.instantwebtools.net/v1/passenger?page=${pagina}&size=${tamano}`);
        const datos = await resultado.json();
        const total = datos.totalPassengers;
        const paginas = datos.totalPages;
        const pasajeros = datos.data;
        callBack(null, { total, paginas, pagina, pasajeros });
    } catch (error) {
        callBack(error, null);
    }
};

const getPassengersXHR = async(pagina = 0, tamano = 15, callBack) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.instantwebtools.net/v1/passenger?page=${pagina}&size=${tamano}`);
    xhr.addEventListener('error', (e) => callBack(new Error(e.target.status + e.target.statusText), null));
    xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const status = xhr.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                // The request has been completed successfully
                const datos = JSON.parse(xhr.responseText);
                const total = datos.totalPassengers;
                const paginas = datos.totalPages;
                const pasajeros = datos.data;
                callBack(null, { total, paginas, pagina, pasajeros })
            } else {
                callBack(new Error(xhr.status + xhr.statusText), null)
            }
        }
    });
    xhr.send();
};




const muestraPasajeros = (error, datosPasajeros) => {
    // Obtenemos el array de usuarios y mostramos tabla

    if (error) {
        console.log(error);
        return;
    }
    const { total, paginas, pagina, pasajeros } = datosPasajeros;

    const contenido = document.getElementById('principal');
    contenido.removeEventListener('click', muestraPasajero);

    let filas = '';
    pasajeros.forEach(usuario => {
        filas += `
    <tr>
        <th scope="row">${usuario._id}</th>
        <td>${usuario.name}</td>
        <td>${usuario.trips}</td>
        <td>${usuario.airline.map(a=>a.name)}</td>
        <td>botones</td>
    </tr>`;
    });

    const paginacion = hazPaginacion(total, paginas, pagina);

    contenido.innerHTML = `<div class="table-responsive"><table id="userTable" class="table table-striped table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Trips</th>
        <th scope="col">Airline</th>
        <th scope="col">acciones</th>
      </tr>
    </thead>
    <tbody>${filas}
    </tbody>
  </table>
</div>${paginacion}`;
    contenido.addEventListener('click', muestraPasajero);
};

document.getElementById('passengersFetch').addEventListener('click', () => {
    document.getElementById('passengersFetch').classList.add('active');
    document.getElementById('passengersAAFetch').classList.remove('active');
    document.getElementById('passengersXHR').classList.remove('active');
    getPassengersFetch(0, 15, muestraPasajeros);
});
document.getElementById('passengersAAFetch').addEventListener('click', () => {
    document.getElementById('passengersFetch').classList.remove('active');
    document.getElementById('passengersAAFetch').classList.add('active');
    document.getElementById('passengersXHR').classList.remove('active');
    getPassengersAAFetch(10, 15, muestraPasajeros);
});
document.getElementById('passengersXHR').addEventListener('click', () => {
    document.getElementById('passengersFetch').classList.remove('active');
    document.getElementById('passengersAAFetch').classList.remove('active');
    document.getElementById('passengersXHR').classList.add('active');
    getPassengersXHR(20, 15, muestraPasajeros);
});

getPassengersFetch(12, 10, console.log);
getPassengersAAFetch(12, 10, console.log);
getPassengersXHR(12, 10, console.log);

getPassengersFetch(0, 15, muestraPasajeros);

/*

// My starting JS
let app = document.querySelector('#app');
let listItem = document.querySelector('#list-item');
let wizards = ['Merlin', 'Gandalf', 'Neville', 'yo mismo'];

/**
 * Get a template from a string
 * https://stackoverflow.com/a/41015840
 * @param  {String} str    The string to interpolate
 * @param  {Object} params The parameters
 * @return {String}        The interpolated string
 *
 function interpolate (str, params) {
	let names = Object.keys(params);
	let vals = Object.values(params);
	return new Function(...names, `return \`${str}\`;`)(...vals);
}

// Create an HTML string
let html = '';

En la página HTML está la plantilla:
<div id="app"></div>
<template id="list-item">
	<li>
		<strong>${wizard}</strong>
    </li>
</template>

// Loop through each wizard
for (let wizard of wizards) {
	html += interpolate(listItem.innerHTML, {wizard});
}

// Add the HTML to the UI
app.innerHTML = html;

*/