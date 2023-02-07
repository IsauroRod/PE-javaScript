function verificarCarrito(objeto)
{
    //aca lo que se hace, es meter o sacar los productos del carrito y cambiar lo que se ve en la hoja segun corresponda
    pos = carrito.indexOf(objeto)
    if(pos != -1 && objeto.cantidad <= 0 )
    {  
        borrarPedidoObjeto(objeto)
        carrito.splice(pos, 1)

    }else if(pos === -1 && (objeto.cantidad > 0))
    {
        modificarListaPedido(objeto)
        carrito.push(objeto)
    }
    else if(objeto.cantidad > 0)
    {
        modificarListaPedido(objeto)
    }
    const carritoJSON = JSON.stringify(carrito)
    localStorage.setItem('carrito', carritoJSON)
}

function modificarCantidad(evento)
{
    // a partir de un evento, conoce por el padre del nodo de que objeto de trata
    //una vez aca, se determina que boton se pulso y se cambia la cantidad de ese objeto
    idObjeto = evento.target.parentNode.id
    let objeto = carrito.find(producto => producto.id == idObjeto) || productos.find(producto => producto.id == idObjeto)



    if(evento.target.classList.contains('btn-mas'))
     {
        objeto.cantidad++
     }else if(evento.target.classList.contains('btn-menos'))
     {
        objeto.cantidad--
        verificarNegativo(objeto)
     } else
    {
        
        objeto.cantidad = 0
    }
    
    verificarCarrito(objeto)
    calcularMontoTotal(false)

}

function verificarNegativo(objeto)
{
    //verifica si un producto entro en numeros negativos para arreglar este posible error
    if (objeto.cantidad < 0)
    {
        objeto.cantidad = 0
    }
}

function modificarListaPedido(objeto)
{ 
    //Esta funcion, es agregar un producto o cambiar su cantidad en la lista de la hoja
    const contenedor = document.getElementById("contenedor-texto-pedido")
    if(contenedor.querySelector('.'+objeto.id+'-ped') == null)
    {
        printearEnLista(objeto, contenedor)
    }
    else
    {
        printerCambioEnLista(objeto)
    }
    
}

function printearEnLista(objeto, contenedor)
{
    //Va agregando cada una de las partes de la hoja en cada iteracion en la zona del grid donde va, segun su orden
    texto = [objeto.nombre, objeto.cantidad, '$'+calcularMonto(objeto)]
    for(i=0; i<3;i++)
    {
        agregar = document.createElement('p')
        agregar.className = objeto.id+'-ped'
        agregar.innerText = texto[i]
        contenedor.appendChild(agregar)
    }
}

function printerCambioEnLista(objeto)
{
    //cambia la cantidad y el monto total de ese producto en la lista
    const objetoLista = document.getElementsByClassName(objeto.id+'-ped')
    objetoLista[1].innerText = objeto.cantidad
    objetoLista[2].innerText = '$'+calcularMonto(objeto)
}

function borrarPedidoObjeto(objeto)
{
    //borra el producto de la lista, tomando todos los nodo con esa clase especifica (sera dada por el id del objeto y un agregado) y eliminandolos uno por uno
    const contenedor = document.getElementById("contenedor-texto-pedido")
    const arrayHijos = document.getElementsByClassName(objeto.id+'-ped')
    contenedor.removeChild(arrayHijos[2])
    contenedor.removeChild(arrayHijos[1])
    contenedor.removeChild(arrayHijos[0])
}

function calcularMontoTotal(verif)
{
    //calcula el monto total, entre todos los productos que hay en el carrito
    //Esta funcion tiene 2 opcion, esta la opcion para retornar el valor del monto total o la opcion de modificarlo en el DOM segun haga falta
    //true --> retorna el valor
    //false --> cambia el DOM
    const montoTotal = carrito.reduce((contador, producto) => contador + (calcularMonto(producto)), 0)
    if(verif)
    {
        return montoTotal
    }
    const textoMonto = document.getElementById("total-pedido")
    textoMonto.innerText = "$"+montoTotal
}


function prepararVenta()
{
    //verifica si existen productos en el carrito, si no existen mostrara un mensaje para que el usuario vuelva y agregue
    //Y si existen, activara la plantilla con los datos del pago y la aclaracion
    //Ademas agrega el boton de listo, para que el usuario confirme que hizo la transferencia
    mostrarBoton("btn-usuario")
    const contenedorVenta = document.getElementById("contenedor-venta")
    let plantilla
    if(carrito.length == 0)
   {
    ocultarBoton("btn-pago")
     plantilla = "Error!!! Porfavor, ingrese productos a su carrito antes de intentar hacer el pago"
     contenedorVenta.innerText = plantilla
   }
   else
   {
    mostrarBoton("btn-pago")
    plantilla = `Hola ${usuario.nombre}!!
    El monto a pagar es de ${'$'+calcularMontoTotal(true)}
    El pago se realiza mediante transferencia
    Enviar el dinero a:
    CVU: 120312983910248
    Alias: abcdef
    CUIT: 20-19238140-1

    El pedido debera ser recibido
    por la persona con el numero de
    documento ${usuario.documento} o
    un adulto mayor de 18 años

    Asegurese que los datos
    a continuacion, son correctos

    Direccion: ${usuario.direccion}
    Telefono: ${usuario.numero}
    Mail: ${usuario.correo}
    
    Si necesita modificar alguno, utilice el boton usuario que se encuentra en la parte superior
    
    Una vez haya hecho el pago
    toque el boton de abajo
    que dice "Ya pague"`

    
    contenedorVenta.innerText = plantilla
   }
    
}

function pagoRealizado()
{
    //activa el boton de listo para que el usuario confirme la lectura de los datos del envio y cierra el colapse
    
}

function reiniciarDatos()
{
    //reinicia todos los datos de los productos en el carrito y los productos del localStorage, ademas calcula el monto total, para que en la lista, se vuelva a ver como 0
    for(const producto of carrito)
    {
        producto.cantidad = 0
        borrarPedidoObjeto(producto)
    }
    carrito = []
    localStorage.removeItem('carrito')
    calcularMontoTotal(false)
}