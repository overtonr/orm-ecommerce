const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//GET route for all products
router.get('/', async (req, res) => {
  try{
    const productData = await Product.findAll({
      //includes all associated products and tags
      include: [{model: Category},{model: Tag}]
    });
    //get rid of extra info: serialization
    const products = productData.map((product) => product.get({plain: true}));
    //status: was successful
    res.status(200).json(productData);
  } catch(err){
    //status: unexpected condition prevents request from being fulfilled
    res.status(500).json(err);
  }
});

//GET a single product
router.get('/:id', async (req, res) => {
  try{
    //search for data by primary key
    const productData = await Product.findByPk(req.params.id,{
      //includes associated tags, join through product tag
      include: [{model: Tag}]
    });
    if(!productData){
      res.status(404).json({message:"Can't retrieve product: id not found."});
      return;
    }
    res.status(200).json(productData);
  } catch(err){
    res.status(500).json(err);
  }
});


// // CREATE new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


//DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if(!productData){
      res.status(404).json({message: "Can't delete product: id not found."});
      return;
    }
    res.status(200).json(productData);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
