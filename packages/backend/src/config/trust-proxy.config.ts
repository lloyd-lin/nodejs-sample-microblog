import { ConfigService } from '@nestjs/config';

export function getTrustProxyConfig(configService: ConfigService) {
  // 优先使用环境变量配置
  const trustProxyEnv = configService.get('TRUST_PROXY');
  if (trustProxyEnv !== undefined) {
    if (trustProxyEnv === 'true') return true;
    if (trustProxyEnv === 'false') return false;
    if (trustProxyEnv === 'loopback') return 'loopback';
    if (trustProxyEnv === '1') return 1;
    
    // 如果是IP列表，解析为数组
    const trustProxyIps = configService.get('TRUST_PROXY_IPS');
    if (trustProxyIps) {
      return trustProxyIps.split(',').map(ip => ip.trim());
    }
  }
  
  // 根据环境自动配置
  const nodeEnv = configService.get('NODE_ENV') || 'development';
  
  switch (nodeEnv) {
    case 'production':
      // 生产环境：信任所有代理（通常部署在负载均衡器后面）
      return true;
    
    case 'staging':
      // 预发布环境：信任第一层代理
      return 1;
    
    case 'development':
    default:
      // 开发环境：信任本地回环地址
      return 'loopback';
  }
}

// 更精细的配置选项
export const TRUST_PROXY_OPTIONS = {
  // 开发环境：只信任本地代理
  development: 'loopback',
  
  // 测试环境：信任特定IP范围
  test: ['127.0.0.1', '::1', '10.0.0.0/8'],
  
  // 预发布环境：信任第一层代理
  staging: 1,
  
  // 生产环境：信任所有代理
  production: true,
  
  // 自定义配置：信任特定代理
  custom: (ips: string[]) => ips,
}; 