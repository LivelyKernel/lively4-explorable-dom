var container;

function showContainer() {
  var initialParent = document.getElementsByTagName('body')[0];
  var childElements = document.querySelectorAll('#main-content > *');
  
  // Create container view (create copied elements, etc.)
  container = new ContainerView(initialParent, childElements);
  
  // Make background less prominent
  setOpacity('0.3');
  
  // Prevent user from creating container view twice
  disableShowContainerButton(true);
  disableHideContainerButton(false);
  
  // Enable hierarchy button only if there are nested elements 
  if(container.getMaxNestedLevel() > 0) {
    disableNextHierarchyButton(false);
  }
  
  // Adapt slider position
  document.getElementById('slider').value = 1;
}

function hideContainer(){
  var content = document.getElementById('main-content');
  
  // Reset changes
  container.deleteElements();
  setOpacity('1');
  disableShowContainerButton(false);
  disableHideContainerButton(true);
  disableNextHierarchyButton(true);
  document.getElementById('slider').value = 0;
  
  // Width is lost within the transformation
  content.style.width = '100%';
}

// Shows next level of child elements
function showNextHierarchyLevel() {
  container.showNextHierarchyLevel();

  if(container.getShowedLevel() === container.getMaxNestedLevel()) {
    disableNextHierarchyButton(true);
  }
}
