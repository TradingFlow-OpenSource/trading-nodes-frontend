# CORS和环境配置说明

## 环境变量设置

请在项目根目录创建以下环境变量文件：

### .env.development
```env
# TradingFlow API配置
VITE_TRADINGFLOW_API_URL=http://localhost:8000/api/v1

# 环境配置
VITE_NODE_ENV=development
```

### .env.production
```env
# TradingFlow API配置
VITE_TRADINGFLOW_API_URL=https://stg.tradingflow.pro/api/v1

# 环境配置
VITE_NODE_ENV=production
```

## 开发服务器端口

确保开发服务器运行在以下端口之一（已在TradingFlow后端CORS中配置）：
- http://localhost:3000
- http://localhost:5173
- http://localhost:5174
- http://localhost:5175
- http://localhost:8080
- http://localhost:8081
- http://localhost:3001
- http://localhost:4173
- http://localhost:4174

## 启动说明

1. 创建上述环境变量文件
2. 启动TradingFlow后端服务（端口8000）
3. 启动前端开发服务器
4. 现在应该可以正常进行跨域请求了 