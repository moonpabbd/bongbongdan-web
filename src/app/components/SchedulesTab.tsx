import { useState, useEffect, useRef, useMemo } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, MapPin, Clock, Home, Settings, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/toss-datepicker.css';

const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;

interface ScheduleCategory {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface Schedule {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  location: string;
  shelterName: string;
  description: string;
  author: string;
  isAllDay?: boolean;
  categoryId?: string | null;
  createdAt: string;
  updatedAt: string;
}

const PREDEFINED_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#F43F5E', '#64748B', '#1E3A5F', '#C8963E'];

const CustomTimeInput = ({ date, value, onChange }: any) => {
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    if (value !== internalValue && value) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <input
      type="text"
      value={internalValue}
      onChange={(e) => {
        let val = e.target.value.replace(/[^0-9:]/g, '');
        // 자동 콜론 삽입
        if (val.length === 2 && !val.includes(':') && internalValue.length < val.length) {
          val += ':';
        }
        if (val.length > 5) val = val.slice(0, 5);
        setInternalValue(val);
        
        // 올바른 형식(HH:mm)이 완성되었을 때만 DatePicker에 값 전달
        if (val.length === 5 && val.includes(':')) {
          const [h, m] = val.split(':');
          if (parseInt(h) < 24 && parseInt(m) < 60) {
            onChange(val);
          }
        }
      }}
      placeholder="15:00"
      style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '15px', outline: 'none', width: '80px', textAlign: 'center', fontFamily: 'inherit', color: '#191F28' }}
      maxLength={5}
    />
  );
};

export function SchedulesTab() {
  const { profile, session } = useAuth();
  const isAdmin = profile?.isAdmin === true;
  
  const [calendarSchedules, setCalendarSchedules] = useState<Schedule[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);
  const [categories, setCategories] = useState<ScheduleCategory[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Partial<Schedule>>({ 
    title: '', subtitle: '', startDate: '', endDate: '', location: '', shelterName: '', description: '', categoryId: ''
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isCategoryManaging, setIsCategoryManaging] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<ScheduleCategory> | null>(null);

  const [viewingSchedule, setViewingSchedule] = useState<Schedule | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchCalendarData(currentDate);
  }, [currentDate]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [schRes, catRes] = await Promise.all([
        fetch(`${SERVER}/schedules`), // upcoming schedules
        fetch(`${SERVER}/schedule-categories`)
      ]);
      const schData = await schRes.json();
      const catData = await catRes.json();
      
      if (schData.schedules) setUpcomingSchedules(schData.schedules);
      if (catData.categories) {
        setCategories(catData.categories);
        setActiveCategories(catData.categories.map((c: any) => c.id));
      }
    } catch (err) {
      console.error(err);
      toast.error('초기 데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarData = async (date: Date) => {
    try {
      const y = date.getFullYear();
      const m = date.getMonth();
      // 달력에 표시될 수 있는 이전 달 말일과 다음 달 초일을 고려해 앞뒤로 여유 기간을 둠
      const start = new Date(y, m, -7).toISOString();
      const end = new Date(y, m + 1, 7).toISOString();
      
      const res = await fetch(`${SERVER}/schedules?startDate=${start}&endDate=${end}`);
      const data = await res.json();
      if (data.schedules) setCalendarSchedules(data.schedules);
    } catch (err) {
      console.error(err);
    }
  };

  const refetchAll = () => {
    fetchInitialData();
    fetchCalendarData(currentDate);
  };

  const handleSaveSchedule = async () => {
    if (!currentSchedule.title || !currentSchedule.startDate) {
      toast.error('일정 제목과 시작 일시를 입력해주세요.');
      return;
    }

    if (currentSchedule.endDate && new Date(currentSchedule.endDate) < new Date(currentSchedule.startDate)) {
      toast.error('종료 일시는 시작 일시보다 이전일 수 없습니다.');
      return;
    }

    const toastId = toast.loading('저장 중...');
    const url = currentSchedule.id ? `${SERVER}/schedules/${currentSchedule.id}` : `${SERVER}/schedules`;
    const method = currentSchedule.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(currentSchedule)
      });
      if (res.ok) {
        setIsEditing(false);
        refetchAll();
        toast.success('저장되었습니다.', { id: toastId });
      } else {
        toast.error('저장에 실패했습니다.', { id: toastId });
      }
    } catch (err) {
      toast.error('오류가 발생했습니다.', { id: toastId });
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`${SERVER}/schedules/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (res.ok) {
        toast.success('삭제되었습니다.');
        refetchAll();
      }
    } catch (err) {
      console.error(err);
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory?.name || !editingCategory?.color) {
      toast.error('카테고리 이름과 색상을 모두 입력해주세요.');
      return;
    }

    const isDuplicate = categories.some(
      c => c.name.trim() === editingCategory.name!.trim() && c.id !== editingCategory.id
    );

    if (isDuplicate) {
      toast.error('이미 동일한 이름의 카테고리가 존재합니다.');
      return;
    }

    const toastId = toast.loading('저장 중...');
    const url = editingCategory.id ? `${SERVER}/schedule-categories/${editingCategory.id}` : `${SERVER}/schedule-categories`;
    const method = editingCategory.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(editingCategory)
      });
      if (res.ok) {
        setEditingCategory(null);
        setIsCategoryManaging(false);
        fetchInitialData();
        toast.success('카테고리가 저장되었습니다.', { id: toastId });
      } else {
        toast.error('카테고리 저장에 실패했습니다.', { id: toastId });
      }
    } catch (err) {
      toast.error('오류가 발생했습니다.', { id: toastId });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('이 카테고리를 삭제하시겠습니까? (이 카테고리를 사용하는 기존 일정은 기본색으로 표시됩니다)')) return;
    try {
      const res = await fetch(`${SERVER}/schedule-categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (res.ok) {
        toast.success('카테고리가 삭제되었습니다.');
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  const toggleCategoryFilter = (id: string) => {
    setActiveCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const calculateDDay = (targetDate: string) => {
    if (!targetDate) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    if (isNaN(target.getTime())) return '';
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  const formatDateTime = (start: string, end?: string, isAllDay?: boolean) => {
    if (!start) return '';
    const dStart = new Date(start);
    if (isNaN(dStart.getTime())) return '';
    const dateStr = `${dStart.getFullYear()}.${String(dStart.getMonth() + 1).padStart(2, '0')}.${String(dStart.getDate()).padStart(2, '0')} (${['일','월','화','수','목','금','토'][dStart.getDay()]})`;
    
    if (isAllDay) {
      return `${dateStr} (하루 종일)`;
    }

    const timeStart = `${String(dStart.getHours()).padStart(2, '0')}:${String(dStart.getMinutes()).padStart(2, '0')}`;
    
    if (!end || start === end) return `${dateStr} ${timeStart}`;
    
    const dEnd = new Date(end);
    if (isNaN(dEnd.getTime())) return `${dateStr} ${timeStart}`;
    const timeEnd = `${String(dEnd.getHours()).padStart(2, '0')}:${String(dEnd.getMinutes()).padStart(2, '0')}`;
    
    return `${dateStr} ${timeStart} ~ ${timeEnd}`;
  };

  const filteredCalendarSchedules = useMemo(() => {
    return calendarSchedules.filter(s => {
      if (s.categoryId && !activeCategories.includes(s.categoryId)) return false;
      return true;
    });
  }, [calendarSchedules, activeCategories]);

  const filteredUpcomingSchedules = useMemo(() => {
    return upcomingSchedules.filter(s => {
      if (s.categoryId && !activeCategories.includes(s.categoryId)) return false;
      return true;
    });
  }, [upcomingSchedules, activeCategories]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>로딩 중...</div>;

  const renderScheduleDetailModal = () => {
    if (!viewingSchedule) return null;
    const s = viewingSchedule;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', width: '100%', maxWidth: '400px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E3A5F', margin: 0 }}>{s.title}</h2>
            <button type="button" onClick={() => setViewingSchedule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={24} /></button>
          </div>
          {s.subtitle && <p style={{ fontSize: '15px', color: '#4B5563', fontWeight: '600', marginBottom: '16px' }}>{s.subtitle}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', color: '#4B5563', fontSize: '14px' }}>
              <Clock size={16} color="#C8963E" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{formatDateTime(s.startDate, s.endDate, s.isAllDay)}</span>
            </div>
            {s.location && (
              <div style={{ display: 'flex', gap: '8px', color: '#4B5563', fontSize: '14px' }}>
                <MapPin size={16} color="#C8963E" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{s.location} {s.shelterName && `(${s.shelterName})`}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', color: '#4B5563', fontSize: '14px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: getCategoryColor(s.categoryId), flexShrink: 0, marginTop: '2px' }} />
              <span>{categories.find(c => c.id === s.categoryId)?.name || '카테고리 없음'}</span>
            </div>
          </div>
          {s.description && (
            <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {s.description}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCategoryManagerModal = () => {
    if (!isCategoryManaging) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E3A5F', margin: 0 }}>카테고리 관리</h2>
            <button type="button" onClick={() => setIsCategoryManaging(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={24} /></button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: cat.color }}></div>
                  <span style={{ fontWeight: '600', color: '#374151' }}>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setEditingCategory(cat)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: '4px' }}><Edit2 size={16} /></button>
                  <button type="button" onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {categories.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>등록된 카테고리가 없습니다.</div>}
          </div>

          <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#374151' }}>
              {editingCategory?.id ? '카테고리 수정' : '새 카테고리 추가'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#4B5563' }}>이름</label>
                <input type="text" value={editingCategory?.name || ''} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} placeholder="카테고리 이름" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#4B5563' }}>색상 선택</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PREDEFINED_COLORS.map(color => (
                    <button 
                      key={color}
                      type="button"
                      onClick={() => setEditingCategory({...editingCategory, color})}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', background: color, border: editingCategory?.color === color ? '3px solid #1E3A5F' : 'none', cursor: 'pointer', padding: 0 }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => {
                  if (editingCategory?.id) {
                    setEditingCategory(null);
                  } else {
                    setIsCategoryManaging(false);
                    setEditingCategory(null);
                  }
                }} style={{ padding: '8px 16px', background: '#E5E7EB', color: '#4B5563', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>취소</button>
                <button type="button" onClick={handleSaveCategory} style={{ padding: '8px 16px', background: '#1E3A5F', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>저장</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 일정 작성 폼
  if (isEditing) {
    return (
      <div style={{ position: 'relative', background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {renderCategoryManagerModal()}
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#1E3A5F' }}>
          {currentSchedule.id ? '일정 수정' : '새 일정 등록'}
        </h2>
        
        <div style={{ padding: '8px 0' }}>
          {/* 1. 기본 정보 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1E3A5F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '4px', height: '14px', background: '#C8963E', borderRadius: '2px' }} />
              기본 정보
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4B5563', margin: 0 }}>카테고리</label>
                  <button type="button" onClick={() => setIsCategoryManaging(true)} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Settings size={12} /> 관리
                  </button>
                </div>
                <select 
                  value={currentSchedule.categoryId || ''} 
                  onChange={e => setCurrentSchedule({...currentSchedule, categoryId: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid transparent', backgroundColor: '#F3F4F6', fontSize: '15px', outline: 'none', transition: 'all 0.2s', color: '#1F2937', fontWeight: '500', cursor: 'pointer', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.border = '1px solid #3B82F6'}
                  onBlur={e => e.target.style.border = '1px solid transparent'}
                >
                  <option value="">카테고리 없음 (기본색상)</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#4B5563' }}>제목 *</label>
                <input 
                  type="text" 
                  value={currentSchedule.title} 
                  onChange={e => setCurrentSchedule({...currentSchedule, title: e.target.value})} 
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid transparent', backgroundColor: '#F3F4F6', fontSize: '15px', outline: 'none', transition: 'all 0.2s', color: '#1F2937', fontWeight: '500', boxSizing: 'border-box' }} 
                  placeholder="일정 제목" 
                  onFocus={e => e.target.style.border = '1px solid #3B82F6'}
                  onBlur={e => e.target.style.border = '1px solid transparent'}
                />
              </div>
              <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#4B5563' }}>소제목</label>
                <input 
                  type="text" 
                  value={currentSchedule.subtitle} 
                  onChange={e => setCurrentSchedule({...currentSchedule, subtitle: e.target.value})} 
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid transparent', backgroundColor: '#F3F4F6', fontSize: '15px', outline: 'none', transition: 'all 0.2s', color: '#1F2937', fontWeight: '500', boxSizing: 'border-box' }} 
                  placeholder="소제목 (선택)" 
                  onFocus={e => e.target.style.border = '1px solid #3B82F6'}
                  onBlur={e => e.target.style.border = '1px solid transparent'}
                />
              </div>
            </div>
          </div>

          {/* 2. 일시 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1E3A5F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '4px', height: '14px', background: '#3B82F6', borderRadius: '2px' }} />
              일시
            </h3>
            
            <div style={{ padding: '20px', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#6B7280" />
                  <label htmlFor="isAllDay" style={{ fontSize: '15px', fontWeight: '700', color: '#374151', cursor: 'pointer', margin: 0 }}>하루 종일 (시간 미지정)</label>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input 
                    type="checkbox" 
                    id="isAllDay" 
                    checked={currentSchedule.isAllDay || false} 
                    onChange={e => setCurrentSchedule({...currentSchedule, isAllDay: e.target.checked})} 
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <span style={{ 
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: currentSchedule.isAllDay ? '#3B82F6' : '#D1D5DB', 
                    transition: '.4s', borderRadius: '24px' 
                  }}>
                    <span style={{ 
                      position: 'absolute', content: '""', height: '18px', width: '18px', 
                      left: currentSchedule.isAllDay ? '22px' : '3px', bottom: '3px', 
                      backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </span>
                </label>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#4B5563' }}>일정 날짜 *</label>
                  <DatePicker
                    ref={startDateRef}
                    locale={ko}
                    selected={currentSchedule.startDate ? new Date(currentSchedule.startDate) : null}
                    onChange={(date: Date | null) => {
                      if (!date) return setCurrentSchedule({...currentSchedule, startDate: '', endDate: ''});
                      const baseDateStr = format(date, "yyyy-MM-dd");
                      
                      if (currentSchedule.isAllDay) {
                        setCurrentSchedule({
                          ...currentSchedule,
                          startDate: baseDateStr,
                          endDate: ''
                        });
                      } else {
                        const oldStart = currentSchedule.startDate && currentSchedule.startDate.includes('T') ? currentSchedule.startDate.split('T')[1].substring(0,5) : "09:00";
                        const oldEnd = currentSchedule.endDate && currentSchedule.endDate.includes('T') ? currentSchedule.endDate.split('T')[1].substring(0,5) : "";
                        setCurrentSchedule({
                          ...currentSchedule,
                          startDate: `${baseDateStr}T${oldStart}:00`,
                          endDate: oldEnd ? `${baseDateStr}T${oldEnd}:00` : ''
                        });
                      }
                    }}
                    withPortal={isMobile}
                    dateFormat="yyyy년 MM월 dd일"
                    placeholderText="날짜 선택"
                    dayClassName={(date) => {
                      if (date.getMonth() !== (currentSchedule.startDate ? new Date(currentSchedule.startDate).getMonth() : new Date().getMonth())) return 'outside-month';
                      if (date.getDay() === 0) return 'sunday';
                      if (date.getDay() === 6) return 'saturday';
                      return '';
                    }}
                    customInput={<input className="toss-input" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#fff', fontSize: '15px', outline: 'none', transition: 'all 0.2s', color: '#1F2937', fontWeight: '500', cursor: 'pointer', boxSizing: 'border-box' }} />}
                  >
                    {isMobile && (
                      <div style={{ padding: '12px', marginTop: '8px', display: 'flex', justifyContent: 'center', width: '100%', boxSizing: 'border-box', borderTop: '1px solid #E5E7EB' }}>
                        <button type="button" onClick={() => startDateRef.current?.setOpen(false)} style={{ flex: 1, width: '100%', maxWidth: '300px', background: '#1E3A5F', color: '#fff', border: 'none', padding: '14px 0', borderRadius: '12px', fontWeight: '700', fontSize: '16px' }}>선택 완료</button>
                      </div>
                    )}
                  </DatePicker>
                </div>

                {!currentSchedule.isAllDay && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#4B5563' }}>시작 시간 *</label>
                      <DatePicker
                        selected={currentSchedule.startDate && currentSchedule.startDate.includes('T') ? new Date(currentSchedule.startDate) : (() => {
                          const d = new Date(); d.setHours(9, 0, 0, 0); return d;
                        })()}
                        onChange={(date: Date | null) => {
                          if (!date) return;
                          const timeStr = format(date, "HH:mm");
                          const baseDate = currentSchedule.startDate ? currentSchedule.startDate.substring(0,10) : format(new Date(), "yyyy-MM-dd");
                          setCurrentSchedule({...currentSchedule, startDate: `${baseDate}T${timeStr}:00`});
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                        timeCaption="시간"
                        dateFormat="aa hh:mm"
                        locale={ko}
                        withPortal={isMobile}
                        customInput={<input className="toss-input" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#fff', fontSize: '15px', outline: 'none', transition: 'all 0.2s', color: '#1F2937', fontWeight: '500', cursor: 'pointer', boxSizing: 'border-box', textAlign: 'center' }} />}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#4B5563' }}>종료 시간 (선택)</label>
                      <DatePicker
                        selected={currentSchedule.endDate && currentSchedule.endDate.includes('T') ? new Date(currentSchedule.endDate) : null}
                        onChange={(date: Date | null) => {
                          if (!date) {
                            setCurrentSchedule({...currentSchedule, endDate: ''});
                            return;
                          }
                          const timeStr = format(date, "HH:mm");
                          const baseDate = currentSchedule.startDate ? currentSchedule.startDate.substring(0,10) : format(new Date(), "yyyy-MM-dd");
                          setCurrentSchedule({...currentSchedule, endDate: `${baseDate}T${timeStr}:00`});
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                        timeCaption="시간"
                        dateFormat="aa hh:mm"
                        locale={ko}
                        placeholderText="-- : --"
                        withPortal={isMobile}
                        customInput={<input className="toss-input" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#fff', fontSize: '15px', outline: 'none', transition: 'all 0.2s', color: '#1F2937', fontWeight: '500', cursor: 'pointer', boxSizing: 'border-box', textAlign: 'center' }} />}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. 상세 정보 */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1E3A5F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '4px', height: '14px', background: '#10B981', borderRadius: '2px' }} />
              상세 정보
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#4B5563' }}>장소</label>
                <input 
                  type="text" 
                  value={currentSchedule.location} 
                  onChange={e => setCurrentSchedule({...currentSchedule, location: e.target.value})} 
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid transparent', backgroundColor: '#F3F4F6', fontSize: '15px', outline: 'none', transition: 'all 0.2s', color: '#1F2937', fontWeight: '500', boxSizing: 'border-box' }} 
                  placeholder="장소 입력 (선택)" 
                  onFocus={e => e.target.style.border = '1px solid #3B82F6'}
                  onBlur={e => e.target.style.border = '1px solid transparent'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#4B5563' }}>상세 설명</label>
                <textarea 
                  value={currentSchedule.description} 
                  onChange={e => setCurrentSchedule({...currentSchedule, description: e.target.value})} 
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid transparent', backgroundColor: '#F3F4F6', fontSize: '15px', minHeight: '120px', resize: 'vertical', outline: 'none', transition: 'all 0.2s', color: '#1F2937', fontWeight: '500', lineHeight: '1.6', boxSizing: 'border-box' }} 
                  placeholder="일정에 대한 상세한 설명을 적어주세요." 
                  onFocus={e => e.target.style.border = '1px solid #3B82F6'}
                  onBlur={e => e.target.style.border = '1px solid transparent'}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
          {currentSchedule.id && (
            <button 
              onClick={() => {
                handleDeleteSchedule(currentSchedule.id!);
                setIsEditing(false);
              }}
              style={{ padding: '12px 24px', background: '#FEF2F2', color: '#DC2626', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginRight: 'auto', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
              onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
            >
              삭제
            </button>
          )}
          <button 
            onClick={() => setIsEditing(false)}
            style={{ padding: '12px 24px', background: '#F3F4F6', color: '#4B5563', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'}
            onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}
          >
            취소
          </button>
          <button 
            onClick={handleSaveSchedule}
            style={{ padding: '12px 32px', background: '#1E3A5F', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,58,95,0.2)', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            저장
          </button>
        </div>
      </div>
    );
  }


  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarCells: (Date | null)[] = [];
  for (let i = 0; i < startingDay; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(new Date(year, month, i));
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const holidays: Record<string, string> = {
    '2026-01-01': '신정',
    '2026-02-16': '설연휴',
    '2026-02-17': '설날',
    '2026-02-18': '설연휴',
    '2026-03-01': '삼일절',
    '2026-05-05': '어린이날',
    '2026-05-24': '부처님오신날',
    '2026-05-25': '대체공휴일',
    '2026-06-06': '현충일',
    '2026-08-15': '광복절',
    '2026-09-24': '추석연휴',
    '2026-09-25': '추석',
    '2026-09-26': '추석연휴',
    '2026-10-03': '개천절',
    '2026-10-09': '한글날',
    '2026-12-25': '기독탄신일'
  };

  const getCategoryColor = (categoryId?: string | null) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.color : '#9CA3AF'; // 기본 회색
  };



  return (
    <div>
      {renderScheduleDetailModal()}
      {isAdmin && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px' }}>
          <button 
            onClick={() => { 
              setCurrentSchedule({ title: '', subtitle: '', startDate: '', endDate: '', location: '', shelterName: '', description: '', categoryId: categories.length > 0 ? categories[0].id : '', isAllDay: true }); 
              setIsEditing(true); 
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: '#1E3A5F', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}
          >
            <Plus size={16} /> 새 일정 등록
          </button>
        </div>
      )}

      {/* 카테고리 필터 영역 */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {categories.map(cat => {
            const isActive = activeCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategoryFilter(cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '20px', cursor: 'pointer',
                  border: `1px solid ${isActive ? cat.color : '#E5E7EB'}`,
                  background: isActive ? cat.color : '#fff',
                  color: isActive ? '#fff' : '#6B7280',
                  fontWeight: '600', fontSize: '13px', transition: 'all 0.2s'
                }}
              >
                {isActive && <Check size={14} color="#fff" />}
                {cat.name}
              </button>
            )
          })}
        </div>
      )}

      {/* 캘린더 UI */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB', marginBottom: '32px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 16px 16px 16px', gap: '4px' }}>
          <button onClick={prevMonth} style={{ padding: '6px 10px', fontSize: '13px', background: '#F3F4F6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', color: '#4B5563', whiteSpace: 'nowrap', flexShrink: 0 }}>&lt; 이전</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 1, minWidth: 0, justifyContent: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E3A5F', margin: 0, whiteSpace: 'nowrap' }}>{year}년 {month + 1}월</h3>
            <button onClick={goToToday} style={{ padding: '4px 8px', background: '#FEF3C7', border: 'none', borderRadius: '20px', color: '#D97706', fontWeight: '700', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>오늘</button>
          </div>
          <button onClick={nextMonth} style={{ padding: '6px 10px', fontSize: '13px', background: '#F3F4F6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', color: '#4B5563', whiteSpace: 'nowrap', flexShrink: 0 }}>다음 &gt;</button>
        </div>
        <div style={{ background: '#fff', borderTop: '1px solid #E5E7EB' }}>
          {isMobile ? (
            <div style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
              {filteredCalendarSchedules.length === 0 ? (
                <div style={{ padding: '60px', color: '#9CA3AF', textAlign: 'center', fontSize: '14px' }}>이번 달에 등록된 일정이 없습니다.</div>
              ) : (
                filteredCalendarSchedules
                  .slice()
                  .sort((a, b) => new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime())
                  .map(s => {
                    const color = getCategoryColor(s.categoryId);
                    const isAllDay = s.isAllDay;
                    let timeStr = '';
                    if (!isAllDay && s.startDate) {
                       const d = new Date(s.startDate);
                       if (!isNaN(d.getTime())) {
                          timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
                       }
                    }
                    const displayTime = isAllDay ? '하루 종일' : timeStr;
                    const dDate = s.startDate ? new Date(s.startDate) : new Date();
                    const dateNum = dDate.getDate();
                    const dayName = ['일', '월', '화', '수', '목', '금', '토'][dDate.getDay()];
                    
                    return (
                      <div 
                        key={s.id}
                        onClick={() => {
                          if (isAdmin) {
                            setCurrentSchedule(s);
                            setIsEditing(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          } else {
                            setViewingSchedule(s);
                          }
                        }}
                        style={{ 
                          display: 'flex', 
                          gap: '16px', 
                          padding: '16px', 
                          borderBottom: '1px solid #E5E7EB',
                          cursor: 'pointer',
                          background: '#fff'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                          <span style={{ fontSize: '12px', color: dDate.getDay() === 0 ? '#DC2626' : dDate.getDay() === 6 ? '#2563EB' : '#6B7280', fontWeight: '600' }}>{dayName}</span>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: dDate.getDay() === 0 ? '#DC2626' : dDate.getDay() === 6 ? '#2563EB' : '#111827', marginTop: '-2px' }}>{dateNum}</span>
                        </div>
                        
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
                            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>{displayTime}</span>
                          </div>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>{s.title}</h4>
                          {s.subtitle && <span style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{s.subtitle}</span>}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '1px', background: '#E5E7EB' }}>
              {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                <div key={day} style={{ background: '#F9FAFB', padding: '10px 2px', textAlign: 'center', fontWeight: '700', color: idx === 0 ? '#DC2626' : idx === 6 ? '#2563EB' : '#4B5563', fontSize: '12px' }}>
                  {day}
                </div>
              ))}
              {calendarCells.map((date, i) => {
                if (!date) return <div key={i} style={{ background: '#fff', minHeight: '120px' }} />;
                
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const daySchedules = filteredCalendarSchedules.filter(s => s.startDate && s.startDate.startsWith(dateStr));
                
                const isToday = new Date().toDateString() === date.toDateString();
                const holidayName = holidays[dateStr];
                
                return (
                  <div key={i} style={{ background: isToday ? '#FFFBEB' : '#fff', padding: '4px', minHeight: '120px', borderTop: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px', gap: '4px' }}>
                      <div style={{ fontWeight: '600', color: isToday ? '#fff' : (date.getDay() === 0 || holidayName) ? '#DC2626' : date.getDay() === 6 ? '#2563EB' : '#374151', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '22px', height: '22px', borderRadius: '50%', background: isToday ? '#C8963E' : 'transparent', fontSize: '12px' }}>
                        {date.getDate()}
                      </div>
                      {holidayName && (
                        <span style={{ fontSize: '9px', color: '#DC2626', fontWeight: '700', background: '#FEE2E2', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', wordBreak: 'keep-all', lineHeight: '1.2' }}>{holidayName}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                      {daySchedules.map(s => {
                        const color = getCategoryColor(s.categoryId);
                        const isAllDay = s.isAllDay;
                        let timeStr = '';
                        if (!isAllDay && s.startDate) {
                           const d = new Date(s.startDate);
                           if (!isNaN(d.getTime())) {
                              timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
                           }
                        }
                        const displayTitle = isAllDay ? s.title : `${timeStr} ${s.title}`;
                        
                        return (
                          <div 
                            key={s.id} 
                            title={s.title} 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAdmin) {
                                setCurrentSchedule(s);
                                setIsEditing(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else {
                                setViewingSchedule(s);
                              }
                            }}
                            style={{ 
                              background: isAllDay ? color : 'transparent', 
                              color: isAllDay ? '#fff' : color, 
                              padding: '4px 6px', 
                              borderRadius: '4px', 
                              fontSize: '12px', 
                              fontWeight: '700', 
                              whiteSpace: 'normal',
                              textOverflow: 'ellipsis',
                              wordBreak: 'break-all',
                              overflowWrap: 'break-word',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden', 
                              lineHeight: '1.2', 
                              letterSpacing: '-0.3px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            {displayTitle}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E3A5F', marginBottom: '16px' }}>다가올 일정 목록</h3>

      {filteredUpcomingSchedules.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF', background: '#fff', borderRadius: '16px', border: '1px dashed #E5E7EB' }}>
          등록된 일정이 없습니다.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredUpcomingSchedules
            .filter(s => s.startDate) // Ensure startDate exists
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .map(s => (
            <div key={s.id} style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ display: 'inline-block', background: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>
                    {calculateDDay(s.startDate)}
                  </span>
                  {s.categoryId && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getCategoryColor(s.categoryId) }}></div>
                      {categories.find(c => c.id === s.categoryId)?.name}
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setCurrentSchedule(s); setIsEditing(true); }} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: '4px' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteSchedule(s.id)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></button>
                  </div>
                )}
              </div>
              
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E3A5F', marginBottom: '4px' }}>{s.title}</h3>
              {s.subtitle && <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>{s.subtitle}</p>}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#4B5563', marginBottom: '16px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Clock size={16} color="#9CA3AF" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{formatDateTime(s.startDate, s.endDate, s.isAllDay)}</span>
                </div>
                {s.location && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={16} color="#9CA3AF" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{s.location}</span>
                  </div>
                )}
                {s.shelterName && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Home size={16} color="#9CA3AF" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{s.shelterName}</span>
                  </div>
                )}
              </div>

              {s.description && (
                <div style={{ background: '#F9FAFB', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#4B5563', whiteSpace: 'pre-wrap' }}>
                  {s.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
