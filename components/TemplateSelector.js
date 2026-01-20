// components/TemplateSelector.js

import { useState } from 'react';
import { getAllTemplates } from '../lib/templateRoasts';

export default function TemplateSelector({ onSelectTemplate, selectedTemplate }) {
  const templates = getAllTemplates();

  return (
    <div style={{
      marginBottom: '30px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#00FFFF',
          margin: '0 0 8px 0'
        }}>
          🎯 Choose Roast Template
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.9rem',
          margin: 0
        }}>
          Pick what aspect to compare & roast
        </p>
      </div>

      {/* Template Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            type="button"
            style={{
              background: selectedTemplate?.id === template.id
                ? `linear-gradient(135deg, ${template.color}30, ${template.color}10)`
                : 'rgba(255, 255, 255, 0.05)',
              border: selectedTemplate?.id === template.id
                ? `2px solid ${template.color}`
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px 16px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'inherit',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              if (selectedTemplate?.id !== template.id) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = template.color;
                e.currentTarget.style.boxShadow = `0 8px 20px ${template.color}40`;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTemplate?.id !== template.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {/* Selected Badge */}
            {selectedTemplate?.id === template.id && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '24px',
                height: '24px',
                background: template.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontWeight: '900',
                fontSize: '0.7rem',
                animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                ✓
              </div>
            )}

            {/* Emoji */}
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '10px',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
            }}>
              {template.emoji}
            </div>

            {/* Label */}
            <div style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: selectedTemplate?.id === template.id ? template.color : '#fff',
              marginBottom: '6px',
              lineHeight: '1.3'
            }}>
              {template.label.replace(template.emoji, '').trim()}
            </div>

            {/* Description */}
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: '1.4'
            }}>
              {template.description}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <div style={{
          background: `linear-gradient(135deg, ${selectedTemplate.color}20, ${selectedTemplate.color}05)`,
          border: `1px solid ${selectedTemplate.color}40`,
          borderRadius: '12px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontSize: '1.3rem' }}>{selectedTemplate.emoji}</span>
          <span style={{
            color: selectedTemplate.color,
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>
            Selected: <strong>{selectedTemplate.label}</strong>
          </span>
        </div>
      )}

      {/* Inline Animations */}
      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
