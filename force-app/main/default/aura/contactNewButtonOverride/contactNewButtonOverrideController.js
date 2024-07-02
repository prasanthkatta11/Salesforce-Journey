({
  init: function (component, event, helper) {
    var isActionOverride = component.isInstanceOf("lightning:actionOverride");
    var isGlobalAction = component.isInstanceOf("force:lightningQuickAction");

    console.log("Is Action Override:", isActionOverride);
    console.log("Is Global Action:", isGlobalAction);

    // Set attributes based on these checks
    component.set("v.isActionOverride", isActionOverride);
    component.set("v.isGlobalAction", isGlobalAction);

    // Further logic based on these attributes
    if (isActionOverride) {
      // For action overrides, display in a modal
      component.set("v.isModalOpen", true);
    } else if (isGlobalAction) {
      // For global actions, display in the default window (not in a modal)
      component.set("v.isModalOpen", false);
    }
  },

  handleCloseModal: function (component, event, helper) {
    // Handle close modal logic if needed
    component.set("v.isModalOpen", false);
  }
});