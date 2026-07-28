const Client = require("../models/Client");

const createClient = async (req, res, next) => {
  try {
    const { companyName, order, isActive } = req.body;

    if (!req.file?.path || !req.file?.filename) {
      return res.status(400).json({ success: false, message: "Logo image is required" });
    }

    const client = await Client.create({
      companyName,
      logo: {
        url: req.file.path,
        public_id: req.file.filename,
      },
      order: Number(order) || 0,
      isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({}).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, clients });
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const { companyName, order, isActive } = req.body;

    if (companyName !== undefined) client.companyName = companyName;
    if (order !== undefined) client.order = Number(order) || 0;
    if (isActive !== undefined) client.isActive = isActive === "true" || isActive === true;

    if (req.file?.path && req.file?.filename) {
      client.logo = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await client.save();

    res.status(200).json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    await Client.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};
