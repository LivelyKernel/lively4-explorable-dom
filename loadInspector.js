function loadInspector() {
  lively.openComponentInWindow('lively-dom-inspector', null, null).then((inspector) => {
      inspector.windowTitle = 'DOM Inspector';
      inspector.inspect(this.document);
  });
}