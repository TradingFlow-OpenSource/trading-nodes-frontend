
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.marketplace': 'Marketplace',
      'nav.dashboard': 'Dashboard',
      'nav.add': 'Add Node',
      'nav.login': 'Login',
      'nav.logout': 'Logout',
      
      // Landing page
      'landing.slogan': 'One Brick, For All to Use',
      'landing.description': 'Open Protocol for Web3 Trading Workflows',
      'landing.subtitle': 'Build, Share, and Monetize Your Trading Logic',
      'landing.cta.explore': 'Explore Marketplace',
      'landing.cta.create': 'Create Your Node',
      'landing.features.title': 'Why TradingNodes?',
      'landing.features.open.title': 'Open Protocol',
      'landing.features.open.desc': 'Compatible with TradingFlow and any workflow builder',
      'landing.features.monetize.title': 'Monetize',
      'landing.features.monetize.desc': 'Turn your trading strategies into profitable nodes',
      'landing.features.community.title': 'Community',
      'landing.features.community.desc': 'Join thousands of traders sharing knowledge',
      
      // Marketplace
      'marketplace.title': 'Node Marketplace',
      'marketplace.search': 'Search nodes...',
      'marketplace.filter.all': 'All Categories',
      'marketplace.filter.input': 'Input',
      'marketplace.filter.compute': 'Compute',
      'marketplace.filter.trade': 'Trade',
      'marketplace.filter.output': 'Output',
      'marketplace.filter.creator': 'Filter by Creator',
      'marketplace.sort.latest': 'Latest',
      'marketplace.sort.popular': 'Most Popular',
      'marketplace.sort.rating': 'Highest Rated',
      'marketplace.empty': 'No nodes found',
      
      // Node details
      'node.version': 'Version',
      'node.author': 'Created by',
      'node.price.free': 'Free',
      'node.price.paid': '${price}',
      'node.rating': 'Rating',
      'node.reviews': 'reviews',
      'node.subscribers': 'subscribers',
      'node.use': 'Use in TradingFlow',
      'node.comments': 'Comments',
      'node.comment.add': 'Leave a comment',
      'node.comment.submit': 'Submit',
      'node.comment.reply': 'Reply',
      
      // Add/Edit node
      'add.title': 'Create New Node',
      'edit.title': 'Edit Node',
      'add.form.name': 'Node Name',
      'add.form.name.placeholder': 'Enter node name',
      'add.form.description': 'Description',
      'add.form.description.placeholder': 'Describe what your node does',
      'add.form.category': 'Category',
      'add.form.type': 'Node Type',
      'add.form.version': 'Version',
      'add.form.price': 'Price (0 for free)',
      'add.form.tags': 'Tags',
      'add.form.tags.placeholder': 'Enter tags separated by commas',
      'add.form.inputs': 'Inputs',
      'add.form.outputs': 'Outputs',
      'add.form.execution': 'Execution Method',
      'add.form.code': 'Code Snippet',
      'add.form.add.input': 'Add Input',
      'add.form.add.output': 'Add Output',
      'add.form.preview': 'Preview',
      'add.form.publish': 'Publish Node',
      'add.form.save.draft': 'Save as Draft',
      
      // Dashboard
      'dashboard.title': 'My Nodes',
      'dashboard.stats.total': 'Total Nodes',
      'dashboard.stats.published': 'Published',
      'dashboard.stats.revenue': 'Revenue',
      'dashboard.empty': 'You haven\'t created any nodes yet',
      'dashboard.create': 'Create Your First Node',
      
      // Auth
      'auth.login.title': 'Welcome Back',
      'auth.login.subtitle': 'Sign in to access your dashboard',
      'auth.redirect.message': 'Please log in to continue',
      'auth.redirect.countdown': 'Redirecting in {{seconds}} seconds',
      'auth.redirect.manual': 'Or click here to login now',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Something went wrong',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.preview': 'Preview',
      'common.publish': 'Publish',
      'common.unpublish': 'Unpublish'
    }
  },
  zh: {
    translation: {
      // Navigation
      'nav.home': '首页',
      'nav.marketplace': '节点市场',
      'nav.dashboard': '控制台',
      'nav.add': '创建节点',
      'nav.login': '登录',
      'nav.logout': '退出',
      
      // Landing page
      'landing.slogan': '一个积木，人人可用',
      'landing.description': 'Web3交易工作流开放协议',
      'landing.subtitle': '构建、分享并变现您的交易逻辑',
      'landing.cta.explore': '探索市场',
      'landing.cta.create': '创建节点',
      'landing.features.title': '为什么选择TradingNodes？',
      'landing.features.open.title': '开放协议',
      'landing.features.open.desc': '兼容TradingFlow和任何工作流构建器',
      'landing.features.monetize.title': '变现',
      'landing.features.monetize.desc': '将您的交易策略转化为盈利节点',
      'landing.features.community.title': '社区',
      'landing.features.community.desc': '加入数千名交易者分享知识的社区',
      
      // Marketplace
      'marketplace.title': '节点市场',
      'marketplace.search': '搜索节点...',
      'marketplace.filter.all': '所有分类',
      'marketplace.filter.input': '输入',
      'marketplace.filter.compute': '计算',
      'marketplace.filter.trade': '交易',
      'marketplace.filter.output': '输出',
      'marketplace.filter.creator': '按创作者筛选',
      'marketplace.sort.latest': '最新',
      'marketplace.sort.popular': '最受欢迎',
      'marketplace.sort.rating': '评分最高',
      'marketplace.empty': '未找到节点',
      
      // Node details
      'node.version': '版本',
      'node.author': '创建者',
      'node.price.free': '免费',
      'node.price.paid': '¥{price}',
      'node.rating': '评分',
      'node.reviews': '条评价',
      'node.subscribers': '订阅者',
      'node.use': '在TradingFlow中使用',
      'node.comments': '评论',
      'node.comment.add': '发表评论',
      'node.comment.submit': '提交',
      'node.comment.reply': '回复',
      
      // Add/Edit node
      'add.title': '创建新节点',
      'edit.title': '编辑节点',
      'add.form.name': '节点名称',
      'add.form.name.placeholder': '输入节点名称',
      'add.form.description': '描述',
      'add.form.description.placeholder': '描述您的节点功能',
      'add.form.category': '分类',
      'add.form.type': '节点类型',
      'add.form.version': '版本',
      'add.form.price': '价格（0表示免费）',
      'add.form.tags': '标签',
      'add.form.tags.placeholder': '用逗号分隔多个标签',
      'add.form.inputs': '输入',
      'add.form.outputs': '输出',
      'add.form.execution': '执行方法',
      'add.form.code': '代码片段',
      'add.form.add.input': '添加输入',
      'add.form.add.output': '添加输出',
      'add.form.preview': '预览',
      'add.form.publish': '发布节点',
      'add.form.save.draft': '保存草稿',
      
      // Dashboard
      'dashboard.title': '我的节点',
      'dashboard.stats.total': '总节点数',
      'dashboard.stats.published': '已发布',
      'dashboard.stats.revenue': '收入',
      'dashboard.empty': '您还没有创建任何节点',
      'dashboard.create': '创建您的第一个节点',
      
      // Auth
      'auth.login.title': '欢迎回来',
      'auth.login.subtitle': '登录以访问您的控制台',
      'auth.redirect.message': '请登录以继续',
      'auth.redirect.countdown': '{{seconds}}秒后自动跳转',
      'auth.redirect.manual': '或点击这里立即登录',
      
      // Common
      'common.loading': '加载中...',
      'common.error': '出现错误',
      'common.cancel': '取消',
      'common.save': '保存',
      'common.edit': '编辑',
      'common.delete': '删除',
      'common.preview': '预览',
      'common.publish': '发布',
      'common.unpublish': '取消发布'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
