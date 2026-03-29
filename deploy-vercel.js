/**
 * Vercel 部署辅助脚本
 *
 * 使用方法：
 * 1. 确保 .env 文件已配置
 * 2. 运行：node deploy-vercel.js
 * 3. 按照提示完成部署
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname;

console.log('🚀 AI 旅行助手 - Vercel 部署助手\n');

// 检查必要文件
const requiredFiles = [
  'package.json',
  'server/package.json',
  'api/index.ts',
  '.env'
];

console.log('📋 检查项目文件...');
const missingFiles = requiredFiles.filter(file => !existsSync(join(projectRoot, file)));

if (missingFiles.length > 0) {
  console.error('❌ 缺少必要文件：');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  console.error('\n请确保项目完整后再继续。');
  process.exit(1);
}

console.log('✅ 所有必要文件存在\n');

// 检查 .env 文件
console.log('📋 检查环境变量配置...');
const envPath = join(projectRoot, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_API_BASE_URL'];
  const missingVars = requiredVars.filter(varName => !envContent.includes(varName));

  if (missingVars.length > 0) {
    console.warn('⚠️  .env 文件中缺少以下环境变量：');
    missingVars.forEach(varName => console.warn(`   - ${varName}`));
    console.warn('\n请手动配置这些变量。\n');
  } else {
    console.log('✅ 环境变量配置完整\n');
  }
} else {
  console.warn('⚠️  未找到 .env 文件，请手动配置。\n');
}

// 检查 Vercel CLI
console.log('📋 检查 Vercel CLI...');
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI 已安装\n');
} catch {
  console.log('📦 正在安装 Vercel CLI...\n');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI 安装成功\n');
  } catch (error) {
    console.error('❌ Vercel CLI 安装失败：', error.message);
    console.error('请手动安装：npm install -g vercel');
    process.exit(1);
  }
}

console.log('🎯 准备部署到 Vercel...\n');
console.log('请确保：');
console.log('1. ✅ Supabase 数据库已配置（运行 SQL 脚本）');
console.log('2. ✅ .env 文件已配置');
console.log('3. ✅ 已登录 Vercel CLI（运行 vercel login）');
console.log('\n按 Enter 继续，或按 Ctrl+C 取消...\n');

import * as readline from 'readline';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', () => {
  rl.close();

  try {
    console.log('🚀 开始部署到 Vercel...\n');

    // 部署到 Vercel
    execSync('vercel --prod', {
      cwd: projectRoot,
      stdio: 'inherit'
    });

    console.log('\n✅ 部署成功！\n');
    console.log('📌 下一步：');
    console.log('1. 访问 Vercel Dashboard 配置后端环境变量：');
    console.log('   - DEEPSEEK_API_KEY');
    console.log('   - DEEPSEEK_BASE_URL');
    console.log('   - DEEPSEEK_MODEL');
    console.log('\n2. 配置后重新部署：');
    console.log('   vercel --prod');
    console.log('\n3. 验证部署：');
    console.log('   访问 https://你的项目名.vercel.app/api/health/healthz');

  } catch (error) {
    console.error('\n❌ 部署失败：', error.message);
    console.error('请检查错误信息并重试。');
    process.exit(1);
  }
});
