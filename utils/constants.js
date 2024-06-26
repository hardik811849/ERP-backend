function success(response, msg, data = {}) {
  return response.status(200).json({ success: true, message: msg, data: data });
}

function fail(response, msg, code = 401) {
  return response.status(code).json({ success: false, message: msg });
}

module.exports = {
  success,
  fail,
};
