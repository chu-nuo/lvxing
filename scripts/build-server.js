/**
 * 后端构建脚本
 * 在部署前构建后端代码
 */

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);
const serverDir = join(projectRoot, 'server');

console.log('🔧 构建后端代码...\n');

try {
  // 进入后端目录
  process.chdir(serverDir);

  // 安装后端依赖
  console.log('📦 安装后端依赖...');
  execSync('npm install', { stdio: 'inherit' });

  // 构建后端
  console.log('🏗️  构建后端 TypeScript...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ 后端构建成功！');

} catch (error) {
  console.error('\n❌ 后端构建失败：', error.message);
  process.exit(1);
}
