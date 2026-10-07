const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already in use",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        password,
      },
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// GET SINGLE USER BY ID
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { fullName, email, password },
    });

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    await prisma.booking.deleteMany({ where: { userId } });
    await prisma.userActivity.deleteMany({ where: { userId } });
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.password !== password) {
            return res.status(400).json({
                status: "error",
                message: "Invalid email or password",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Login successful",
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
        });
    }
};

