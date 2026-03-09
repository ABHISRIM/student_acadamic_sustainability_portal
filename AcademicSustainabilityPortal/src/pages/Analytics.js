import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Analytics.css';

function Analytics() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch metrics from backend
      const metricsRes = await fetch('http://localhost:5000/api/dashboard/metrics');
      const metricsData = await metricsRes.json();
      setMetrics(metricsData);

      // Fetch all issues for analysis
      const issuesRes = await fetch('http://localhost:5000/api/issues');
      const issuesData = await issuesRes.json();
      setIssues(issuesData);
    } catch (err) {
      setError('Failed to load analytics data: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate category breakdown
  const getCategoryStats = () => {
    const stats = {};
    issues.forEach(issue => {
      const category = issue.category || 'Other';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  };

  // Calculate priority breakdown
  const getPriorityStats = () => {
    const stats = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    issues.forEach(issue => {
      stats[issue.priority || 'Medium']++;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();
  const priorityStats = getPriorityStats();

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Sustainability Analytics Dashboard</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Key Metrics */}
      <section className="analytics-section">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-box">
            <h3>Total Issues</h3>
            <p className="metric-value">{metrics?.totalIssues || 0}</p>
            <p className="metric-label">Reported issues</p>
          </div>
          <div className="metric-box pending">
            <h3>Pending</h3>
            <p className="metric-value">{metrics?.pendingIssues || 0}</p>
            <p className="metric-label">Awaiting action</p>
          </div>
          <div className="metric-box in-progress">
            <h3>In Progress</h3>
            <p className="metric-value">{metrics?.inProgressIssues || 0}</p>
            <p className="metric-label">Being worked on</p>
          </div>
          <div className="metric-box resolved">
            <h3>Resolved</h3>
            <p className="metric-value">{metrics?.resolvedIssues || 0}</p>
            <p className="metric-label">Closed issues</p>
          </div>
        </div>
      </section>

      {/* Sustainability Metrics */}
      <section className="analytics-section">
        <h2>Sustainability Metrics</h2>
        <div className="sustainability-grid">
          <div className="metric-card">
            <div className="icon">⚡</div>
            <h3>Energy Usage</h3>
            <p className="value">{metrics?.energyUsage || 'N/A'}</p>
            <p className="label">This month</p>
          </div>
          <div className="metric-card">
            <div className="icon">♻️</div>
            <h3>Waste Reduction</h3>
            <p className="value">{metrics?.wasteReduction || 'N/A'}</p>
            <p className="label">Recycled</p>
          </div>
          <div className="metric-card">
            <div className="icon">🌱</div>
            <h3>Carbon Footprint</h3>
            <p className="value">{metrics?.carbonFootprint || 'N/A'}</p>
            <p className="label">Year over year</p>
          </div>
          <div className="metric-card">
            <div className="icon">👥</div>
            <h3>Contributors</h3>
            <p className="value">{metrics?.contributors || 0}</p>
            <p className="label">Active members</p>
          </div>
        </div>
      </section>

      {/* Issues by Category */}
      <section className="analytics-section">
        <h2>Issues by Category</h2>
        <div className="chart-container">
          <div className="category-stats">
            {Object.keys(categoryStats).length > 0 ? (
              Object.entries(categoryStats).map(([category, count]) => {
                const maxCount = Math.max(...Object.values(categoryStats));
                const percentage = (count / maxCount) * 100;
                return (
                  <div key={category} className="stat-bar">
                    <div className="stat-label">
                      <span>{category}</span>
                      <span className="count">{count}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-data">No issues reported yet</p>
            )}
          </div>
        </div>
      </section>

      {/* Issues by Priority */}
      <section className="analytics-section">
        <h2>Issues by Priority</h2>
        <div className="priority-grid">
          <div className="priority-card low">
            <h3>Low Priority</h3>
            <p className="count">{priorityStats.Low}</p>
            <p className="label">Issues</p>
          </div>
          <div className="priority-card medium">
            <h3>Medium Priority</h3>
            <p className="count">{priorityStats.Medium}</p>
            <p className="label">Issues</p>
          </div>
          <div className="priority-card high">
            <h3>High Priority</h3>
            <p className="count">{priorityStats.High}</p>
            <p className="label">Issues</p>
          </div>
          <div className="priority-card critical">
            <h3>Critical Priority</h3>
            <p className="count">{priorityStats.Critical}</p>
            <p className="label">Issues</p>
          </div>
        </div>
      </section>

      {/* Status Distribution */}
      <section className="analytics-section">
        <h2>Resolution Status</h2>
        <div className="status-distribution">
          <div className="status-item">
            <div className="status-bar">
              <div
                className="status-fill pending"
                style={{
                  width:
                    metrics?.totalIssues > 0
                      ? ((metrics?.pendingIssues || 0) / metrics.totalIssues) * 100 + '%'
                      : '0%',
                }}
              ></div>
            </div>
            <p className="status-label">Pending</p>
            <p className="status-count">
              {metrics?.pendingIssues || 0} / {metrics?.totalIssues || 0}
            </p>
          </div>
          <div className="status-item">
            <div className="status-bar">
              <div
                className="status-fill in-progress"
                style={{
                  width:
                    metrics?.totalIssues > 0
                      ? ((metrics?.inProgressIssues || 0) / metrics.totalIssues) * 100 + '%'
                      : '0%',
                }}
              ></div>
            </div>
            <p className="status-label">In Progress</p>
            <p className="status-count">
              {metrics?.inProgressIssues || 0} / {metrics?.totalIssues || 0}
            </p>
          </div>
          <div className="status-item">
            <div className="status-bar">
              <div
                className="status-fill resolved"
                style={{
                  width:
                    metrics?.totalIssues > 0
                      ? ((metrics?.resolvedIssues || 0) / metrics.totalIssues) * 100 + '%'
                      : '0%',
                }}
              ></div>
            </div>
            <p className="status-label">Resolved</p>
            <p className="status-count">
              {metrics?.resolvedIssues || 0} / {metrics?.totalIssues || 0}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Issues List */}
      <section className="analytics-section recent-issues-section">
        <h2>Recent Issues</h2>
        {issues.length > 0 ? (
          <div className="issues-table">
            <div className="table-header">
              <div className="col title">Title</div>
              <div className="col category">Category</div>
              <div className="col priority">Priority</div>
              <div className="col status">Status</div>
              <div className="col location">Location</div>
            </div>
            {issues.slice(0, 10).map(issue => (
              <div key={issue._id} className="table-row">
                <div className="col title">{issue.title}</div>
                <div className="col category">{issue.category}</div>
                <div className={`col priority ${issue.priority.toLowerCase()}`}>
                  {issue.priority}
                </div>
                <div className={`col status ${issue.status.toLowerCase().replace(' ', '-')}`}>
                  {issue.status}
                </div>
                <div className="col location">{issue.location}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No issues available</p>
        )}
      </section>
    </div>
  );
}

export default Analytics;
