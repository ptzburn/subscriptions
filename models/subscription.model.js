import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a subscription name'],
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    price: {
      type: Number,
      required: [true, 'Please enter a subscription price'],
      min: [0, 'Price must be greater than 0']
    },
    currency: {
      type: String,
      enum: ['EUR'],
      default: 'EUR'
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
      type: String,
      enum: [
        'sports',
        'news',
        'entertainment',
        'lifestyle',
        'technology',
        'finance',
        'politics',
        'other'
      ],
      required: [true, 'Please enter a subscription category']
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please enter a payment method'],
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      required: [true, 'Please enter a start date for the subscription'],
      validate: {
        validator: value => value <= new Date(),
        message: 'Start date must be in the past'
      }
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: value => value > this.startDate,
        message: 'Renewal date must be after the start date'
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please enter a user'],
      index: true
    }
  },
  { timestamps: true }
);

// Auto-calculate renewal date if missing.

subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

subscriptionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
