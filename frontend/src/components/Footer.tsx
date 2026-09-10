'use client';

import Link from 'next/link';
import { Github, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & 简介 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-minecraft-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">MC</span>
              </div>
              <span className="text-white font-bold text-xl">Minecraft Server</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              欢迎来到我们的Minecraft服务器！这里有丰富的游戏玩法、
              友好的玩家社区和稳定的服务器环境，快来加入我们的冒险吧！
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-minecraft-green transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-minecraft-green transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-minecraft-green transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-minecraft-green transition-colors text-sm">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/server-info" className="text-gray-400 hover:text-minecraft-green transition-colors text-sm">
                  服务器介绍
                </Link>
              </li>
              <li>
                <Link href="/gameplay" className="text-gray-400 hover:text-minecraft-green transition-colors text-sm">
                  玩法内容
                </Link>
              </li>
              <li>
                <Link href="/qa" className="text-gray-400 hover:text-minecraft-green transition-colors text-sm">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系我们 */}
          <div>
            <h4 className="text-white font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>服务器IP: mc.example.com</li>
              <li>邮箱: support@minecraft.com</li>
              <li>QQ群: 123456789</li>
              <li>Discord: minecraft-server</li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Minecraft Server. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Minecraft is a trademark of Mojang AB. This site is not affiliated with Mojang AB.
          </p>
        </div>
      </div>
    </footer>
  );
}
