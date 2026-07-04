import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    ai_app_url: '',
    ai_app_type: '',
    target_age_group: ''
  })
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    testingProjects: 0,
    avgScore: 0
  })
  const [riskData, setRiskData] = useState({})

  useEffect(() => {
    fetchProjects()
    fetchStats()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects')
      setProjects(response.data)
    } catch (error) {
      console.error('获取项目失败:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const projectsRes = await axios.get('/api/projects')
      const resultsRes = await axios.get('/api/evaluations')
      const reportsRes = await axios.get('/api/reports')

      const total = projectsRes.data.length
      const completed = projectsRes.data.filter(p => p.status === '已完成').length
      const testing = projectsRes.data.filter(p => p.status === '测试中').length
      
      const scores = resultsRes.data.map(r => r.score)
      const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0

      setStats({ totalProjects: total, completedProjects: completed, testingProjects: testing, avgScore })

      const riskCounts = {}
      resultsRes.data.forEach(r => {
        riskCounts[r.risk_level] = (riskCounts[r.risk_level] || 0) + 1
      })
      setRiskData(riskCounts)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  const handleCreateProject = async () => {
    try {
      await axios.post('/api/projects', newProject)
      setShowModal(false)
      setNewProject({ name: '', description: '', ai_app_url: '', ai_app_type: '', target_age_group: '' })
      fetchProjects()
      fetchStats()
    } catch (error) {
      console.error('创建项目失败:', error)
    }
  }

  const handleDeleteProject = async (id) => {
    if (confirm('确定要删除这个项目吗？')) {
      try {
        await axios.delete(`/api/projects/${id}`)
        fetchProjects()
        fetchStats()
      } catch (error) {
        console.error('删除项目失败:', error)
      }
    }
  }

  const pieData = {
    labels: ['低风险', '中风险', '高风险', '严重风险'],
    datasets: [
      {
        data: [riskData['低风险'] || 0, riskData['中风险'] || 0, riskData['高风险'] || 0, riskData['严重风险'] || 0],
        backgroundColor: ['#48BB78', '#ECC94B', '#F6AD55', '#FC8181'],
        borderColor: ['#48BB78', '#ECC94B', '#F6AD55', '#FC8181'],
        borderWidth: 1,
      },
    ],
  }

  const barData = {
    labels: projects.slice(0, 5).map(p => p.name),
    datasets: [
      {
        label: '项目数',
        data: projects.slice(0, 5).map(p => 1),
        backgroundColor: '#0B4E4C',
      },
    ],
  }

  const getStatusClass = (status) => {
    switch (status) {
      case '已完成': return 'status-completed'
      case '测试中': return 'status-testing'
      default: return 'status-draft'
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-brand">护苗 Eval</div>
          <div className="sidebar-links">
            <Link to="/dashboard" className="active">测评工作台</Link>
            <Link to="/">返回首页</Link>
          </div>
        </aside>

        <main className="main-content">
          <h1 className="page-title">测评工作台</h1>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalProjects}</div>
              <div className="stat-label">总项目数</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completedProjects}</div>
              <div className="stat-label">已完成</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.testingProjects}</div>
              <div className="stat-label">测试中</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.avgScore}</div>
              <div className="stat-label">平均评分</div>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-card">
              <div className="chart-title">风险分布</div>
              <Pie data={pieData} />
            </div>
            <div className="chart-card">
              <div className="chart-title">项目统计</div>
              <Bar data={barData} />
            </div>
          </div>

          <section className="projects-section">
            <div className="section-header">
              <h2 className="section-title">测评项目列表</h2>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                创建新项目
              </button>
            </div>

            {projects.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                暂无项目，点击上方按钮创建第一个测评项目
              </p>
            ) : (
              <table className="project-table">
                <thead>
                  <tr>
                    <th>项目名称</th>
                    <th>应用类型</th>
                    <th>目标年龄</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.ai_app_type || '-'}</td>
                      <td>{project.target_age_group || '-'}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>{new Date(project.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="project-actions">
                          <Link to={`/project/${project.id}`} className="action-btn action-btn-primary">
                            详情
                          </Link>
                          <button 
                            className="action-btn action-btn-secondary"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">创建测评项目</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
              <div className="form-group">
                <label>项目名称 *</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>项目描述</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>AI应用URL</label>
                <input
                  type="url"
                  value={newProject.ai_app_url}
                  onChange={(e) => setNewProject({ ...newProject, ai_app_url: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>应用类型</label>
                <select
                  value={newProject.ai_app_type}
                  onChange={(e) => setNewProject({ ...newProject, ai_app_type: e.target.value })}
                >
                  <option value="">请选择</option>
                  <option value="聊天机器人">聊天机器人</option>
                  <option value="教育应用">教育应用</option>
                  <option value="智能助手">智能助手</option>
                  <option value="内容生成">内容生成</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div className="form-group">
                <label>目标年龄段</label>
                <select
                  value={newProject.target_age_group}
                  onChange={(e) => setNewProject({ ...newProject, target_age_group: e.target.value })}
                >
                  <option value="">请选择</option>
                  <option value="6-12岁">6-12岁</option>
                  <option value="12-15岁">12-15岁</option>
                  <option value="15-18岁">15-18岁</option>
                  <option value="全年龄段">全年龄段</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
