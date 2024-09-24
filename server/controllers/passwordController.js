const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail"); // We'll create this utility function
