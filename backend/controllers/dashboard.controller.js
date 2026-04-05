const Record = require('../models/record.model');

const getDashboardSummary = async (req, res, next) => {
  try {
    const matchStage = { isDeleted: false };
    
    if (req.user.role !== 'admin') {
      matchStage.createdBy = req.user._id;
    }

    const totals = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
        },
      },
    ]);

    const summaryTotals = totals.length > 0 ? totals[0] : { totalIncome: 0, totalExpense: 0 };
    const netBalance = summaryTotals.totalIncome - summaryTotals.totalExpense;

    const categoryTotals = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id.type',
          category: '$_id.category',
          total: 1,
        },
      },
      { $sort: { total: -1 } }
    ]);

    const monthlySummaries = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          income: 1,
          expense: 1,
          net: { $subtract: ['$income', '$expense'] },
        },
      },
      { $sort: { year: -1, month: -1 } }
    ]);

    const recentTransactions = await Record.find(matchStage)
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .select('-__v');

    res.status(200).json({
      success: true,
      data: {
        totals: {
          income: summaryTotals.totalIncome,
          expense: summaryTotals.totalExpense,
          netBalance,
        },
        categoryTotals,
        monthlySummaries,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
