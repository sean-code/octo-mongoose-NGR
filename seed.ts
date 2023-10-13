import mongoose from 'mongoose';
import User from './src/models/user';
import bcrypt from 'bcryptjs';

mongoose.connect('mongodb://localhost:27017/myapp', {
});

const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    { username: 'user1', password: hashedPassword },
    { username: 'user2', password: hashedPassword },
    { username: 'user3', password: hashedPassword },
    { username: 'user4', password: hashedPassword }
  ];

  await User.insertMany(users);
  console.log('Users seeded!');
};









import Article from './src/models/article';

const seedArticles = async () => {
  const users = await User.find();
  const articles = [];

  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    articles.push({
      title: `Article ${i + 1}`,
      content: `This is the content for Article ${i + 1}`,
      author: randomUser._id
    });
  }

  await Article.insertMany(articles);
  console.log('Articles seeded!');
};





const seedData = async () => {
  await seedUsers();
  await seedArticles();
};





seedData().then(() => {
  mongoose.connection.close();
  console.log('Database connection closed!');
});



