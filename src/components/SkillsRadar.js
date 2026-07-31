import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import './SkillsRadar.css';

const SkillsRadar = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample DevOps skills data organized by category
  const skillsData = {
    containerization: [
      { skill: 'Docker', value: 90, fullMark: 100 },
      { skill: 'Kubernetes', value: 85, fullMark: 100 },
      { skill: 'Podman', value: 60, fullMark: 100 },
      { skill: 'Containerd', value: 70, fullMark: 100 },
    ],
    cicd: [
      { skill: 'Jenkins', value: 80, fullMark: 100 },
      { skill: 'GitLab CI', value: 85, fullMark: 100 },
      { skill: 'GitHub Actions', value: 90, fullMark: 100 },
      { skill: 'ArgoCD', value: 75, fullMark: 100 },
      { skill: 'Tekton', value: 65, fullMark: 100 },
    ],
    monitoring: [
      { skill: 'Prometheus', value: 85, fullMark: 100 },
      { skill: 'Grafana', value: 80, fullMark: 100 },
      { skill: 'ELK Stack', value: 75, fullMark: 100 },
      { skill: 'Jaeger', value: 70, fullMark: 100 },
    ],
    infrastructure: [
      { skill: 'Terraform', value: 85, fullMark: 100 },
      { skill: 'Ansible', value: 80, fullMark: 100 },
      { skill: 'CloudFormation', value: 70, fullMark: 100 },
      { skill: 'Pulumi', value: 65, fullMark: 100 },
    ],
    all: [
      { skill: 'Docker', value: 90, fullMark: 100 },
      { skill: 'Kubernetes', value: 85, fullMark: 100 },
      { skill: 'Jenkins', value: 80, fullMark: 100 },
      { skill: 'GitLab CI', value: 85, fullMark: 100 },
      { skill: 'Prometheus', value: 85, fullMark: 100 },
      { skill: 'Grafana', value: 80, fullMark: 100 },
      { skill: 'Terraform', value: 85, fullMark: 100 },
      { skill: 'Ansible', value: 80, fullMark: 100 },
    ],
  };

  const categories = [
    { id: 'all', name: 'All Skills', icon: '🌟' },
    { id: 'containerization', name: 'Containerization', icon: '🐳' },
    { id: 'cicd', name: 'CI/CD', icon: '🔄' },
    { id: 'monitoring', name: 'Monitoring', icon: '📊' },
    { id: 'infrastructure', name: 'Infrastructure', icon: '🏗️' },
  ];

  const currentData = skillsData[selectedCategory] || skillsData.all;

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.skill}</p>
          <p className="tooltip-value">
            Skill Level: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="skills-radar-container">
      <div className="radar-card">
        <div className="category-selector">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="radar-chart-wrapper">
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={currentData}>
              <PolarGrid 
                stroke="#ffffff" 
                opacity={0.4}
                strokeWidth={1.5}
              />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ 
                  fill: '#ffffff', 
                  fontSize: 15, 
                  fontWeight: 600,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
                tickLine={{ stroke: '#ffffff', opacity: 0.6, strokeWidth: 2 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ 
                  fill: '#ffffff', 
                  fontSize: 13,
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
                tickCount={5}
                stroke="#ffffff"
                opacity={0.5}
              />
              <Radar
                name="Skill Level"
                dataKey="value"
                stroke="#818cf8"
                fill="#818cf8"
                fillOpacity={0.7}
                strokeWidth={3}
                dot={{ fill: '#ffffff', r: 5, strokeWidth: 2, stroke: '#818cf8' }}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Tooltip content={customTooltip} />
              <Legend
                wrapperStyle={{ color: '#ffffff' }}
                iconType="circle"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="legend-info">
          <div className="legend-item">
            <div className="legend-color" style={{ 
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 0 15px rgba(129, 140, 248, 0.5)'
            }}></div>
            <span>Current Skill Level</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}></div>
            <span>Maximum (100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsRadar;

