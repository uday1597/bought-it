import bcrypt from 'bcryptjs';

const hash = bcrypt.hashSync('qwertyuiop', 10);
console.log(hash);
