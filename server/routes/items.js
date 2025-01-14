const express = require("express");
const { Item } = require("../models");

const router = express.Router();
router.use(express.json());

// Define your routes here
router.get("/", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const item = await Item.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
  try {
    
    const {name, description, price, category, image} = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: "All fields required" });
    }

    const newItem = await Item.create({
      name,
      description,
      price,
      category,
      image
    });
    
    res.status(201).json(newItem);

  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    await item.destroy();

    res.status(200).json({message: `Item with id ${id} has been deleted.`})
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    
    const {name, description, price, category, image} = req.body;

    const item = await Item.findByPk(req.params.id);
    console.log("item", item)

    if (!item) {
      return res.status(404).json({error: "Item not found."})
    }
    

    await item.update({
      name: name || item.name,
      description: description || item.description,
      price: price || item.price,
      category: category || item.category,
      image: image || item.image
    });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

module.exports = router;
