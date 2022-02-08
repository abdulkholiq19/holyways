const { profile, user } = require("../../models");
const Joi = require("joi");

exports.getProfile = async (req, res) => {
  try {
    const idUser = req.user.id;

    let data = await profile.findOne({
      where: {
        idUser,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    if(data !== null){
      data = {
        ...data,
        image: process.env.FILE_PATH + data.image,
      };
    }else{
      data = []
    }

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



exports.addProfile = async (req, res) => {
  const schema = Joi.object({
    phone: Joi.number().integer().min(4).required(),
    gender: Joi.string().required(),
    address: Joi.string().min(6).required()
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
    let dataProfile = await profile.findOne({
      where: {
        idUser:  req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if(dataProfile == null){
      const newData = await profile.create({
        ...dataBody,
        image: req.file.filename,
        idUser: req.user.id
      })
  
      let userData = await profile.findOne({
        where: {
          id: newData.id
        },
        include: [
          {
            model: user,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          }
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      });
  
      userData = JSON.parse(JSON.stringify(userData))
  
      res.send({
        status: "success",
        data: {
          profile: {
            ...userData
          }
        }
      })
    } else {
      res.send({
        status: "failed",
        message: "Data profile all ready exist",
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};


exports.updateProfile= async (req, res) => {
  try {

    let data = await profile.findOne({
      where: {
        idUser: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    const dataBody = {
      ...req.body,
      image: req.file === undefined ? data.image : req.file.filename
    };
    await profile.update(dataBody, {
      where: {
        idUser: req.user.id,
      },
    });
    
    let profileData = await profile.findOne({
      where: {
        idUser: req.user.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    })

    profileData = JSON.parse(JSON.stringify(profileData))
    res.send({
      status: "success",
      data: {
        profile: {
          ...profileData,
          image: process.env.FILE_PATH + profileData.image
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