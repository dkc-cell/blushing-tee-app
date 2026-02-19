import React from 'react';
import { COLORS } from '../constants';

const ManageCoursesScreen = ({ 
  courses, 
  onBack, 
  onEditCourse, 
  onDeleteCourse,
  onCreateCourse 
}) => {
  const handleDelete = (course) => {
    if (window.confirm(`Are you sure you want to delete "${course.name}"?`)) {
      onDeleteCourse(course.id);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: COLORS.darkTeal, fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' }}>← Back</button>
        <h2 style={{ color: COLORS.darkTeal, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Manage Courses</h2>
        <p style={{ color: COLORS.charcoal, fontSize: '18px', margin: '4px 0 0 0' }}>Edit or delete your saved courses</p>
      </div>
      
      <div style={{ padding: '0 24px' }}>
        {courses.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛳</div>
            <p style={{ color: COLORS.charcoal, fontSize: '16px' }}>No saved courses yet. Create your first course to get started!</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: COLORS.darkTeal, fontWeight: 'bold', fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>
              Your Saved Courses ({courses.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {courses.map(course => (
                <div
                  key={course.id}
                  style={{
                    backgroundColor: COLORS.cream,
                    border: `2px solid ${COLORS.mistyBlue}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: COLORS.darkTeal, fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {course.name}
                    </div>
                    <div style={{ color: COLORS.charcoal, fontSize: '14px' }}>
                      18 holes • Custom pars & yardages
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onEditCourse(course)}
                      style={{
                        backgroundColor: COLORS.mistyBlue,
                        color: COLORS.charcoal,
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course)}
                      style={{
                        backgroundColor: '#FF6B6B',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Create New Course Button */}
        <button
          onClick={onCreateCourse}
          style={{
            width: '100%',
            background: `linear-gradient(90deg, ${COLORS.blush} 0%, ${COLORS.blush}CC 100%)`,
            color: COLORS.charcoal,
            padding: '20px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            marginTop: '24px'
          }}
        >
          <span style={{ fontSize: '24px' }}>➕</span>
          <span>Create New Course</span>
        </button>
      </div>
    </div>
  );
};

export default ManageCoursesScreen;
