import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    username: process.env.DATABASE_USER || 'minecraft',
    password: process.env.DATABASE_PASSWORD || 'minecraft123456',
    database: process.env.DATABASE_NAME || 'minecraft_server',
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Database connected for seeding');

  // 检查是否已有管理员用户
  const [existingAdmin] = await dataSource.query(
    "SELECT * FROM users WHERE email = 'admin@minecraft.com'"
  );

  if (!existingAdmin) {
    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('123456', 10);
    await dataSource.query(
      `INSERT INTO users (username, email, password, role, emailVerified, minecraftUsername, playTime, achievements) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['admin', 'admin@minecraft.com', hashedPassword, 'admin', true, 'AdminSteve', 10000, 50]
    );
    console.log('Admin user created');
  } else {
    // 更新管理员密码
    const hashedPassword = await bcrypt.hash('123456', 10);
    await dataSource.query(
      "UPDATE users SET password = ? WHERE email = 'admin@minecraft.com'",
      [hashedPassword]
    );
    console.log('Admin password updated');
  }

  // 检查并创建测试用户
  const testUsers = [
    { username: 'player1', email: 'player1@example.com', mcName: 'DiamondMiner', playTime: 5000, achievements: 30 },
    { username: 'player2', email: 'player2@example.com', mcName: 'CreeperHunter', playTime: 3500, achievements: 25 },
    { username: 'player3', email: 'player3@example.com', mcName: 'RedstoneWizard', playTime: 8000, achievements: 45 },
    { username: 'player4', email: 'player4@example.com', mcName: 'BuildMaster', playTime: 6000, achievements: 35 },
  ];

  const hashedPassword = await bcrypt.hash('123456', 10);

  for (const user of testUsers) {
    const [existing] = await dataSource.query(
      'SELECT * FROM users WHERE email = ?',
      [user.email]
    );

    if (!existing) {
      await dataSource.query(
        `INSERT INTO users (username, email, password, role, emailVerified, minecraftUsername, playTime, achievements) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user.username, user.email, hashedPassword, 'user', true, user.mcName, user.playTime, user.achievements]
      );
      console.log(`User ${user.username} created`);
    }
  }

  await dataSource.destroy();
  console.log('Seeding completed');
}

seed().catch(console.error);
