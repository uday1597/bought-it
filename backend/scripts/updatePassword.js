import bcrypt from 'bcryptjs';

const hash = bcrypt.hashSync('qwertyuiop', 10);
