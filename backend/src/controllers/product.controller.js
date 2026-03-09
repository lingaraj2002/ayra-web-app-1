const Product = require("../models/product.model");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

//PUBLIC
exports.getProducts = async (req, res) => {
  try {
    const { category, isAvailable } = req.query;

    const query = {};

    // ----- CATEGORY FILTER -----
    if (category) {
      query.category = category;
    }

    // ----- AVAILABILITY FILTER -----
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === "true";
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: "ok",
      total: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundProduct = await Product.findOne({ productId: id });

    if (!foundProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "ok",
      data: foundProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

exports.getSearchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    const filter = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    const products = await Product.find(filter);

    const result = {
      data: products,
      status: "ok",
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADMIN
exports.createProduct = async (req, res) => {
  try {
    const { name, description, variants, category, isAvailable } = req.body;

    // Validate thumbnail
    if (!req.files?.thumbnail) {
      return res.status(400).json({
        status: "error",
        message: "Thumbnail image is required",
      });
    }

    const thumbnail = `/uploads/products/${req.files.thumbnail[0].filename}`;

    const images = req.files.images
      ? req.files.images.map((file) => `/uploads/products/${file.filename}`)
      : [];

    // Parse variants (coming as string from FormData)
    let parsedVariants = [];

    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);

        // Convert price fields to Number
        parsedVariants = parsedVariants.map((v) => ({
          price: Number(v.price),
          discountPrice: v.discountPrice ? Number(v.discountPrice) : undefined,
          netWeight: v.netWeight,
        }));
      } catch (err) {
        return res.status(400).json({
          status: "error",
          message: "Invalid variants format",
        });
      }
    }

    if (!parsedVariants.length) {
      return res.status(400).json({
        status: "error",
        message: "At least one variant is required",
      });
    }

    const product = await Product.create({
      name,
      description,
      variants: parsedVariants,
      category,
      thumbnail,
      images,
      isAvailable,
    });

    res.status(201).json({
      status: "ok",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create product",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle thumbnail upload
    if (req.file) {
      updateData.thumbnail = req.file.id.toString();
    }

    // Handle multiple images upload
    if (req.files && req.files.images) {
      updateData.images = req.files.images.map((file) => file.id.toString());
    }

    // If thumbnail is in fields
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      updateData.thumbnail = req.files.thumbnail[0].id.toString();
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id);
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from GridFS
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "images",
    });

    // Delete thumbnail
    if (foundProduct.thumbnail) {
      try {
        await bucket.delete(
          new mongoose.Types.ObjectId(foundProduct.thumbnail),
        );
      } catch (err) {
        console.error("Error deleting thumbnail:", err);
      }
    }

    // Delete all images
    if (foundProduct.images && foundProduct.images.length > 0) {
      for (const imageId of foundProduct.images) {
        try {
          await bucket.delete(new mongoose.Types.ObjectId(imageId));
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Serve images from GridFS
exports.getImage = async (req, res) => {
  try {
    const { id } = req.params;
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "images",
    });

    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(id),
    );

    downloadStream.on("file", (file) => {
      res.set("Content-Type", file.contentType);
      res.set("Content-Disposition", `inline; filename="${file.filename}"`);
    });

    downloadStream.on("error", (error) => {
      if (error.code === "ENOENT") {
        return res.status(404).json({ message: "Image not found" });
      }
      res.status(500).json({ message: error.message });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
