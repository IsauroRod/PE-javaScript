//productos del carrito
let galChoco = 0
let galVai = 0
let tortaCoco = 0
let monto = 0
//precios
const preChoco = 250
const preVai = 250
const preCoco = 1000
//datos usuario
let nombreYape
let nroTelefonico
let documento
let direccion
let correoElec
//variable de la opcion
let opc

menuPrincipal()

function menuPrincipal()
{
    userCreate()
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
                carrito()
                break
            case 3:
                pagar()
                break
            case 4:
                modificarUser()
                break
        }
    }while (opc != 0)
}

function comprar()
{
    let opcCompra 
    do
    {
        monto = (galChoco * preChoco) + (galVai*preVai) + (tortaCoco*preCoco)
        opcCompra = parseInt(prompt('Que desea comprar (0 para salir): \n 1: Galletas de Chocolate \n 2: Galletas de Vainilla \n 3: Torta de coco \n 4: Reiniciar carrito \n 5: Ver carrito'))
        switch(opcCompra)
        {
            case 0:
                alert('Va a volver al menu de inicio :)')
                break
            case 1:
                galChoco = agregarProducto('galletas de chocolate', galChoco)
                break
            case 2:
                galVai = agregarProducto('galletas de vainilla', galVai)
                break
            case 3:
                tortaCoco = agregarProducto('tortas de coco', tortaCoco)
                break
            case 4:
                reiniciarCarrito()
                alert('El carrito se reinicio con exito')
                break
            case 5:
                carrito()
                break

            default:
                alert('Error!! Por favor ingrese una opcion valida')
        }
    }while (opcCompra != 0)

    
}

function carrito()
{
    alert('Productos del carrito      Precio \n Galletas de chocolate: '+ galChoco+' \t '+ '$'+(galChoco * preChoco) + '  \n Galletas de vainilla: '+ galVai +' \t   '+ '$'+(galVai * preVai)+' \n Tortas de coco: '+ tortaCoco +'\t  '+ '$'+(tortaCoco*preCoco) + '\n Total:  '+'$'+monto)
}

function verificarNegativo(prod)
{
    if (prod < 0 || isNaN(prod))
    {
        prod = 0
    }
    return prod
}

function userCreate()
{
    nombreYape = verificarTipo(prompt('Ingrese su nombre y apellido: '),2, 'nombre y apellido' )
    nroTelefonico = verificarTipo(prompt('Ingrese su nro telefonico: '),1, 'nro telefonico')
    documento = verificarTipo(prompt('Ingrese su documento: '),1, 'documento')
    direccion = prompt('Ingrese su direccion: ')
    correoElec = prompt('Ingrese su correo electronico: ')
}

function modificarUser()
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
                    nombreYape = verificarTipo(prompt('Ingrese su nuevo nombre y apellido: '),2,'nombre y apellido')
                    break
                    
                case 2:
                    nroTelefonico = verificarTipo(prompt('Ingrese su nuevo nro telefonico: '),1,'nro telefonico')
                    break
                case 3:
                    documento = verificarTipo(prompt('Ingrese su nuevo documento: '),1,'documento')
                    break
                case 4:
                    direccion = prompt('Ingrese su nueva direccion: ')
                    break
                case 5:
                    correoElec = prompt('Ingrese su nueva direccion: ')
                    break
                
                default:
                    alert('Error!! Por favor ingrese una opcion valida')

            }

        }while(opcMod != 0)
    alert('Sus nuevos datos de usuario son: \nNombre: '+nombreYape+'\nNro telefonico: '+nroTelefonico + '\nDocumento: '+ documento + '\nDireccion: '+direccion)
}

function agregarProducto(prod, cantProd)
{
    cantProd += parseInt(prompt('Cuantas '+ prod +' quiere agregar al carrito (numero con - para disminuir cantidad)'))
    cantProd = verificarNegativo(cantProd)
    alert('Se sumo la cantidad deseada con exito')
    return cantProd
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

function pagar()
{
    if(monto == 0)
    {
        alert('Su carrito esta vacio porfavor, rellenelo antes de intentar pagar')
    }
    else
    {
        if(!(entrega()))
        {
            monto += 500
        }

        mensaje=' El monto a pagar es de '+monto+'\n El pago se realiza por transaccion \n Enviar el dinero al siguiente CVU: 120312983910248 \n alias: abcdef \n CUIT: 20-19238140-1 \n Enviar el comprobante de la transaccion al siguiente correo: abcde@gmail.com \n La transaccion fue realizada?'
        if(confirm(mensaje))
        {
            alert(' \n Muchas gracias por comprar nuestros productos :)' )
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
    galChoco = 0
    galVai = 0
    tortaCoco = 0
    monto = 0
}