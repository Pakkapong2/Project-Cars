const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()); 
  }
});

const upload = multer({ storage: storage });


exports.get = async (req, res) => {
 
  const cars = await prisma.car.findMany(
  );
res.json(cars);
};
exports.getById = async (req,res) =>{
  const {id} = req.params;
  const cars = await prisma.car.findUnique({
    where:{
      id: parseInt(id)
    }
  })
  res.json(cars);
}
exports.create = async (req, res) => {
  
  upload.single('picture')(req, res, async (err) => { 
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { brand, model, license_plate, price_per_day, availability, location } = req.body;
    const picture = req.file ? req.file.filename : null; 

    try {
      const cars = await prisma.car.create({
        data: {
          brand,
          model,
          license_plate,
          price_per_day,
          availability:true,
          location,
          picture, // Store filename in the database
        },
      });
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};


exports.update = async (req, res) => {
  
  upload.single('picture')(req, res, async (err) => { 
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { brand, model, license_plate, price_per_day, availability, location } = req.body;
    const picture = req.file ? req.file.filename : null; 

    try {
      const { id } = req.params
      const cars = await prisma.car.update({
        where:{
          id:parseInt(id)
        },
        data: {
          brand,
          model,
          license_plate,
          price_per_day,
          availability:true,
          location,
          picture, // Store filename in the database
        },
      });
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const cars = await prisma.car.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.json(cars);
};