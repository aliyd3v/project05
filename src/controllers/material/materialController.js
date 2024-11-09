const { validationResult, matchedData } = require("express-validator");
const { Material } = require("../../models/materialModel");
const { Product } = require("../../models/productModel");

exports.getCreateMaterial = async (req, res) => {
  res.render("create-material", {
    title: "Create material",
  });
};

exports.createMaterial = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      // Alert.
      const alert = {
        success: false,
        message: errorMessages,
      };
      return res.render("create-material", {
        alert,
      });
    }
    const data = matchedData(req);

    const newMaterial = await Material.create({
      name: data.name,
      quantity: data.quantity,
      createdAt: new Date(),
    });

    // Alert.
    const alert = {
      success: true,
      message: `Material is created successful.`,
    };
    const material = newMaterial;

    // Rendering.
    res.render("material", {
      title: "Material",
      alert,
      material,
    });
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).redirect("/api/bad-request");
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERLA_SERVER_ERROR",
    });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    if (!materials) {
      return res.render("materials", {
        title: "Materials",
        isMaterials: true,
      });
    }

    const allMaterials = [];
    allMaterials.push(...materials);

    for (let i = 0; i < allMaterials.length; i++) {
      allMaterials[i].number = i + 1;
    }

    return res.render("materials", {
      title: "Materials",
      isMaterials: true,
      allMaterials,
    });
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).redirect("/api/bad-request");
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERLA_SERVER_ERROR",
    });
  }
};

exports.addToMaterial = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).redirect("/api/bad-request");
    }

    // Checking material for exists.
    const oldmaterial = await Material.findById(id);
    if (!oldmaterial) {
      // Alert.
      const alert = {
        success: false,
        message: "Material not found!",
      };

      const materials = await Material.find();

      const allMaterials = [];
      allMaterials.push(...materials);

      for (let i = 0; i < allMaterials.length; i++) {
        allMaterials[i].number = i + 1;
      }

      return res.render("materials", {
        title: "Materials",
        isMaterials: true,
        allMaterials,
        alert
      });
    }

    // Validation result.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      // Alert.
      const alert = {
        success: false,
        message: errorMessages,
      };
      return res.render("material-update", {
        alert,
      });
    }
    const data = matchedData(req);

    // Writing changes to database.
    const update = await Material.findByIdAndUpdate(
      id,
      {
        updatedAt: new Date(),
        quantity: Number(oldmaterial.quantity) + Number(data.quantity),
      },
      { new: true }
    );

    const material = await Material.findById(id)

    // Alert.
    const alert = {
      success: true,
      message: `Material quantity is added successful.`,
    };

    // Rendering.
    res.render("material", {
      title: "Material",
      alert,
      material,
    });
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).redirect("/api/bad-request");
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERLA_SERVER_ERROR",
    });
  }
};

exports.reduceFromMaterial = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).redirect("/api/bad-request");
    }

    // Checking material for exists.
    const oldmaterial = await Material.findById(id);
    if (!oldmaterial) {
      // Alert.
      const alert = {
        success: false,
        message: "Material not found!",
      };

      const materials = await Material.find();

      const allMaterials = [];
      allMaterials.push(...materials);

      for (let i = 0; i < allMaterials.length; i++) {
        allMaterials[i].number = i + 1;
      }

      return res.render("materials", {
        title: "Materials",
        isMaterials: true,
        allMaterials,
        alert
      });
    }

    // Validation result.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      // Alert.
      const alert = {
        success: false,
        message: errorMessages,
      };
      return res.render("material-update", {
        alert,
      });
    }
    const data = matchedData(req);

    if (oldmaterial.quantity < data.quantity) {
      // Alert.
      const alert = {
        success: false,
        message: "Kiritayotgan miqdoringiz bazadagi miqdordan ko'p!",
      };

      return res.render("material-update", {
        title: "Material update",
        material,
        alert,
      });
    }

    // Writing changes to database.
    const update = await Material.findByIdAndUpdate(
      id,
      {
        updatedAt: new Date(),
        quantity: oldmaterial.quantity - data.quantity,
      },
      { new: true }
    );

    const material = await Material.findById(id)

    // Alert.
    const alert = {
      success: true,
      message: `Material quantity is removed successful.`,
    };

    // Rendering.
    res.render("material", {
      title: "Material",
      alert,
      material,
    });
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).redirect("/api/bad-request");
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERLA_SERVER_ERROR",
    });
  }
};

exports.getOneMaterial = async (req, res) => {
  const id = req.params.id;
  try {
    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).redirect("/api/bad-request");
    }

    const material = await Material.findById(id);
    if (!material) {
      // Alert.
      const alert = {
        success: false,
        message: "Material not found!",
      };

      return res.render("materials", {
        title: "Materials",
        material,
        alert,
      });
    }

    return res.render("material", {
      title: "Material",
      material,
    });
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).redirect("/api/bad-request");
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERLA_SERVER_ERROR",
    });
  }
};

exports.getUpdateMaterial = async (req, res) => {
  const id = req.params.id;

  try {
    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).redirect("/api/bad-request");
    }

    const material = await Material.findById(id);

    if (!material) {
      // Alert.
      const alert = {
        success: false,
        message: "Material not found!",
      };

      return res.render("materials", {
        title: "Materials",
        material,
        alert,
      });
    }

    return res.render("material-update", {
      title: "Update material",
      material,
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
      return res.status(400).redirect("/api/bad-request");
    }

    const oldmaterial = await Material.findById(id);

    if (!oldmaterial) {
      // Alert.
      const alert = {
        success: false,
        message: "Material not found!",
      };

      const materials = await Material.find();

      const allMaterials = [];
      allMaterials.push(...materials);

      for (let i = 0; i < allMaterials.length; i++) {
        allMaterials[i].number = i + 1;
      }

      return res.render("materials", {
        title: "Materials",
        isMaterials: true,
        allMaterials,
        alert
      });
    }

    // Error handling.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      // Alert.
      const alert = {
        success: false,
        message: errorMessages,
      };
      return res.render("material-update", {
        alert,
      });
    }
    const data = matchedData(req);

    // Writing changes to database.
    const updateData = {
      name: data.name,
      quantity: data.quantity,
      updatedAt: new Date(),
    };

    const updatedMateril = await Material.findByIdAndUpdate(id, updateData);
    const material = await Material.findById(id)

    // Alert.
    const alert = {
      success: true,
      message: `Material is updated successful.`,
    };

    // Rendering.
    res.render("material", {
      title: "Material",
      alert,
      material,
    });
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).redirect("/api/bad-request");
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERLA_SERVER_ERROR",
    });
  }
};

exports.getDdelteMaterial = async (req, res) => {
  try {
    const id = req.params.id;

    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).redirect("/api/bad-request");
    }

    const material = await Material.findById(id);

    if (!material) {
      // Alert.
      const alert = {
        success: false,
        message: "Material not found!",
      };

      const materials = await Material.find();

      return res.render("materials", {
        title: "Materials",
        materials,
        isMaterials: true,
        alert,
      });
    }

    res.render("delete-material", {
      title: "Delete material",
      material,
    });
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).redirect("/api/bad-request");
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERLA_SERVER_ERROR",
    });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const id = req.params.id;

    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).redirect("/api/bad-request");
    }

    const material = await Material.findById(id);

    if (!material) {
      // Alert.
      const alert = {
        success: false,
        message: "Material not found!",
      };

      const materials = await Material.find();
      const allMaterials = [];
      allMaterials.push(...materials);

      for (let i = 0; i < allMaterials.length; i++) {
        allMaterials[i].number = i + 1;
      }

      return res.render("materials", {
        title: "Materials",
        allMaterials,
        isMaterials: true,
        alert,
      });
    }


    // Delete material from database.
    await Material.findByIdAndDelete(id);

    // Alert.
    const alert = {
      success: true,
      message: `Material is deleted successful.`,
    };

    const materials = await Material.find();
    const allMaterials = [];
    allMaterials.push(...materials);

    for (let i = 0; i < allMaterials.length; i++) {
      allMaterials[i].number = i + 1;
    }

    return res.render("materials", {
      title: "Materials",
      allMaterials,
      isMaterials: true,
      alert,
    });
  } catch (error) {
    // Error handling.
    console.log(error);
    if (error.message) {
      return res.status(400).redirect("/api/bad-request");
    }
    return res.status(500).send({
      success: false,
      data: null,
      error: "INTERLA_SERVER_ERROR",
    });
  }
};

exports.deleteAllMaterials = async (req, res) => {
  try {
    // Checking for exists.
    const materials = await Material.find();
    if (!materials) {
      // Responsing.
      return res.status(200).send({
        succes: true,
        error: false,
        message: "Materials is empty.",
      });
    }

    // Deleting materials from database.
    await Material.deleteMany();

    // Responsning.
    return res.status(201).send({
      success: true,
      error: false,
      message: "Materials is deleted successful.",
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
