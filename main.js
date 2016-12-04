function loadInspector() {
  lively.openComponentInWindow('lively-dom-inspector', null, null).then((inspector) => {
      inspector.inspect(this.document);
  });
}

function sliderAction(newValue) {
  switch(newValue) {
    case "0":
      hideContainer();
      break;
    case "1":
      showContainer();
      break;
    case "2":
      showZoomView();
      break;
    default:
      console.log("error");
  }
}
