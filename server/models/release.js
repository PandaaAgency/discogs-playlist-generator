const mongoose = require('mongoose')

const ReleaseVideoSchema = new mongoose.Schema({
  title: String,
  url: String
})

/**
 * Define model format
 */
const ReleaseSchema = new mongoose.Schema({
  discogs_id: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  videos: [ReleaseVideoSchema]
})

/**
 * Add to mongoose
 * @type {Model}
 */
const Release = mongoose.model('Release', ReleaseSchema)

module.exports = Release
