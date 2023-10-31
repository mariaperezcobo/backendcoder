console.log('cargado desde public')



const socket = io()


// const user = prompt('name')
// document.querySelector('#chatinput').addEventListener('keyup', event =>{
//     if(event.key === 'Enter' && event.currentTarget.value.trim().length>0){
//         sendMessage(event.currentTarget.value)
//     }
    
// })

// function sendMessage(message){
//     socket.emit('message', {user, message })
// }


// socket.on('logs', messages =>{
//     const box = document.querySelector('#chatbox')
//     let html =''

//     messages.forEach(message => {
//         html += `<p>${message.user} ${message.message}</p>`
//     });

//     box.innerHTML = html

// })


const containerProducts = document.querySelector('.contenedorProductos')

socket.on('actualizarProductos', data=>{

    containerProducts.innerHTML +=`
    
    <div class="card container" style="width: 25rem;">
    <img src="${data.thumbnail}" class="card-img-top" alt="Placeholder Image">
    <div class="card-body">

    <h5 class="card-title">${data.title}</h5>
    <p class="card-text">${data.price}</p>
    <a href="#" class="btn btn-primary">Agregar al carrito</a>
    </div>
    </div>
    
    `
})

socket.on('eliminarProducto', data =>{
    containerProducts.innerHTML = ''

    data.forEach(product => {

        containerProducts.innerHTML +=`
    
    <div class="card container" style="width: 25rem;">
    <img src="${product.thumbnail}" class="card-img-top" alt="Placeholder Image">
    <div class="card-body">

    <h5 class="card-title">${product.title}</h5>
    <p class="card-text">${product.price}</p>
    <a href="#" class="btn btn-primary">Agregar al carrito</a>
    </div>
    </div>
    `  
    })

})