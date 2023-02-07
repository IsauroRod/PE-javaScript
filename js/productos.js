function calcularMonto(objeto)
{
    //calcula el monto de un producto
    let cantidad = (objeto.precio*objeto.cantidad)
    return cantidad
}

function generarProducto()
{
    //Esta funcion crea y agrega la plantilla de cada producto en el DOM 
    const div = document.getElementById("objetos-venta")

    for(const producto of productos)
    {
        
        let plantilla = `
            <span class="box-article-photo">
                <img class="vender-imagen" src="${producto.foto}" alt="${producto.descripcion}">
                <span class="vender-precio">$${producto.precio}</span>
            </span>
            
            <span class="venta-texto">${producto.nombre}</span>
            <span class="botones-vender" id="${producto.id}">
                <input type="button" value="-" class="boton-estilo boton-redondo btn-menos">
                <input type="button" value="Restart" class="boton-estilo btn-reiniciar">
                <input type="button" value="+" class="boton-estilo boton-redondo btn-mas">
            </span>`
        articulo = document.createElement('article')
        articulo.className = 'vender'
        articulo.innerHTML = plantilla
        div.appendChild(articulo)
    }


}
