export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "An error occurred, please try again later." });
};
