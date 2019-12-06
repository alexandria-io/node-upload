{
    const dropDown = document.getElementsByClassName('dropdown-menu')[0]
    document.getElementsByClassName('dropdown-toggle')[0].addEventListener('click', (e)=> {
        if(dropDown.classList.contains('show')){
            dropDown.classList.remove('show')
            dropDown.style.display = 'none'
        }else{
            dropDown.style.display = 'block'
            document.getElementsByClassName('dropdown-menu')[0].classList.add('show')
        }
    })
}