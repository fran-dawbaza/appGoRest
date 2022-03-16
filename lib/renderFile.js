export async function renderFile(urlOrNode, datos) {
    try {
        let textoHtml;
        // si urlOrNode es una cadena, lo entenderemos como una URL
        if (urlOrNode !== undefined && urlOrNode != null && urlOrNode.toLowerCase !== undefined) {
            const respuesta = await fetch(urlOrNode);
            textoHtml = await respuesta.text();
        }
        // en otro caso lo entendemos como un nodo HTML
        else {
            textoHtml = urlOrNode.innerHTML;
        }
        const keys = Object.keys(datos);
        const plantilla = new Function(...keys, `return \`${textoHtml}\`;`);
        const values = Object.values(datos);
        return plantilla(...values);
    } catch (error) {
        console.error(error);
        return "Error en función renderFile, " + error.name + ': ' + error.message + ' -> ' + error.stack;
    }
};