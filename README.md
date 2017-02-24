# lively4-explorable-dom

## Abstract
The lively DOM inspector tool bridges the gap between the rendered layout of a website und the underlying code. The user can explore different aspects of the websites' Document Object Model in single views. Thereby the views differ in their abstraction layers. The `basic view` for example outlines the border of every element, enabling the user to understand their dimensions. In addition to that, the `code view` shows implementation details like classes and styling information.
By going stepwise throug the views the user can explore the relation between the code and the resulting UI presentation. Thus it is easier to understand and modify the website.

### Example
The following screenshot shows the enabled `ZoomView` for the `example.html`.

![Screenshot of the lively-dom-inspector tool](https://lively-kernel.org/lively4/lively4-explorable-dom/documentation/lively_dom_inspector.png =800x341)

## Usage
Currently, the tool can be enabled as follows:
Browse to the `example.html` and click the `DOM inspector` button. This opens the lively DOM inspector tool window containing a browser (`lively-container`). With this you can browse the files. In order to switch the views, the slider in the navigation bar can be used. Additionally, one of the buttons can be used for selecting a desired view.

### Embed the tool (e.g. in right-click menu)
In order to embed the tool somwhere else just follow the two steps listed below.

1. Ensure that the template is loaded

  ```html
    <link rel="import" href="../lively4-explorable-dom/templates/lively-dom-inspector.html">
  ```

2. The following code snippet needs to be included

  ```javascript
    lively.openComponentInWindow(
      'lively-dom-inspector', null, {x: "calc(90%)", y: "calc(90%)"}
    ).then(inspector => inspector.inspect());
  ```


## Further details
The tool defines the different views on a website loaded in the browser (`lively-container`) of the tool. Currently, four views are available:

* **Basic View**: The elements/nodes of the DOM are highlighted with a border indicating the size of the element. Clicks are forwarded to the original element.
* **Zoomable Elements View**: This is an extension of the basic view.  Elements are enlarged when hovering over them and the node type is indicated.
* **Zoom View**: This is an extension of the basic view. All elements are enlarged, the node type is indicated, and additional information is provided when clicking on an element:
  * Time: The time of the execution of the forwarded click event.
  * ID: If given, the ID of the analyzed node.
  * Class: If given, the class(es) of the node.
* **Code View**: This is an extension of the basic view, more or less equal to the Zoom View. Instead of the additional information mentioned above, the underlying html code is shown. All click events are intercepted and not forwarded to the element.

Moreover, the number of hierarchy levels is given for each view and the shown levels can be restricted. Additionally, the tool allows to filter the elements by their tag name and it allows switching between the different views whereby the selected hierarchy level is retained.

The tool can stay activated when editing the files. After the file is saved, the representation will be updated. Furthermore, it can be switched between files whereby the current view and the hierarchy level are retained.

### Architecture
The diagram below shows the high-level architecture of the explorable DOM inspector. The implementation is based on the State Pattern.

![High-level architecture of the explorable DOM inspector](https://lively-kernel.org/lively4/lively4-explorable-dom/documentation/high_level_architecture.png)

The `DOM Inspector` component is the javscript file registering the template. Moreover it defines/binds event listeners for the navigation bar buttons, the slider, and the filter.

The `Explorable DOM Inspector` class is the key component creating and managing the different views, altering the tools UI and behavior depending on the different views (setting opacity, enabled/disable buttons, and so on). Due to this component there is a loose coupling between the template definition itself and the behavioural aspects of the tool. This enables an independent development of the lively dom inspector tool in this repository when moving the template back to the `lively-core` directory.

The different views contain the logic of creating the tool elements (and the according information/code elements) and define their behaviour (zoom, hover/click handling).

Consequently, there is a devision of the visual presentation (`Explorable DOM Inspector`) and the functional level (views). The encapsulation of the views makes it easy to extend the current views and to add new views.
