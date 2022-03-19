

import { muestraUsuarios } from './models/usuarios.js';



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