const mongoose = require('mongoose');

// appel du plugin pour valider les emails et s'assurer qu'il n'y a pas deux emails identiques
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);