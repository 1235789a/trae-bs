import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ProjectDetail = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [testCases, setTestCases] = useState([])
  const [evaluationResults, setEvaluationResults] = useState([])
  const [report, setReport] = useState(null)
  const [activeTab, setActiveTab] = useState('testcases')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProject()
    fetchTestCases()
    fetchEvaluationResults()
    fetchReport()
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`)
      setProject(response.data)
    } catch (error) {
      console.error('获取项目详情失败:', error)
    }
  }

  const fetchTestCases = async () => {
    try {
      const response = await axios.get(`/api/test-cases?project_id=${id}`)
      setTestCases(response.data)
    } catch (error) {
      console.error('获取测试用例失败:', error)
    }
  }

  const fetchEvaluationResults = async () => {
    try {
      const response = await axios.get(`/api/evaluations?project_id=${id}`)
      setEvaluationResults(response.data)
    } catch (error) {
      console.error('获取测评结果失败:', error)
    }
  }

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/reports?project_id=${id}`)
      if (response.data.length > 0) {
        setReport(response.data[0])
      }
    } catch (error) {
      console.error('获取报告失败:', error)
    }
  }

  const handleGenerateTestCases = async () => {
    setLoading(true)
    try {
      await axios.post(`/api/test-cases/generate/${id}`)
      fetchTestCases()
    } catch (error) {
      console.error('生成测试用例失败:', error)
    }
    setLoading(false)
  }

  const handleRunEvaluation = async () => {
    setLoading(true)
    try {
      await axios.post('/api/evaluations/run', { project_id: parseInt(id) })
      fetchEvaluationResults()
      fetchProject()
    } catch (error) {
      console.error('运行测评失败:', error)
    }
    setLoading(false)
  }

  const handleGenerateReport = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`/api/reports/generate/${id}`)
      setReport(response.data)
    } catch (error) {
      console.error('生成报告失败:', error)
    }
    setLoading(false)
  }

  const handleExportReport = async () => {
    try {
      const response = await axios.get(`/api/reports/export/${id}`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('导出报告失败:', error)
    }
  }

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case '低风险': return 'risk-badge low'
      case '中风险': return 'risk-badge medium'
      case '高风险': return 'risk-badge high'
      case '严重风险': return 'risk-badge critical'
      default: return 'risk-badge medium'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#48BB78'
    if (score >= 60) return '#ECC94B'
    if (score >= 40) return '#F6AD55'
    return '#FC8181'
  }

  if (!project) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-layout">
          <aside className="sidebar">
            <div className="sidebar-brand">护苗 Eval</div>
            <div className="sidebar-links">
              <Link to="/dashboard">测评工作台</Link>
              <Link to="/">返回首页</Link>
            </div>
          </aside>
          <main className="main-content">
            <p>加载中...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-brand">护苗 Eval</div>
          <div className="sidebar-links">
            <Link to="/dashboard">测评工作台</Link>
            <Link to="/">返回首页</Link>
          </div>
        </aside>

        <main className="main-content">
          <div className="section-header">
            <div>
              <h1 className="page-title">{project.name}</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {project.description || '暂无描述'}
              </p>
            </div>
            <div className="project-actions">
              <button 
                className="action-btn action-btn-primary" 
                onClick={handleGenerateTestCases}
                disabled={loading}
              >
                {loading ? '生成中...' : '生成测试用例'}
              </button>
              <button 
                className="action-btn action-btn-primary" 
                onClick={handleRunEvaluation}
                disabled={loading}
              >
                {loading ? '测评中...' : '运行测评'}
              </button>
            </div>
          </div>

          <div className="stats-grid" style={{ marginBottom: '1rem' }}>
            <div className="stat-card">
              <div className="stat-value">{testCases.length}</div>
              <div className="stat-label">测试用例数</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{evaluationResults.length}</div>
              <div className="stat-label">测评结果数</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{project.ai_app_type || '-'}</div>
              <div className="stat-label">应用类型</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{project.target_age_group || '-'}</div>
              <div className="stat-label">目标年龄</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              className={`btn ${activeTab === 'testcases' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('testcases')}
            >
              测试用例
            </button>
            <button 
              className={`btn ${activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('results')}
            >
              测评结果
            </button>
            <button 
              className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('report')}
            >
              测评报告
            </button>
          </div>

          {activeTab === 'testcases' && (
            <section className="projects-section">
              <h2 className="section-title">测试用例列表</h2>
              {testCases.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  暂无测试用例，点击上方"生成测试用例"按钮生成
                </p>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {testCases.map((tc) => (
                    <div key={tc.id} className="test-case-item">
                      <div className="test-case-header">
                        <span className={`status-badge ${tc.severity === 'critical' ? 'status-testing' : tc.severity === 'high' ? 'status-testing' : 'status-draft'}`}>
                          {tc.risk_category}
                        </span>
                        <span className="risk-badge medium">{tc.severity}</span>
                      </div>
                      <div className="test-case-question"><strong>测试问题：</strong>{tc.question}</div>
                      {tc.expected_response && (
                        <div className="test-case-response"><strong>期望回应：</strong>{tc.expected_response}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'results' && (
            <section className="projects-section">
              <h2 className="section-title">测评结果</h2>
              {evaluationResults.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  暂无测评结果，点击上方"运行测评"按钮开始测评
                </p>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {evaluationResults.map((result) => {
                    const tc = testCases.find(t => t.id === result.test_case_id)
                    return (
                      <div key={result.id} className="test-case-item">
                        <div className="test-case-header">
                          <span className={`status-badge ${tc?.severity === 'critical' ? 'status-testing' : 'status-draft'}`}>
                            {tc?.risk_category || '未知'}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="score-display" style={{ color: getScoreColor(result.score) }}>
                              {result.score.toFixed(1)}
                            </span>
                            <span className={getRiskBadgeClass(result.risk_level)}>
                              {result.risk_level}
                            </span>
                          </div>
                        </div>
                        <div className="test-case-question"><strong>测试问题：</strong>{tc?.question || '未知'}</div>
                        <div className="test-case-response"><strong>AI回应：</strong>{result.ai_response}</div>
                        <div className="evaluation-result">
                          <strong>评估理由：</strong>{result.judge_reasoning}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {activeTab === 'report' && (
            <section className="projects-section">
              <div className="section-header">
                <h2 className="section-title">测评报告</h2>
                {!report ? (
                  <button 
                    className="btn btn-primary" 
                    onClick={handleGenerateReport}
                    disabled={evaluationResults.length === 0}
                  >
                    {evaluationResults.length === 0 ? '请先运行测评' : '生成报告'}
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    onClick={handleExportReport}
                  >
                    导出PDF
                  </button>
                )}
              </div>
              
              {!report ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  暂无测评报告
                  {evaluationResults.length > 0 ? '，点击上方按钮生成报告' : '，请先运行测评'}
                </p>
              ) : (
                <div className="report-content">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{report.title}</h3>
                  
                  <div className="report-summary">
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>综合评分</h4>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: getScoreColor(report.overall_score), marginBottom: '1rem' }}>
                      {report.overall_score} / 100
                    </div>
                    <p style={{ lineHeight: '1.6' }}>{report.summary}</p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>风险类别分析</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {Object.entries(report.risk_summary).map(([category, data]) => (
                        <div key={category} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{category}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            测试数: {data.count} | 平均分: {data.average_score}
                          </div>
                          <span className={getRiskBadgeClass(data.risk_level)} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                            {data.risk_level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="report-recommendations">
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>改进建议</h4>
                    <pre style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>{report.recommendations}</pre>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default ProjectDetail
