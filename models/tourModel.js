const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Đây là trường name dữ liệu bạn cần nhập'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Đây là trường durations dữ liệu bắt buộc'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Đây là trường maxGroupSize dữ liệu bắt buộc'],
    },
    difficulty: {
      type: String,
      required: [true, 'Đây là trường difficulty dữ liệu bắt buộc'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Đây là trường price dữ liệu bạn cần nhập'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Đây là trường summary dữ liệu bạn cần nhập'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Đây là trường imageCover dữ liệu bạn cần nhập'],
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      description: String,
      address: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        day: Number,
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    seceretTour: Boolean,
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});


tourSchema.index({price:1});
tourSchema.index({price:1, ratingsAverage:-1});
tourSchema.index({ slug: 1 });

// middlewares query
// tourSchema.pre('save', async function (next) {
//   const guidesPromis = this.guides.map(async (id) => {
//     return await User.findById(id);
//   });
//   this.guides= await Promise.all(guidesPromis);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v',
  });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ seceretTour: { $ne: true } });
  next();
});

// middlewares aggreation
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { seceretTour: { $ne: true } } });
  next();
});


tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Tour', tourSchema);
