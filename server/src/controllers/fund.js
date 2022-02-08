const Joi = require("joi");
const { fund, user, donation } = require("../../models");


exports.getFunds = async (req, res) => {
  try {
    let data = await fund.findAll({
      include: [
        {
          model: donation,
          as: "donations",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser",  "idFund"],
          },
          include: [
            {
              model: user,
              as: "usersDonate",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            }
          ]
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });
    
    data = JSON.parse(JSON.stringify(data))

    const result = data.map(item=>{
      const nested = item.donations.map(x=>{
        const u = x.usersDonate;
        delete x.usersDonate;
        return {
          ...u,
          ...x,
          proofAttachment: process.env.FILE_PATH + x.proofAttachment
        }
      })
      delete item.usersDonate;
      delete item.donations;
      return {
        ...item,
        thumbnail: process.env.FILE_PATH + item.thumbnail,
        usersDonate:nested
      };
    })

    res.send({
      status: "success...",
      data : {
        funds : result
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

exports.getFundByUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    let data = await fund.findAll({
      where: {
        idUser
      },
      include: [
        {
          model: donation,
          as: "donations",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser",  "idFund"],
          },
          include: [
            {
              model: user,
              as: "usersDonate",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            }
          ]
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    
    data = JSON.parse(JSON.stringify(data))

    const result = data.map(item=>{
      const nested = item.donations.map(x=>{
        const u = x.usersDonate;
        delete x.usersDonate;
        return {
          ...u,
          ...x,
          proofAttachment: process.env.FILE_PATH + x.proofAttachment
        }
      })
      delete item.usersDonate;
      delete item.donations;
      return {
        ...item,
        thumbnail: process.env.FILE_PATH + item.thumbnail,
        usersDonate:nested
      };
    })
    res.send({
      status: "success...",
      data : {
        funds : result
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

exports.addFund = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    goal: Joi.number().integer().min(4).required(),
    description: Joi.string().min(6).required()
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

    const newData = await fund.create({
      ...dataBody,
      thumbnail: req.file.filename,
      idUser: req.user.id
    })

    let fundData = await fund.findOne({
      where: {
        id: newData.id
      },
      include: [
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
    });

    fundData = JSON.parse(JSON.stringify(fundData))

    res.send({
      status: "success",
      data: {
        fund: {
          ...fundData
        }
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
exports.getFund = async (req, res) => {
  try {
    const { id } = req.params;

    let fundData = await fund.findOne({
      where: {
        id
      },
      include: [
        {
          model: donation,
          as: "donations",
          attributes: {
            exclude: ["updatedAt", "idUser",  "idFund"],
          },
          include: [
            {
              model: user,
              as: "usersDonate",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            }
          ]
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    })
    
    fundData = JSON.parse(JSON.stringify(fundData))
    const result = fundData.donations.map( item => {
      const u = item.usersDonate;
        delete item.usersDonate;
        return {
          ...u,
          ...item,
          proofAttachment: process.env.FILE_PATH + item.proofAttachment
        }
    })
    delete fundData.donations;
    if(fundData == null){
      res.status(500).send({
        status: "failed",
        message: "No Data Found",
      });
    }
    
    res.send({
      status: "success",
      data: {
        fund: {
          ...fundData,
          thumbnail: process.env.FILE_PATH + fundData.thumbnail,
          usersDonate: result
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
}

exports.updateFund = async (req, res) => {
  try {
    const { id } = req.params;

    const dataBody = {
      ...req.body,
      thumbnail: req.file === undefined ? fundData.thumbnail : req.file.filename
    };

    await fund.update(dataBody, {
      where: {
        id,
      },
    });
    
    let fundData = await fund.findOne({
      where: {
        id
      },
      include: [
        {
          model: donation,
          as: "donations",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser",  "idFund"],
          },
          include: [
            {
              model: user,
              as: "usersDonate",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            }
          ]
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    })

    fundData = JSON.parse(JSON.stringify(fundData))
    const result = fundData.donations.map( item => {
      const u = item.usersDonate;
        delete item.usersDonate;
        return {
          ...u,
          ...item,
          proofAttachment: process.env.FILE_PATH + item.proofAttachment
        }
    })
    delete fundData.donations;

    res.send({
      status: "success",
      data: {
        fund: {
          ...fundData,
          thumbnail: process.env.FILE_PATH + fundData.thumbnail,
          usersDonate: result
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteFund = async (req, res) => {
  try {
    const { id } = req.params;

    await fund.destroy({
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

exports.updateFundByUserDonate = async (req, res) => {
  try {
    const { id, idUser } = req.params;

    let fundData = await fund.findOne({
      where: {
        id
      },
      include: [
        {
          model: donation,
          as: "donations",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser",  "idFund"],
          },
          include: [
            {
              model: user,
              as: "usersDonate",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            }
          ]
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    })

    fundData = JSON.parse(JSON.stringify(fundData))

    await donation.update(req.body, {
      where: {
        idFund: id,
        idUser : idUser,
      },
    });
    const result = fundData.donations.map( item => {
      const u = item.usersDonate;
        delete item.usersDonate;
        return {
          ...u,
          ...item,
          proofAttachment: process.env.FILE_PATH + item.proofAttachment
        }
    })
    delete fundData.donations;


    res.send({
      status: "success",
      data: {
        fund: {
          ...fundData,
          thumbnail: process.env.FILE_PATH + fundData.thumbnail,
          usersDonate: result
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
