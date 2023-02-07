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
