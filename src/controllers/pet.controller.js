const Pet = require('../models/pet.model');
const response = require('../utils/response');

exports.getPets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [pets, total] = await Promise.all([
            Pet.find().skip(skip).limit(limit),
            Pet.countDocuments()
        ]);

        return response.paginated(
            res,
            pets,
            {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            "List pets"
        );
    } catch (err) {
        return response.error(res, err.message, 500);
    }
};
