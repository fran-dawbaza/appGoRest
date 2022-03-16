import { html, render } from 'https://unpkg.com/lit-html?module';

export async function renderFile(url, datos, destino, opciones = {}) {
    try {
        const respuesta = await fetch(url);
        const texto = await respuesta.text();
        const keys = Object.keys(datos);
        const values = Object.values(datos);
        keys.push('html'); // pasamos tambien la funcion html como parámetro
        values.push(html);
        const plantilla = new Function(...keys, `return html\`${texto}\`;`);
        render(plantilla(...values), destino, opciones);
    } catch (error) {
        console.log("Error en función renderFile, " + error.name + ': ' + error.message + ' -> ' + error.stack);
    }

};

export { html, render, renderFile };