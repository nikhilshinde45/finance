const express = require('express');
const { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } = require('../controllers/record.controller');
const validate = require('../middleware/validate.middleware');
const { createRecord: createRecordSchema, updateRecord: updateRecordSchema, getRecords: getRecordsSchema } = require('../validations/record.validation');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('admin'), validate(createRecordSchema), createRecord);

router.get('/', authorize('viewer', 'analyst', 'admin'), validate(getRecordsSchema), getRecords);
router.get('/:id', authorize('viewer', 'analyst', 'admin'), getRecordById);

router.put('/:id', authorize('admin'), validate(updateRecordSchema), updateRecord);
router.delete('/:id', authorize('admin'), deleteRecord);

module.exports = router;
