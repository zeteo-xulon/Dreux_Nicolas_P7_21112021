const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

// Schema for password validation
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', 'Password123456', 'Love123', 'noPassword']); // Blacklist password


module.exports = passwordSchema;