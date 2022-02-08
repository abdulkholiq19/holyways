const { user, fund } = require("../../models");


exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      include: [
        {
          model: fund,
          as: "funds",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser"],
          },
        }
      ],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};


exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await user.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        user : userId,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateUser= async (req, res) => {
  try {
    await user.update(req.body, {
      where: {
        id: req.user.id,
      },
    });

    res.send({
      status: "success",
      message: `Update user finished`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await user.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      data: {
        id : parseInt(id)
      }
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
