import {html} from 'https://unpkg.com/lit-html@2.2.0';
export const tablaUsuarios = (usuarios,paginacion) => html`
<div class="table-responsive">
    <table id="userTable" class="table table-striped table-hover">
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
    <tbody>${
        usuarios.map(u => html`
    <tr>
        <th scope="row">${u.id}</th>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.gender=='male'?'hombre':'mujer'}</td>
        <td>${u.status=='active'?'activo':'inactivo'}</td>
        <td>botones</td>
    </tr>`
    )
    }
    </tbody>
  </table>
</div>
${paginacion}
`;