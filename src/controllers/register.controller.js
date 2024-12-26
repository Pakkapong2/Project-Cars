const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Store files in the 'images' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()); 
  }
});

const upload = multer({ storage: storage });

  exports.create = async (req, res) => {
    // Use upload.single middleware to handle file upload
    upload.single('picture')(req, res, async (err) => { 
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      const { username, password, name, lastname, email, address, tel, userTypeId } = req.body;
      const picture = req.file ? req.file.filename : null; // Get filename if uploaded
  
      try {
        const users = await prisma.user.create({
          data: {
            username,
            password,
            name,
            lastname,
            email,
            address,
            tel,
            picture,
            userTypeId:parseInt(userTypeId)
          },
        });
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  };

  exports.get = async (req, res) => {
 
    const users = await prisma.user.findMany(
    );
  res.json(users);
  };

  exports.getById = async (req,res) =>{
    const {id} = req.params;
    const users = await prisma.user.findUnique({
      where:{
        id: parseInt(id)
      }
    })
    res.json(users);
  }


  exports.update = async (req, res) => {
  
    upload.single('picture')(req, res, async (err) => { 
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      const { username, password, name, lastname, email, address,tel,userTypeId } = req.body;
      const picture = req.file ? req.file.filename : null; 
  
      try {
        const { id } = req.params
        const users = await prisma.user.update({
          where:{
            id:parseInt(id)
          },
          data: {
            username,
            password,
            name,
            lastname,
            email,
            address,
            tel,
            picture,
            userTypeId
          },
        });
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  };

  exports.delete = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      // ลบโพสต์ทั้งหมดที่เชื่อมโยงกับผู้ใช้
      await prisma.post.deleteMany({
        where: { userId: parseInt(id) },
      });
  
      // ลบผู้ใช้งาน
      const user = await prisma.user.delete({
        where: {
          id: parseInt(id),
        },
      });
  
      res.json({ message: "User and related posts deleted successfully", user });
    } catch (error) {
      if (error.code === 'P2003') {
        res.status(400).json({
          message: "Cannot delete user: Foreign key constraint violation",
        });
      } else {
        console.error("Error deleting user:", error); // Log สำหรับตรวจสอบ
        res.status(500).json({ error: error.message });
      }
    }
  };
  