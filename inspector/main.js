function loadInspector() {
  lively.openComponentInWindow('lively-dom-inspector', null, null).then((inspector) => {
      inspector.inspect(this.document);
  });
}
