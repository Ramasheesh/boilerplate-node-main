exports.update = (entitiesToUpdate, existingModel) => {
    for (var key in entitiesToUpdate) {
      if (entitiesToUpdate[key] || typeof entitiesToUpdate[key] === "boolean")
        existingModel[key] = entitiesToUpdate[key]; //change if exist otherwise add in it
    }
    return existingModel;
  }