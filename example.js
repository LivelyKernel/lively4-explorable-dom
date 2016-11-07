  function showExplorableDOM() {
    var domElements = document.getElementById('main-content').getElementsByTagName('*');
    for(i = 0; i < domElements.length; i++) {
      copyElement(domElements[i]);
    }
    window.setTimeout(function(){
      deleteAllCreatedElements();
    }, 3000);
    console.log(domElements);
  }
  
  function copyElement(element) {
    newElement = document.createElement('div');
    newElement.style.backgroundColor = getRandomColor();
    newElement.style.top = element.getBoundingClientRect().top; 
    newElement.style.left = element.getBoundingClientRect().left; 
    newElement.style.width = element.offsetWidth;
    newElement.style.height = element.offsetHeight;
    newElement.style.position = 'absolute';
    newElement.style.opacity = '0.2';
    newElement.classList.add('created');
    
    document.body.appendChild(newElement);
  }
  
  function deleteAllCreatedElements() {
    var elements = document.getElementsByClassName('created')
    while(elements.length > 0) {
      elements[0].remove();
    }
  }
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}