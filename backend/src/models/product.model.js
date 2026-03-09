const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    variants: [
      {
        price: {
          type: Number,
          required: true,
          min: 0,
        },

        discountPrice: {
          type: Number,
          validate: {
            validator: function (value) {
              return value < this.price;
            },
            message: "Discount price must be less than price",
          },
        },

        netWeight: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

productSchema.pre("save", async function () {
  if (!this.isNew) return;

  const lastProduct = await this.constructor.findOne().sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastProduct?.productId) {
    nextNumber = Number(lastProduct.productId) + 1;
  }

  this.productId = String(nextNumber);
});

module.exports = mongoose.model("Product", productSchema);
