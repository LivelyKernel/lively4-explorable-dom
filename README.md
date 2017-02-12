# lively4-explorable-dom

This tool defines different views on a website loaded in a lively-container and allows to explore different aspects of the websites' DOM. Currently, four views are available:

* Basic View: The elements/nodes of the DOM are highlighted with a border indicating the size of the element. Clicks are forwarded to the original element.
* Zoomable Elements View: This is an extension of the basic view.  Elements are enlarged when hovering over them and the node type is indicated.
* Zoom View: This is an extension of the basic view. All elements are enlarged, the node type is indicated, and additional information is provided when clicking on an element:
  * Time: The time of the execution of the forwarded click event.
  * ID: If given, the ID of the analyzed node.
  * Class: If given, the class(es) of the node.
* Code View: This is an extension of the basic view, more or less equal to the Zoom View. Instead of the additional information mentioned above, the underlying html tag is provided. Alls click events are intercepted and not forwarded to the element.

Moreover, the number of hierarchy levels is given for each view and the shown levels can be restricted. Additionally, the tool allows to filter the elements by their tag name and it allows switching between the different views whereby the selected hierarchy level is retained.

The tool can stay activated when editing the files. After the file is saved, the representation will be updated. Furthermore, it can be switched between files whereby the current view and the hierarchy level are retained.

## Architecture
The high-level architecture of the explorable DOM inspector:
![High-level architecture of the explorable DOM inspector](https://lively-kernel.org/lively4/lively4-explorable-dom/documentation/high_level_architecture.png)
