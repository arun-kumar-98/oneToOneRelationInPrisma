const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//insert one or many

const add = async (req, res) => {
  try {
    const userData = req.body;
    let resp = [];

    if (userData && Array.isArray(userData)) {
      for (let index = 0; index < userData.length; index++) {
        const element = userData[index];
        let result = await prisma.user.create({
          data: {
            first_name: element.first_name,
            last_name: element.last_name,
            email: element.email,
            profile: {
              create: {},
            },
          },
          include: {
            profile: true,
          },
        });
        console.log(result);
        resp.push(result);

        console.log("===resp if ==========", resp);
      }
    } else {
      const resp1 = await prisma.user.create({
        data: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          profile: {
            create: {},
          },
        },
        include: {
          profile: true,
        },
      });
      resp.push(resp1);
      console.log("-------resp- else----------->", resp1);
    }

    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

//find

const getOnrOrManyRecords = async (req, res) => {
  try {
    let resp;
    if (req.body.first_name) {
      resp = await prisma.user.findMany({
        where: { first_name: req.body.first_name },
        include: {
          profile: true,
        },
      });
      res.status(200).json({
        response: resp,
      });
    } else {
      resp = await prisma.user.findMany({
        skip: req.body.skip,
        take: req.body.take,
        where: {
          email: {
            contains: "@tectoro.com",
          },
        },
        orderBy: {
          id: "desc",
        },
        include: {
          profile: true,
        },
      });
      console.log("-----------filter ------------> ", resp);

      res.status(200).json({
        response: resp,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      response: null,
    });
  }
};

//update

const updateOneOrMoreRecords = async (req, res) => {
  try {
    let resp;
    if (req.body.id) {
      resp = await prisma.user.update({
        where: {
          id: req.body.id,
        },
        data: {
          last_name: req.body.last_name,
        },
      });
    } else {
      resp = await prisma.user.updateMany({
        where: {
          email: {
            contains: "@tectoro.com",
          },
        },
        data: {
          email: req.body.first_name + req.last_name + "U" + "@gmail.com",
        },
      });
    }
    res.status(200).json({
      response: resp,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      response: null,
    });
  }
};

const deleteOneOrMore = async (req, res) => {
  try {
    let resp;
    if (req.body.where) {
      resp = await prisma.profile.delete({
        where: {
          id: req.body.where.id,
        },
        include: { user: true },
      });
      await prisma.user.delete({
        where: { id: req.body.where.id },
      });
    } else {
      resp = await prisma.profile.deleteMany();
      await prisma.user.deleteMany();
    }

    res.status(200).json({
      response: resp,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({});
  }
};

module.exports = {
  add,
  getOnrOrManyRecords,
  updateOneOrMoreRecords,
  deleteOneOrMore,
};
