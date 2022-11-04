const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

//GET route for all categorties
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      //includes associated products
      include: [{ model: Product}],
    });
    //status : was successful
    res.status(200).json(categoryData);
  } catch (err) {
    //status: unexpected condition prevents request from being fulfilled
    res.status(500).json(err);
  }
});


//GET route for single category by it's id
router.get('/:id', async (req, res) => {
  try{
    //search for data by primary key
    const categoryData = await Category.findByPk(req.params.id, {
    //includes associated products
      include: [{model: Product}],
    });
    if(!categoryData){
      //status: not found
      res.status(404).json({message: "Can't retrieve category: id not found."});
      return;
    }
    res.status(200).json(categoryData);
  } catch(err) {
    res.status(500).json(err);
  }
});


//POST route to create a new category
router.post('/', async (req, res) => {
  try{
    const categoryData = await Category.create({
      //wrong?
      category_name: req.body.category_name,
    });
    res.status(200).json(categoryData);
  } catch (err) {
    //probable client error
    res.status(400).json(err);
  }
});


//UPDATE a category by a id
router.put('/:id', async (req, res) => {
  try{
    const categoryData = await Category.update(req.body, {
      where: {
      //looks for a specific id in the categories
        id: req.params.id,
      },
    });
    if(!categoryData){
      res.status(404).json({message: "Can't update category: id not found."});
      return;
    }
    res.status(200).json(categoryData);
  } catch(err) {
    res.status(500).json(err);
  }
});


//DELETE a category
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if(!categoryData){
      res.status(404).json({message: "Can't delete category: id not found."});
      return;
    }
    res.status(200).json(categoryData);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
