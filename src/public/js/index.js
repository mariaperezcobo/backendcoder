console.log('cargado desde public')

const socket = io()

const messages = []

if(window.location.pathname === '/chat'){
    
    // let user = localStorage.getItem('user') ||''
   
    // if(!user){
    //     user = prompt('name')
        
    //         sessionStorage.setItem('user', user)
    //         console.log(user)
        
        
    // }
    let user = prompt('name')
    console.log(user)
    
    // const input = document.querySelector('#chatinput')

    document.querySelector('#chatinput').addEventListener('keyup', event =>{
        if(event.key === 'Enter' && event.currentTarget.value.trim().length>0){
            sendMessage(event.currentTarget.value)
        }
        
    })

    // document.querySelector('#send').addEventListener('click', event =>{
    //         sendMessage(input.value)
        
    // })
    
    function sendMessage(message){
        if( message.trim().length>0){
            socket.emit('message', {user, message })
            console.log(user, message)
        }
        
    }
    
    
    socket.on('logs', messages =>{
        console.log(messages)
        const box = document.querySelector('#chatbox')
        let html =''
    
        messages.reverse().forEach(message => {
            html += `<p><i>${message.user}</i> ${message.message}</p>`
        });
    
        box.innerHTML = html

    })

}



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






