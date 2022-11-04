const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

//GET route for all tags
router.get('/', async (req, res) => {
  try{
    const tagData = await Tag.findAll({
      //include associated products
      include: [{model: Product}]
    });
    //status: was successful
    res.status(200).json(tagData);
  } catch (err){
    //status: unexpected condition prevents request from being fulfilled
    res.status(500).json(err);
  }
});


//GET route for a single tag by it's id
router.get('/:id', async (req, res) => {
  try{
    //search by primary key
    const tagData = await Tag.findByPk(req.params.id,{
      //JOIN with product using the product tag
      include: [{model: Product}]
    });
  if(!tagData) {
    //status: not found
    res.status(404).json({message: "Can't retrieve tag: id not found."});
    return;
  }
    res.status(200).json(tagData);
  } catch(err){
    res.status(500).json(err);
  }
});


//POST route to create a new tag
router.post('/', async (req, res) => {
  try{
    const tagData = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.status(200).json(tagData);
  } catch (err) {
    //probable client error
    res.status(400).json(err);
  }
});


//UPDATE a tag by a id
router.put('/:id', async (req, res) => {
  try{
    const tagData = await Tag.update(req.body, {
      where: {
      //looks for a specific id in the categories
        id: req.params.id,
      },
    });
    if(!tagData){
      res.status(404).json({message: "Can't update tag: id not found."});
      return;
    }
    res.status(200).json(tagData);
  } catch(err) {
    res.status(500).json(err);
  }
});


//DELETE a tag
router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if(!tagData){
      res.status(404).json({message: "Can't delete tag: id not found."});
      return;
    }
    res.status(200).json(tagData);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
