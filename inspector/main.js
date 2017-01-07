function loadInspector() {
  lively.openComponentInWindow('lively-dom-inspector', null, null).then((inspector) => {
    var container = document.createElement('lively-container');
    container.id = 'inspector-content';
    container.setAttribute('load', 'auto');
    container.style.width = "calc(100%)";
    container.style.height = "calc(100%)";
    container.setAttribute('data-lively4-donotpersist', 'all');
    lively.components.openIn(inspector.get('#container'), container).then(() => {
        container.__ingoreUpdates = true;
        container.get('#container-content').style.overflow = 'visible';
    }).then(() => {
      inspector.inspect(inspector.get('#inspector-content'));
    });
  });
}
