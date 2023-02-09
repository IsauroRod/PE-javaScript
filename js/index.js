// En este punto se generan los objetos y se obtiene del session y local storage el usuario y el carrito segun corresponda
//Si el carrito no existe en el storage simplemente se le asigna el array vacio
//Si el usuario no existe(cerro la ventana/reinicio la computadora) se le asigna undefined, asi ingresa a la creacion de usuario(la funcion la llame modificarUsuario, pero sirve para ambas cosas), seria util en el caso de una notebook o una computadora familiar
//si una nueva persona entrara o entras desde otro lugar, tenes la obligacion de colocarlos nuevamente y con esto se evitaran errores

let productos
let carrito = JSON.parse(localStorage.getItem('carrito')) || []
let usuario = JSON.parse(sessionStorage.getItem('usuario')) || undefined

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
                title: 'Pedido tomado',
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

document.addEventListener('DOMContentLoaded', getProducts())
document.addEventListener('DOMContentLoaded', principal())