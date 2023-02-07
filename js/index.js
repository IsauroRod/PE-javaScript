
class Usuario
{
    constructor(nombre, apellido, correo, numero,  documento, direccion)
    {
        this.nombre = nombre
        this.apellido = apellido
        this.correo = correo
        this.numero = numero
        this.documento = documento
        this.direccion = direccion
        
    }

}

// En este punto se generan los objetos y se obtiene del session y local storage el usuario y el carrito segun corresponda
//Si el carrito no existe en el storage simplemente se le asigna el array vacio
//Si el usuario no existe(cerro la ventana/reinicio la computadora) se le asigna undefined, asi ingresa a la creacion de usuario(la funcion la llame modificarUsuario, pero sirve para ambas cosas), seria util en el caso de una notebook o una computadora familiar
//si una nueva persona entrara o entras desde otro lugar, tenes la obligacion de colocarlos nuevamente y con esto se evitaran errores

let productos
let carrito = JSON.parse(localStorage.getItem('carrito')) || []
let usuario = JSON.parse(sessionStorage.getItem('usuario')) || undefined

function getProducts()
{
    fetch('../data/productos.json')
    .then((resp) => resp.json())
    .then(data =>
        {
            productos = data
            cargarPagina()
        })
}

function principal()
{
    //Esta funcion se encarga de ver donde se esta clickeando y segun cual click se haga, se enviara a una funcion diferente
    const formulario = document.getElementById('formulario')
    formulario.addEventListener('click', (e) =>
    {
        e.preventDefault()
        if(e.target.parentNode.classList.contains('botones-vender')) //se entrara en esta opcion, si se toca en algunos de los botones de algun producto (+, - o reiniciar)
        {
            modificarCantidad(e)
        }
        if((e.target.classList.contains('boton-procesar') && (usuario == undefined)) || (e.target.id =='btn-usuario')) 
        {   
            
            //se entrara en esta opcion si el usuario no existe y el mismo quiere ya ir al pago o si el mismo quiere modificar su usuario presionando el boton usuario
            ocultarBoton("btn-usuario")
            modificarUsuario()
        }
        if((e.target.classList.contains('boton-procesar') && (usuario != undefined))||e.target.classList.contains('btn-usuario-listo'))
        {
            //se entrara en esta opcion si se toca el boton de ir al pago (es el que dice "procesar pedido") o si el usuario guarda sus datos
            prepararVenta()
        }
        if(e.target.classList.contains('btn-pago'))
        {
            //Se entrara a esta opcion una vez el usuario haya tocado el boton "Ya pague", osea que hizo la transferencia
            ocultarBoton("btn-usuario")
            Swal.fire({
                icon: 'success',
                title: 'Pago realizado',
                text: 'Su pago sera procesado en las proximas 24 horas, el pedido llegara a su casa en los proximos 3 dias habiles. Muchas gracias por comprar con nosotros'
            })
            reiniciarDatos()
        }

    })
}

function cargarPagina()
{
    //esta funcion sera utilizada para cargar lo que existe en el localStorage, osea modificar las cantidades y el total que se ve en la hoja 
    //Ademas genera los productos que se estan vendiendo
    generarProducto()
    calcularMontoTotal(false)
    for(producto of carrito)
    {
        modificarListaPedido(producto)
    }
    
}

function calcularMonto(objeto)
{
    //calcula el monto de un producto
    let cantidad = (objeto.precio*objeto.cantidad)
    return cantidad
}

function verificarNegativo(objeto)
{
    //verifica si un producto entro en numeros negativos para arreglar este posible error
    if (objeto.cantidad < 0)
    {
        objeto.cantidad = 0
    }
}

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

function ocultarBoton(nombreBoton)
{
    //oculta un boton recibiendo su nombre como parametro
    boton = document.getElementById(nombreBoton)
    boton.classList.replace("btn-on", "btn-off")
}

function mostrarBoton(nombreBoton)
{
    //muestra un boton recibiendo su nombre como parametro
    boton = document.getElementById(nombreBoton)
    boton.classList.replace("btn-off", "btn-on")
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

    ACLARACION:
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

function crearFormUsuario()
{
    //crea la plantilla para el formulario utilizado en la creacion de usuario
    plantilla = `
    <label for="" class="d-block">Nombre</label>
    <input type="text" class="datos-usuario mb-2" value="${usuario?.nombre || "Nombre"}" required>
    <label for="" class="d-block">Apellido</label>
    <input type="text" class="datos-usuario mb-2" value="${usuario?.apellido || "Apellido"}" required>
    <label for="" class="d-block">Mail</label>
    <input type="email" class="datos-usuario mb-2" value="${usuario?.correo || "Mail"}" required>
    <label for="" class="d-block">Numero telefonico</label>
    <input type="tel" class="datos-usuario mb-2" value="${usuario?.numero || "Numero de Telefono"}" required>
    <label for="" class="d-block">Documento</label>
    <input type="tel" class="datos-usuario mb-2" value="${usuario?.documento || "Documento"}" required>
    <label for="" class="d-block">Direccion</label>
    <input type="text" class="datos-usuario mb-2" value="${usuario?.direccion || "Direccion"}" required>
    <button class="d-block mt-2 btn-usuario-listo boton-estilo">Guardar</button>`

  return plantilla
}

function modificarUsuario()
{
    //agrega el formulario al dom, y luego cuando el usuario quiera guardar, crea un objeto usuario con esos datos y los asigna a la variable global usuario ademas lo agrega al sessionStorage
    const contenedorVenta = document.getElementById("contenedor-venta")
    contenedorVenta.innerHTML = crearFormUsuario()
    contenedorVenta.addEventListener("click", (e) => 
    {
        e.preventDefault()
        if(e.target.classList.contains('btn-usuario-listo'))
        {
                const datos = document.getElementsByClassName("datos-usuario")
                usuario = new Usuario(datos[0].value, datos[1].value, datos[2].value, datos[3].value, datos[4].value, datos[5].value)

                usuarioJson =JSON.stringify(usuario)
                sessionStorage.setItem('usuario',usuarioJson)
        }
    })
    
}
getProducts()
principal()