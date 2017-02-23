# lively4-explorable-dom

This lively dom inspector tool defines different views on a website loaded in a lively-container and allows to explore different aspects of the websites' Document Object Model. Currently, four views are available:

* Basic View: The elements/nodes of the DOM are highlighted with a border indicating the size of the element. Clicks are forwarded to the original element.
* Zoomable Elements View: This is an extension of the basic view.  Elements are enlarged when hovering over them and the node type is indicated.
* Zoom View: This is an extension of the basic view. All elements are enlarged, the node type is indicated, and additional information is provided when clicking on an element:
  * Time: The time of the execution of the forwarded click event.
  * ID: If given, the ID of the analyzed node.
  * Class: If given, the class(es) of the node.
* Code View: This is an extension of the basic view, more or less equal to the Zoom View. Instead of the additional information mentioned above, the underlying html code is shown. All click events are intercepted and not forwarded to the element.

Moreover, the number of hierarchy levels is given for each view and the shown levels can be restricted. Additionally, the tool allows to filter the elements by their tag name and it allows switching between the different views whereby the selected hierarchy level is retained.

The tool can stay activated when editing the files. After the file is saved, the representation will be updated. Furthermore, it can be switched between files whereby the current view and the hierarchy level are retained.

## Example
The following screenshot shows the enabled `ZoomView` for the `example.html`.

![Screenshot of the lively-dom-inspector tool](https://lively-kernel.org/lively4/lively4-explorable-dom/documentation/lively_dom_inspector.png =800x341)

## Usage
Currently, the tool can be enabled as follows:
Browse to the `example.html` and click the `DOM inspector` button. This should open the DOM inspector tool window containing a browser (`lively-container`). With this you can browse the files. In order to switch the views, the slider in the navigation bar can be used. Additionally, one of the buttons can be used for selecting a desired view.

## Architecture
The diagram below shows the high-level architecture of the explorable DOM inspector. The implementation is based on the State Pattern.

![High-level architecture of the explorable DOM inspector](https://lively-kernel.org/lively4/lively4-explorable-dom/documentation/high_level_architecture.png)
