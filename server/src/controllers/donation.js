const Joi = require("joi");
const { donation, fund, user } = require("../../models");

exports.getDonations = async (req, res) => {
  try {
    let data = await donation.findAll({
      include: [
        {
          model: user,
          as: "usersDonate",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },{
          model: fund,
          as: "fund",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser", "idFund"],
      },
    });

    data = JSON.parse(JSON.stringify(data))

    data = data.map((item) => {
      return{
        ...item,
        proofAttachment: process.env.FILE_PATH + item.proofAttachment
      }
    })

    res.send({
      status: "success...",
      data
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};


exports.getDonation = async (req, res) => {
  try {
    let data = await donation.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: user,
          as: "usersDonate",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },{
          model: fund,
          as: "fund",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser", "idFund"],
      },
    });
    
    data = JSON.parse(JSON.stringify(data))

    res.send({
      status: "success...",
      data: {
        ...data,
        proofAttachment: process.env.FILE_PATH + data.proofAttachment
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


exports.getDonationByUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    let data = await donation.findAll({
      where: {
        idUser
      },
      include: [
        {
          model: user,
          as: "usersDonate",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },{
          model: fund,
          as: "fund",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        }
      ],
      attributes: {
        exclude: ["updatedAt", "idUser", "idFund"],
      },
    });
    data = JSON.parse(JSON.stringify(data))
    data = data.map((item) => {
      const dataFund = item.fund;
      const dataUser = item.usersDonate;
      delete item.fund;
      delete item.usersDonate;
      return{
        ...item,
        fullName: dataUser.fullName,
        title: dataFund.title,
        proofAttachment: process.env.FILE_PATH + item.proofAttachment
      }
    })

    res.send({
      status: "success...",
      data
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};


exports.addDonation = async (req, res) => {
  const schema = Joi.object({
    idFund: Joi.number().integer().required(),
    donateAmount: Joi.number().integer().min(4).required()
  });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  try {
    const dataBody = {...req.body};
    const newData = await donation.create({
      ...dataBody,
      proofAttachment: req.file.filename,
      idUser: req.user.id,
      status: "pending"
    })

    res.send({
      status: "success",
      data: {
        donation: newData
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};


exports.updateDonation = async (req, res) => {
  try {
    const { id } = req.params;

    await donation.update(req.body, {
      where: {
        id,
      },
    });
    
    let donationData = await donation.findOne({
      where: {
        id
      },
      include: [
        {
          model: fund,
          as: "fund",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "usersDonate",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    })

    donationData = JSON.parse(JSON.stringify(donationData))

    res.send({
      status: "success",
      data: donationData
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
