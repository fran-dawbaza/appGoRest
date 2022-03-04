



const nuevoUsuario = (evento) => { 

    evento.preventDefault();

    const formUsuario = document.getElementById('formUsuario');

    const gender = document.getElementById('genderMale')
                    .checked ? 'male' : 'female';
    const status = document.getElementById('statusActive')
                    .checked ? 'active' : 'inactive';

    const usuario = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        gender: gender,
        status: status
    };

    const opcionesFetch = {
        body: JSON.stringify(usuario),
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${GOREST_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      };
    console.log(usuario);
    fetch("https://gorest.co.in/public/v2/users", opcionesFetch)
    .then(respuesta=>{
        if (respuesta.status == 201) {
            document.getElementById('respuestaFetch').innerHTML='Usuario añadido correctamente';
        }
        else {
            return Promise.reject(new Error(respuesta.status + respuesta.statusText));
        }
    })
    .catch(console.log)
};

document.getElementById('formUsuario')
        .addEventListener('submit', nuevoUsuario);




