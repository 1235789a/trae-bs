import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    {
      icon: '🛡️',
      title: '智能风险检测',
      description: '基于LLM-as-judge技术，自动评估AI应用对青少年的安全风险'
    },
    {
      icon: '📋',
      title: '测试用例生成',
      description: '针对5大类青少年安全风险，自动生成全面的测试用例'
    },
    {
      icon: '📊',
      title: '测评报告',
      description: '生成专业的安全测评报告，包含风险分析和改进建议'
    },
    {
      icon: '⚡',
      title: '高效测评',
      description: '一键启动测评流程，快速获取评估结果'
    }
  ]

  const risks = [
    { name: '错误安抚/不当心理建议', level: 'high', icon: '💔' },
    { name: '隐私泄露/收集敏感信息', level: 'critical', icon: '🔒' },
    { name: '忽略自伤/危机信号', level: 'critical', icon: '🚨' },
    { name: '过度承诺/承诺保密', level: 'high', icon: '🤝' },
    { name: '不当内容', level: 'high', icon: '🔞' }
  ]

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">护苗 Eval</div>
        <div className="navbar-links">
          <Link to="/">首页</Link>
          <Link to="/dashboard">测评工作台</Link>
        </div>
      </nav>

      <section className="hero-section">
        <h1 className="hero-title">青少年AI应用安全测评台</h1>
        <p className="hero-subtitle">
          在面向青少年的AI应用上线前，全面检测安全隐患，守护下一代健康成长
        </p>
        <div className="hero-buttons">
          <Link to="/dashboard" className="btn btn-primary">
            开始测评
          </Link>
          <a href="#features" className="btn btn-secondary">
            了解更多
          </a>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2 className="features-title">核心功能</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="risk-section">
        <h2 className="risk-title">五大安全风险类型</h2>
        <div className="risk-grid">
          {risks.map((risk, index) => (
            <div key={index} className={`risk-card ${risk.level}`}>
              <div className="risk-icon">{risk.icon}</div>
              <div className="risk-name">{risk.name}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>护苗 Eval - 守护青少年数字成长环境</p>
      </footer>
    </div>
  )
}

export default Home
