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