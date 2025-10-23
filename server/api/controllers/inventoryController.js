const Inventory = require("../schemas/inventorySchema");
const multer = require("multer");
const upload = require("../../config/multerConfig").single('image');

// Create a new inventory item
exports.createInventoryItem = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ status: "FAILED", message: "File upload error" });
    } else if (err) {
      return res.status(400).json({ status: "FAILED", message: err.message });
    }

    const  { partName, partCode, quantity, price, description } = req.body;
    const partImage = req.file ? `/uploads/inventory/${req.file.filename}` : null;

    // Validate required fields
    if (!partName || !partCode || !quantity || !price) {
      return res.status(400).json({ status: "FAILED", message: "Missing required fields" });
    }

    try {
      const newInventoryItem = new Inventory({
        partName,
        partCode,
        partImage,
        quantity,
        price,
        description,
      });

      const savedItem = await newInventoryItem.save();
      res.status(201).json({
        status: "SUCCESS",
        message: "Inventory item created successfully",
        data: savedItem,
      });
    } catch (error) {
      console.error("Error creating inventory item:", error);
      res.status(500).json({
        status: "FAILED",
        message: "An error occurred while creating the inventory item",
      });
    }
  });
};

// Fetch all inventory parts
exports.getAllInventoryParts = async (req, res) => {
  try {
    const parts = await Inventory.find();
    res.status(200).json(parts);
  } catch (error) {
    console.error("Error fetching inventory parts:", error);
    res.status(500).json({ status: "FAILED", message: "An error occurred while fetching inventory parts" });
  }
};

// Delete an inventory item
exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ status: "FAILED", message: "Item not found" });
    }
    res.status(200).json({ status: "SUCCESS", message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).json({ status: "FAILED", message: "An error occurred while deleting the item" });
  }
};


// Update an inventory item
exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, price } = req.body;
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { quantity, price },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ status: "FAILED", message: "Item not found" });
    }
    res.status(200).json({ status: "SUCCESS", message: "Item updated successfully", data: updatedItem });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(500).json({ status: "FAILED", message: "An error occurred while updating the item" });
  }
};

// Fetch inventory item by part code
exports.getInventoryByPartCode = async (req, res) => {
  try {
    const { partCode } = req.params;
    const part = await Inventory.findOne({ partCode });
    if (!part) {
      return res.status(404).json({ status: "FAILED", message: "Item not found" });
    }
    res.status(200).json(part);
  } catch (error) {
    console.error("Error fetching inventory item by part code:", error);
    res.status(500).json({ status: "FAILED", message: "An error occurred while fetching the item" });
  }
};

// Update inventory item by part code
exports.updateInventoryByPartCode = async (req, res) => {
  try {
    const { partCode } = req.params;
    const { quantity } = req.body;
    const part = await Inventory.findOneAndUpdate(
      { partCode },
      { $inc: { quantity } },
      { new: true }
    );
    if (!part) {
      return res.status(404).json({ status: "FAILED", message: "Item not found" });
    }
    res.status(200).json({ status: "SUCCESS", message: "Item updated successfully", data: part });
  } catch (error) {
    console.error("Error updating inventory item by part code:", error);
    res.status(500).json({ status: "FAILED", message: "An error occurred while updating the item" });
  }
};