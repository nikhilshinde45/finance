const Record = require('../models/record.model');
const ApiError = require('../utils/ApiError');

const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, note } = req.body;

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      note,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate, search } = req.query;

    const query = { isDeleted: false };

    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    if (type) query.type = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { category: { $regex: search, $options: 'i' } },
        { note: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Record.find(query)
        .sort({ date: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('createdBy', 'name email'),
      Record.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: false }).populate('createdBy', 'name email');

    if (!record) {
      throw new ApiError(404, 'Record not found');
    }

    if (req.user.role !== 'admin' && record.createdBy._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to view this record');
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: false });

    if (!record) {
      throw new ApiError(404, 'Record not found');
    }

    const { amount, type, category, date, note } = req.body;

    if (amount !== undefined) record.amount = amount;
    if (type !== undefined) record.type = type;
    if (category !== undefined) record.category = category;
    if (date !== undefined) record.date = date;
    if (note !== undefined) record.note = note;

    await record.save();

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: false });

    if (!record) {
      throw new ApiError(404, 'Record not found');
    }

    record.isDeleted = true;
    await record.save();

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
