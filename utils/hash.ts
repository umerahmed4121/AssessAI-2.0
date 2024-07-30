import bcrypt from 'bcrypt';

// Function to hash a password
const hash = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Function to verify a password
const verifyHash = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { hash, verifyHash };
