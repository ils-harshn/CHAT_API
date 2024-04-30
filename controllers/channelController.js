exports.create = async (req, res, next) => {
  try {
    res.json({
      status: "CREATED",
    });
  } catch (err) {
    next(err);
  }
};
