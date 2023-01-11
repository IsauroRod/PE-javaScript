//para aclarar con respecto al html, todo esta siendo vinculado solo a la pagina en la que tengo pensado hacerlo andar, que es la pagina de pedido
carrito = []
let opc

class Producto
{
    constructor(nombre, precio, cantidad, id)
    {
        this.nombre = nombre
        this.precio = precio
        this.cantidad = cantidad
        this.id = id
    }

    calcularMonto()
    {
        return (this.precio*this.cantidad)
    }

    verificarNegativo()
    {
        if (this.cantidad < 0 || isNaN(this.cantidad))
        {
            this.cantidad = 0
        }
    }

}

class Cliente
{
    constructor(nombre, numero, documento, direccion, correo)
    {
        this.nombre = nombre
        this.numero = numero
        this.documento = documento
        this.direccion = direccion
        this.correo = correo
    }

    mostrarCliente()
    {
        alert('Sus datos de usuario son: \nNombre: '+this.nombre+'\nNro telefonico: '+this.numero + '\nDocumento: '+ this.documento + '\nDireccion: '+this.direccion+ '\nCorreo: '+this.correo)
    }

    modificarUsuario()
    {
        let opcMod
            do
            {
                opcMod = parseInt(prompt('Que desea modificar (0 para salir): \n 1: Nombre \n 2: nro Telefonico \n 3: Documento \n 4: Direccion \n 5: Correo Electronico'))
                switch(opcMod)
                {
                    case 0:
                        break

                    case 1:
                        this.nombre = verificarTipo(prompt('Ingrese su nuevo nombre y apellido: '),2,'nombre y apellido')
                        break
                        
                    case 2:
                        this.numero = verificarTipo(prompt('Ingrese su nuevo nro telefonico: '),1,'nro telefonico')
                        break
                    case 3:
                        this.documento = verificarTipo(prompt('Ingrese su nuevo documento: '),1,'documento')
                        break
                    case 4:
                        this.direccion = prompt('Ingrese su nueva direccion: ')
                        break
                    case 5:
                        this.correoElec = prompt('Ingrese su nueva direccion: ')
                        break
                    
                    default:
                        alert('Error!! Por favor ingrese una opcion valida')

                }

            }while(opcMod != 0)
        this.mostrarCliente()
    }

}

arrayProductos = [new Producto("Galleta de chocolate", 250, 0, 1), new Producto("Galleta de vainilla", 250, 0, 2), new Producto("Tarta de coco", 1000, 0, 3)]

menuPrincipal()

function menuPrincipal()
{
    const usuario = crearCliente()
    do
    {
        opc = parseInt(prompt('Ingrese la opcion que desea utilizar: \n Opcion 0: Salir \n Opcion 1: Agregar productos a carrito \n Opcion 2: Ver carrito \n Opcion 3: Pagar \n Opcion 4: Cambiar Informacion de Usuario'))
        switch(opc)
        {
            case 0:
                alert('Gracias por comprar con nosotros')
                break
            case 1:
                comprar()
                break
            case 2:
                verCarrito()
                break
            case 3:
                pagar(usuario)
                break
            case 4:
                usuario.modificarUsuario()
                break
        }
    }while (opc != 0)
}

function crearCliente()
{
    nombreYape = verificarTipo(prompt('Ingrese su nombre y apellido: '),2, 'nombre y apellido' )
    nroTelefonico = verificarTipo(prompt('Ingrese su nro telefonico: '),1, 'nro telefonico')
    documento = verificarTipo(prompt('Ingrese su documento: '),1, 'documento')
    direccion = prompt('Ingrese su direccion: ')
    correoElec = prompt('Ingrese su correo electronico: ') 
    return new Cliente(nombreYape, nroTelefonico, documento, direccion, correoElec)
}

function comprar()
{
    let opcCompra 
    let lista = arrayProductos
    do
    {
        
        opcCompra = parseInt(prompt('Que desea comprar (0 para salir): \n'+generarListaProductos(lista)+'\n-1: Reiniciar carrito \n-2: Ver carrito \n-3: Ordenar producto de mayor a menor \n-4: Ordenar productos de menor a mayor'))

        if(opcCompra == 0){
            alert('Va a volver al menu de inicio :)')

        } else if(opcCompra>0 &&  arrayProductos.length>= opcCompra){
            agregarProducto(arrayProductos[opcCompra - 1])

        } else if(opcCompra == -1){
            reiniciarCarrito()
            alert('El carrito se reinicio con exito')

        }else if(opcCompra == -2){
            verCarrito()
        }else if(opcCompra == -3){
            lista = ordenarMayorAMenor(arrayProductos)
        }else if(opcCompra == -4){
            lista = ordenarMenorAMayor(arrayProductos)


        }else {
            alert('Error!! Por favor ingrese una opcion valida')
        }

    }while (opcCompra != 0)

    
}

function ordenarMayorAMenor(listaOrdenar)
{
    return listaOrdenar.sort((a, b) => b.precio-a.precio)
}
function ordenarMenorAMayor(listaOrdenar)
{
    return listaOrdenar.sort((a, b) => a.precio-b.precio)
}


function generarListaProductos(lista)
{
    const arrayString = lista.map((producto,index) => 
        {
            return index+1 + ': '+producto.nombre + ' --> $'+producto.precio
        })
    return arrayString.join('\n')
}

function agregarProducto(producto)
{
    producto.cantidad += parseInt(prompt('Cuantas '+ producto.nombre +' quiere agregar al carrito (numero negativo para disminuir cantidad)'))
    producto.verificarNegativo()
    enCarrito = carrito.find(prodEn => prodEn.id === producto.id)
    if(producto.cantidad > 0 && (!enCarrito))
    {
        carrito.push(producto)
    }
    else if (producto.cantidad <= 0 && enCarrito)
    {
        const posicion = (carrito.indexOf(producto))
        carrito.splice(posicion, 1)
    }
    alert('Se cambio la cantidad deseada con exito')
}

function verCarrito()
{
    if (carrito.length != 0)
    {
        const stringCarrito = carrito.map(producto => 
            {
                return producto.cantidad +' '+producto.nombre + '\t--> $'+ (producto.calcularMonto())
            })
        alert('Productos del carrito\n'+stringCarrito.join('\n')+ '\nTotal: $'+ calcularMontoTotal())
    }
    else
    {
        alert('Porfavor ingrese productos al carrito')
    }
    
}

function calcularMontoTotal()
{
    const montoTotal = carrito.reduce((contador, producto) => contador + (producto.calcularMonto()), 0)
    return montoTotal
}


function pagar(usuario)
{
    let precioEntrega = 0
    if(carrito.length == 0)
    {
        alert('Su carrito esta vacio porfavor, rellenelo antes de intentar pagar')
    }
    else
    {
        if(!(entrega()))
        {
            precioEntrega = 500
        }

        let mensajeTransaccion = ' El monto a pagar es de $'+(calcularMontoTotal()+precioEntrega)+'\n El pago se realiza por transaccion \n Enviar el dinero al siguiente CVU: 120312983910248 \n alias: abcdef \n CUIT: 20-19238140-1 \n Enviar el comprobante de la transaccion al siguiente correo: abcde@gmail.com \n La transaccion fue realizada?'
        if(confirm(mensajeTransaccion))
        {
            let mensajeUsuario = 'Su pedido estara llegando en 5 dias habiles a la direccion: '+ usuario.direccion+ '\nAdemas podra recibir una llamada al numero que asigno: '+usuario.numero+ '\nDesea cambiar alguno de estos datos?'
            if(confirm(mensajeUsuario))
            {
                alert('Se lo llevara a la modificacion de usuario')
                usuario.modificarUsuario()
            }
            alert('Muchas gracias por comprar nuestros productos :)')
            reiniciarCarrito()
        }
        else
        {
            alert('Lamentamos que no haya comprado lo que tenia en el carrito, esperamos tener nuevos pedidos de usted (El carrito se mantendra por si aun quiere realizar la compra)')
        }
    }
}


function entrega()
{
    let ciclo = true
    let modoEntrega
    do
    {
        modoEntrega = parseInt(prompt('Seleccione una forma de entrega: \n 1: Retiro fisico \n 2: Envio por correo'))
        switch(modoEntrega)
        {
            case 1:
                return true
            case 2:
                return false
            default:
                alert('Porfavor ingrese una forma de envio de las posibles')
                break
        }
    }while(ciclo)
}

function reiniciarCarrito()
{
    for (const producto of arrayProductos)
    {
        producto.cantidad = 0
    }
    carrito = []
}


function verificarTipo(dato, opcTipo, stringDato)
{
    // 1 - verifica que sea dato numerico (documento o telefono)
    // 2 - verifica que sea un string (nombre apellido por ejemplo)

    switch(opcTipo)
    {
        case 1:
            while(isNaN(dato))
            {
                dato = parseInt(prompt('Porfavor, ingrese su '+ stringDato + ' correctamente: '))
            }
            break
        case 2:
            while(!(isNaN(dato)))
            {
                dato = parseInt(prompt('Porfavor, ingrese su '+ stringDato + ' correctamente: '))
            }
            break
    }

    return dato
}