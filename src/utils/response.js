exports.success = (res, data = null, message = "Success", code = 200) => {
    return res.status(code).json({
        success: true,
        message,
        data
    });
};

exports.error = (res, message = "Error", code = 400) => {
    return res.status(code).json({
        success: false,
        message
    });
};

exports.paginated = (
    res,
    data,
    pagination,
    message = "Success"
) => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination
    });
};
