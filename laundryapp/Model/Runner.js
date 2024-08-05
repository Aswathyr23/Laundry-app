const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const runnerSchema = new Schema({
    runner_mobile_no: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: Number
    },
    runner_email_id: {
        type: String
    },
   
});

const RunnerModel = mongoose.model('Runner', runnerSchema);
module.exports = RunnerModel;
