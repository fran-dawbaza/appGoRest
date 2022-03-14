

import {html, render} from 'https://unpkg.com/lit-html?module';

async function renderFile(url,datos,destino,opciones={}) {
    const respuesta = await fetch(url);
    const texto = await respuesta.text();
    const keys = Object.keys(datos);
    const values = Object.values(datos);
    keys.push('html'); // pasamos tambien la funcion html como parámetro
    values.push(html);
    const plantilla = new Function(...keys, `return html\`${texto}\`;`);
    render(plantilla(...values), destino, opciones);
  };

export { html, render, renderFile };