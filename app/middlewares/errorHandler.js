const errorHandler = (err, req, res, next) => {
  console.error("ERROR OCCURRED :", err); 

  res.status(err.statusCode || 500).json({
    status: 0,
    message: err.message || "Something went wrong",
    data: null,
  });
};

module.exports = { errorHandler };
