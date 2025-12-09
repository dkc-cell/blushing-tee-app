import React from 'react';
import { ChevronRight } from 'lucide-react';
import { COLORS } from '../constants';
import { getLocalDateString } from '../utils';

const SelectCourseScreen = ({ 
  courses, 
  onUpdateCourses,
  onSelectCourse, 
  onNewCourse, 
  onBack 
}) => {
  // Sort courses by last played date (most recent first), then by favorite status
  const sortedCourses = [...courses].sort((a, b) => {
    // Favorites first
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    // Then by last played
    if (a.lastPlayed && b.lastPlayed) {
      return new Date(b.lastPlayed) - new Date(a.lastPlayed);
    }
    if (a.lastPlayed) return -1;
    if (b.lastPlayed) return 1;
    return 0;
  });

  const handleToggleFavorite = (courseId, e) => {
    e.stopPropagation();
    const updatedCourses = courses.map(c => 
      c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c
    );
    onUpdateCourses(updatedCourses);
  };

  const handleSelectCourse = (course) => {
    // Update last played date
    const dateStr = getLocalDateString();
    const updatedCourses = courses.map(c => 
      c.id === course.id ? { ...c, lastPlayed: dateStr } : c
    );
    onUpdateCourses(updatedCourses);
    onSelectCourse(course);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.cream, paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '20px 24px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        marginBottom: '24px' 
      }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: COLORS.darkTeal, 
            fontSize: '18px', 
            fontWeight: '600', 
            cursor: 'pointer', 
            marginBottom: '8px' 
          }}
        >
          ← Back
        </button>
        <h2 style={{ color: COLORS.darkTeal, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          Start a Round
        </h2>
        <p style={{ color: COLORS.charcoal, fontSize: '18px', margin: '4px 0 0 0' }}>
          Choose how to begin
        </p>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* New Course Option */}
        <button
          onClick={onNewCourse}
          style={{
            width: '100%',
            background: `linear-gradient(135deg, ${COLORS.blush} 0%, ${COLORS.blush}CC 100%)`,
            color: COLORS.charcoal,
            padding: '24px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            marginBottom: '16px',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: 'rgba(255,255,255,0.3)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⛳
            </div>
            <div>
              <div>New Course</div>
              <div style={{ fontSize: '14px', fontWeight: 'normal', opacity: 0.8, marginTop: '4px' }}>
                Enter par & yardage as you play
              </div>
            </div>
          </div>
        </button>

        {/* Saved Courses Section */}
        {courses.length > 0 ? (
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '20px', 
            padding: '20px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ 
              color: COLORS.darkTeal, 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginTop: 0, 
              marginBottom: '16px' 
            }}>
              📋 Saved Courses ({courses.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedCourses.map(course => (
                <div
                  key={course.id}
                  style={{
                    backgroundColor: COLORS.cream,
                    border: `2px solid ${course.isFavorite ? COLORS.blush : COLORS.mistyBlue}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  {/* Favorite toggle */}
                  <button
                    onClick={(e) => handleToggleFavorite(course.id, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {course.isFavorite ? '⭐' : '☆'}
                  </button>
                  
                  {/* Course info - clickable to start round */}
                  <button
                    onClick={() => handleSelectCourse(course)}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      padding: '0'
                    }}
                  >
                    <div style={{ 
                      color: COLORS.darkTeal, 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      marginBottom: '4px' 
                    }}>
                      {course.name}
                    </div>
                    <div style={{ color: COLORS.mistyBlue, fontSize: '12px' }}>
                      {course.lastPlayed ? (
                        `Last played: ${new Date(course.lastPlayed + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      ) : (
                        'Never played'
                      )}
                    </div>
                  </button>
                  
                  <ChevronRight style={{ width: '20px', height: '20px', color: COLORS.mistyBlue }} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '20px', 
            padding: '32px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ 
              color: COLORS.darkTeal, 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginTop: 0, 
              marginBottom: '8px' 
            }}>
              No Saved Courses Yet
            </h3>
            <p style={{ color: COLORS.charcoal, fontSize: '14px', margin: 0 }}>
              Start a new round and save your course to quickly access it next time!
            </p>
          </div>
        )}

        {/* Tip */}
        <div style={{ 
          background: `linear-gradient(90deg, ${COLORS.blush}33 0%, ${COLORS.mistyBlue}33 100%)`, 
          borderRadius: '12px', 
          padding: '16px', 
          marginTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{ color: COLORS.darkTeal, fontSize: '14px', margin: 0, fontStyle: 'italic' }}>
            💡 Tip: Tap the star to favorite your most-played courses!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectCourseScreen;
