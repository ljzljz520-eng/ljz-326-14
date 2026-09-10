-- Minecraft服务器官方网站数据库初始化脚本
-- 设置字符编码
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS minecraft_server 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE minecraft_server;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  minecraftUsername VARCHAR(50),
  role ENUM('user', 'admin') DEFAULT 'user',
  emailVerified BOOLEAN DEFAULT FALSE,
  verificationToken VARCHAR(100),
  resetPasswordToken VARCHAR(100),
  resetPasswordExpires DATETIME,
  avatar TEXT,
  playTime INT DEFAULT 0,
  achievements INT DEFAULT 0,
  lastLoginAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 新闻表
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  coverImage TEXT,
  isPublished BOOLEAN DEFAULT FALSE,
  isPinned BOOLEAN DEFAULT FALSE,
  viewCount INT DEFAULT 0,
  authorId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_published (isPublished),
  INDEX idx_pinned (isPinned)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Q&A表
CREATE TABLE IF NOT EXISTS qa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(200) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  sortOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  viewCount INT DEFAULT 0,
  keywords TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 服务器状态表
CREATE TABLE IF NOT EXISTS server_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isOnline BOOLEAN DEFAULT TRUE,
  onlinePlayers INT DEFAULT 0,
  maxPlayers INT DEFAULT 100,
  serverIp VARCHAR(100),
  serverPort INT DEFAULT 25565,
  version VARCHAR(50),
  motd VARCHAR(200),
  tps FLOAT,
  uptime BIGINT,
  recordedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recorded (recordedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 公告表
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
  isActive BOOLEAN DEFAULT TRUE,
  isPinned BOOLEAN DEFAULT FALSE,
  startAt DATETIME,
  endAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (isActive),
  INDEX idx_pinned (isPinned)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 玩法表
CREATE TABLE IF NOT EXISTS gameplay (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  detailedContent TEXT,
  gameMode ENUM('survival', 'creative', 'adventure', 'spectator'),
  icon TEXT,
  coverImage TEXT,
  sortOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  isFeatured BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mode (gameMode),
  INDEX idx_featured (isFeatured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== 初始化数据 ==========

-- 插入管理员用户（密码: 123456）
-- bcrypt hash for "123456" with 10 rounds
INSERT INTO users (username, email, password, role, emailVerified, minecraftUsername, playTime, achievements) VALUES
('admin', 'admin@minecraft.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'admin', TRUE, 'AdminSteve', 10000, 50),
('player1', 'player1@example.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'user', TRUE, 'DiamondMiner', 5000, 30),
('player2', 'player2@example.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'user', TRUE, 'CreeperHunter', 3500, 25),
('player3', 'player3@example.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'user', TRUE, 'RedstoneWizard', 8000, 45),
('player4', 'player4@example.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'user', TRUE, 'BuildMaster', 6000, 35);

-- 插入新闻
INSERT INTO news (title, content, summary, isPublished, isPinned, authorId, viewCount) VALUES
('服务器1.20.4版本更新公告', '亲爱的玩家们，我们很高兴地宣布服务器已经升级到Minecraft 1.20.4版本！新版本带来了许多令人兴奋的特性和优化。\n\n## 主要更新内容\n\n1. **新方块和物品**: 添加了新的装饰方块和工具\n2. **性能优化**: 服务器性能提升30%\n3. **Bug修复**: 修复了多个已知问题\n\n请各位玩家更新客户端后登录体验！', '服务器已升级到1.20.4版本，带来全新特性和性能优化', TRUE, TRUE, 1, 156),
('春节特别活动开启', '为庆祝新春佳节，我们准备了丰富的游戏活动！\n\n## 活动时间\n2024年2月1日 - 2024年2月15日\n\n## 活动内容\n- 登录送好礼\n- 限时副本挑战\n- 红包雨活动\n\n快来参与吧！', '春节特别活动正式开启，丰富奖励等你来拿', TRUE, FALSE, 1, 89),
('新玩法"末地探险"上线', '全新的末地探险玩法正式上线！勇敢的冒险者们，准备好挑战末影龙了吗？\n\n## 玩法简介\n组队进入末地，击败末影龙获取稀有奖励。\n\n## 参与方式\n在主城末地传送门处与NPC对话即可开始冒险。', '末地探险玩法上线，挑战末影龙获取稀有奖励', TRUE, FALSE, 1, 234),
('服务器维护通知', '为了提供更好的游戏体验，服务器将于本周六凌晨2:00-6:00进行例行维护。\n\n维护期间服务器将暂时关闭，请各位玩家提前做好准备。\n\n感谢您的理解与支持！', '本周六凌晨2:00-6:00服务器维护', TRUE, FALSE, 1, 67);

-- 插入Q&A
INSERT INTO qa (question, answer, category, sortOrder, keywords) VALUES
('如何加入服务器？', '1. 确保你的Minecraft版本为1.20.4\n2. 打开多人游戏\n3. 添加服务器，输入IP: mc.example.com\n4. 点击加入即可开始游戏', '入门指南', 1, '加入,连接,IP,地址'),
('服务器的游戏规则是什么？', '我们的服务器规则如下：\n\n1. 禁止使用外挂和作弊软件\n2. 禁止恶意破坏他人建筑\n3. 禁止辱骂和人身攻击\n4. 禁止刷屏和发送广告\n5. 尊重所有玩家\n\n违反规则将被警告或封禁。', '规则', 2, '规则,禁止,封禁'),
('如何获得VIP会员？', '获得VIP会员的方式：\n\n1. 官网购买：访问我们的官网商城\n2. 活动获取：参与特定活动可获得VIP体验\n\nVIP会员享有以下特权：\n- 专属称号\n- 额外存储空间\n- 优先进入服务器\n- 更多皮肤选择', '会员', 3, 'VIP,会员,购买,特权'),
('遇到Bug怎么办？', '如果你在游戏中遇到Bug，请按以下步骤反馈：\n\n1. 详细记录Bug发生的情况\n2. 如果可以，截图或录屏\n3. 在官网Q&A页面或Discord频道提交反馈\n4. 等待管理员处理\n\n感谢你帮助我们改进游戏体验！', '技术支持', 4, 'Bug,问题,反馈,修复'),
('如何绑定Minecraft账号？', '绑定Minecraft账号步骤：\n\n1. 登录官网账号\n2. 进入个人中心\n3. 点击"绑定MC账号"\n4. 输入你的Minecraft用户名\n5. 在游戏内完成验证\n\n绑定后可享受数据同步服务。', '账号', 5, '绑定,账号,同步'),
('服务器支持哪些Minecraft版本？', '目前服务器支持以下版本：\n\n- **推荐版本**: 1.20.4\n- **兼容版本**: 1.19.x - 1.20.x\n\n建议使用推荐版本以获得最佳游戏体验。', '入门指南', 6, '版本,支持,兼容'),
('如何传送到其他玩家位置？', '传送方式：\n\n1. **命令传送**: /tpa <玩家名> 发送传送请求\n2. **接受传送**: /tpaccept 接受传送请求\n3. **拒绝传送**: /tpdeny 拒绝传送请求\n4. **传送到主城**: /spawn\n\n注意：传送需要消耗一定的游戏币。', '游戏玩法', 7, '传送,命令,tpa'),
('服务器有哪些特色玩法？', '我们的服务器特色玩法包括：\n\n1. **生存世界**: 原版生存体验\n2. **创造空间**: 自由创作你的建筑\n3. **空岛挑战**: 从一个小岛开始你的冒险\n4. **末地探险**: 组队挑战末影龙\n5. **红石竞技**: 展示你的红石技术\n\n更多玩法持续开发中！', '游戏玩法', 8, '玩法,特色,模式');

-- 插入服务器状态
INSERT INTO server_status (isOnline, onlinePlayers, maxPlayers, serverIp, serverPort, version, motd, tps, uptime) VALUES
(TRUE, 42, 100, 'mc.example.com', 25565, '1.20.4', '欢迎来到Minecraft梦想世界！', 19.8, 864000);

-- 插入公告
INSERT INTO announcements (title, content, type, isActive, isPinned) VALUES
('欢迎来到Minecraft服务器', '欢迎各位玩家加入我们的服务器！在这里你可以体验原版生存、创造建筑、参与活动等丰富内容。祝你游戏愉快！', 'success', TRUE, TRUE),
('服务器规则提醒', '请所有玩家遵守服务器规则，文明游戏。发现违规行为请向管理员举报。', 'warning', TRUE, FALSE),
('周末双倍经验活动', '本周末全服双倍经验！活动时间：周六00:00 - 周日23:59。快来升级你的技能吧！', 'info', TRUE, FALSE);

-- 插入玩法
INSERT INTO gameplay (title, description, detailedContent, gameMode, sortOrder, isActive, isFeatured) VALUES
('原版生存', '体验最纯粹的Minecraft生存玩法，从零开始建造你的帝国。', '在原版生存模式中，你需要：\n\n1. **收集资源**: 砍伐树木、挖掘矿石\n2. **建造庇护所**: 保护自己免受怪物侵袭\n3. **农业生产**: 种植作物、饲养动物\n4. **探索世界**: 发现地牢、要塞等神秘地点\n5. **挑战Boss**: 击败末影龙和凋灵\n\n这里有广袤的世界等你探索！', 'survival', 1, TRUE, TRUE),
('创造空间', '释放你的创造力，在无限资源中建造梦想中的建筑。', '创造模式特点：\n\n1. **无限资源**: 所有方块随意使用\n2. **飞行能力**: 自由在空中移动\n3. **无敌模式**: 不会受到任何伤害\n4. **大型建筑**: 完成史诗级别的建筑项目\n\n适合喜欢建筑和设计的玩家。', 'creative', 2, TRUE, TRUE),
('空岛挑战', '从一个小岛开始，利用有限资源发展壮大。', '空岛挑战规则：\n\n1. 你将出生在一个漂浮的小岛上\n2. 岛上只有一棵树和一个箱子\n3. 利用有限资源生存和扩展\n4. 完成挑战任务获得奖励\n5. 与其他玩家竞争排行榜\n\n挑战你的生存极限！', 'survival', 3, TRUE, TRUE),
('末地探险', '组队挑战末影龙，获取稀有奖励和荣誉。', '末地探险玩法：\n\n1. **组队系统**: 2-4人组队挑战\n2. **Boss战斗**: 与末影龙进行史诗对决\n3. **稀有掉落**: 获取龙蛋和特殊装备\n4. **排行榜**: 记录最快击杀时间\n\n准备好迎接终极挑战了吗？', 'adventure', 4, TRUE, FALSE),
('红石竞技', '展示你的红石机械天赋，参与各种红石挑战。', '红石竞技内容：\n\n1. **红石教程**: 学习红石基础知识\n2. **建造挑战**: 完成指定的红石装置\n3. **竞速比赛**: 比拼谁的机器更高效\n4. **创意展示**: 分享你的红石发明\n\n成为红石大师！', 'creative', 5, TRUE, FALSE);

-- 完成初始化
SELECT '数据库初始化完成！' AS message;
