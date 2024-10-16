exports.getProfile = async (req, res) => {
    res.send({
        name: req.user.name,
        email: req.user.email
    });
};