function stringToTemplateLiteral(plantilla, objeto) {
    if (!(typeof plantilla === 'string' || plantilla instanceof String)) throw new Error('El primer argumento debe ser un string');
    if (!(objeto && objeto.constructor && objeto.constructor.name === "Object")) throw new Error('El segundo argumento debe ser un objeto');
    try {
        const keys = Object.keys(objeto);
        const values = Object.values(objeto);
        // Hacemos una función con las keys del objeto como nombres de parámetros
        // e invocamos a la función directamente con los values del objeto
        return (new Function(...keys, `return \`${plantilla}\`;`))(...values);
    } catch (e) {
        console.log(e);
        if (e instanceof ReferenceError) {
            const newKey = e.message.split(' ')[0];
            objeto[newKey] = '';
            return stringToTemplateLiteral(plantilla, objeto);
        } else {
            throw e;
        }
    }

    return '';
};


/*
Ejemplo de uso:

let cadena = "Hola, soy ${nombre}, tengo ${edad - 5} años ... más o menos, y soy de ${lugar}";
let usuario = {
    nombre: 'Perico',
    edad: 45,
    lugar: 'Huéscar'
};

console.log(stringToTemplateLiteral(cadena, usuario));
*/

const fileToTemplateLiteral = async(url, objeto, callBack) => {
    try {
        const respuesta = await fetch(url);
        const plantilla = await respuesta.text();
        const resultado = stringToTemplateLiteral(plantilla, objeto);
        callBack(null, resultado);
    } catch (error) {
        callBack(error, null);
    }
};

/* ejemplo de uso:
 
fileToTemplateLiteral('/templates/formUsuario.html', { name: ' Pablito', email: 'mi@test.com', gender: 'male', status: 'inactive' },
    (error, resultado) => console.log(error, resultado));
    */

export { stringToTemplateLiteral, fileToTemplateLiteral };