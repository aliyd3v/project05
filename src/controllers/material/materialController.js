const { validationResult, matchedData } = require("express-validator");
const { Material } = require("../../models/materialModel");

exports.getCreateMaterial = async (req, res) => {
  res.render("create-material", {
    title: "Create material",
    isCreateMaterial: true,
  });
};
exports.createMaterial = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).send({
        success: false,
        data: null,
        error: errorMessages,
      });
    }
    const data = matchedData(req);

    const newMaterial = await Material.create({
      name: data.name,
      quantity: data.quantity,
      createdAt: new Date()
    });

    res.redirect('/api/materials')
  } catch (error) {
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const material = await Material.find();

    res.render("materials", {
      title: "Materials",
      isMaterials: true,
      material,
    });

    if (!material) {
      return res.status(404).send({
        success: false,
        error: "Material not found!",
      });
    }
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
};

exports.addToMaterial = async (req, res) => {
  const { params: { id } } = req
  try {
    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        data: null,
        error: "ID is not valid",
      });
    }

    // Checking material for exists.
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).send({
        success: false,
        data: null,
        error: { message: "Material is not found!" }
      })
    }

    // Validation result.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).send({
        success: false,
        data: null,
        error: errorMessages,
      });
    }
    const data = matchedData(req);

    // Writing changes to database.
    const update = await Material.findByIdAndUpdate(id, {
      ...material,
      updatedAt: new Date(),
      quantity: material.quantity + data.quantity
    })

    // Responsing.
    return res.status(201).send({
      success: true,
      error: false,
      data: { message: "Material is added successful." }
    })
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
}
exports.reduceFromMaterial = async (req, res) => {
  const { params: { id } } = req
  try {
    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        data: null,
        error: "ID is not valid",
      });
    }

    // Checking material for exists.
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).send({
        success: false,
        data: null,
        error: { message: "Material is not found!" }
      })
    }

    // Validation result.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).send({
        success: false,
        data: null,
        error: errorMessages,
      });
    }
    const data = matchedData(req);

    if (material.quantity < data.quantity) {
      return res.status(400).send({
        success: false,
        data: null,
        error: { message: "Kiritayotgan miqdoringiz bazadagi miqdordan ko'p!" }
      })
    }

    // Writing changes to database.
    const update = await Material.findByIdAndUpdate(id, {
      ...material,
      updatedAt: new Date(),
      quantity: material.quantity - data.quantity
    })

    // Responsing.
    return res.status(201).send({
      success: true,
      error: false,
      data: { message: "Material is reduced successful." }
    })
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
}

exports.getOneMaterial = async (req, res) => {
  const id = req.params.id;
  try {
    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        data: null,
        error: "ID is not valid",
      });
    }

    const material = await Material.findById(id);

    res.render("material", {
      title: "Material",
      material,
    });
  } catch (error) {
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
};

exports.getUpdateMaterial = async (req, res) => {
  const id = req.params.id;

  try {
    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        data: null,
        error: "ID is not valid",
      });
    }
    const material = await Material.findById(id);

    return res.render("material-update", {
      title: 'Update material',
      material
    });
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
};

exports.updateMaterial = async (req, res) => {
  const id = req.params.id;
  try {
    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        data: null,
        error: "ID is not valid",
      });
    }

    // Error handling.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).send({
        success: false,
        data: null,
        error: errorMessages,
      });
    }
    const data = matchedData(req);

    // Writing changes to database.
    const oldMaterial = await Material.findById(id);
    const updateData = {
      name: data.name,
      quantity: data.quantity,
      updatedAt: new Date(),
    };

    await Material.findByIdAndUpdate(id, {
      ...oldMaterial,
      ...updateData
    }, { new: true });

    res.redirect(`/api/material/${id}`)

  } catch (error) {
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
};

exports.getDdelteMaterial = async (req, res) => {
  try {

    const id = req.params.id;


    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        data: null,
        error: "ID is not valid",
      });
    }
    const material = await Material.findById(id)

    res.render('delete-material', {
      title: 'Delete material',
      material
    })

  } catch (error) {
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
}

exports.deleteMaterial = async (req, res) => {
  try {
    const id = req.params.id;

    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        data: null,
        error: "ID is not valid",
      });
    }

    await Material.findByIdAndDelete(id);

    res.redirect('/api/materials')

  } catch (error) {
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
};

exports.deleteAllMaterials = async (req, res) => {
  try {
    // Checking for exists.
    const materials = await Material.find()
    if (!materials) {
      // Responsing.
      return res.status(200).send({
        succes: true,
        error: false,
        message: "Materials is empty."
      })
    }

    // Deleting materials from database.
    await Material.deleteMany()

    // Responsning.
    return res.status(201).send({
      success: true,
      error: false,
      message: "Materials is deleted successful."
    })
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        success: false,
        data: null,
        error: error.message,
      });
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERVAL_SERVER_ERROR",
    });
  }
}