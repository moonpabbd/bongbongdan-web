import { useState, useEffect, Fragment, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { useAuth } from '../context/AuthContext';
import { Plus, Pin, Trash2, Edit2, Paperclip, X, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { useDialog } from '../contexts/DialogContext';

const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;

const isNewNotice = (createdAt: string) => {
  const now = new Date();
  const noticeDate = new Date(createdAt);
  const diffTime = now.getTime() - noticeDate.getTime();
  return diffTime >= 0 && diffTime <= 7 * 24 * 60 * 60 * 1000; // 7일(ms) 이내
};

interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  isPinned: boolean;
  attachments: { name: string; url: string }[];
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export function NoticesTab() {
  const { profile, session } = useAuth();
  const isAdmin = profile?.isAdmin === true;
  const { showConfirm } = useDialog();
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Partial<Notice>>({ title: '', content: '', isPinned: false, attachments: [] });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, [page, searchQuery]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/notices?page=${page}&limit=10&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.notices) {
        setNotices(data.notices);
        setTotalPages(Math.ceil((data.total || 0) / (data.limit || 10)));
      }
    } catch (err) {
      console.error(err);
      toast.error('공지사항을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(tempSearchQuery);
  };

  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);

    // 조회수 증가 API 호출
    try {
      const res = await fetch(`${SERVER}/notices/${id}/view`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setNotices(prev => prev.map(n => n.id === id ? { ...n, viewCount: data.viewCount } : n));
      }
    } catch (err) {
      console.error("View count increment failed", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('첨부파일은 10MB 이하만 업로드 가능합니다.');
      return;
    }

    const toastId = toast.loading('파일 업로드 중...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `attachments/${fileName}`;

      const { error } = await supabase.storage.from('notices').upload(filePath, file);
      
      if (error) throw error;

      const { data } = supabase.storage.from('notices').getPublicUrl(filePath);

      setCurrentNotice(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), { name: file.name, url: data.publicUrl }]
      }));
      toast.success('업로드 완료', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('파일 업로드에 실패했습니다. (notices 버킷이 존재하는지 확인하세요)', { id: toastId });
    }
  };

  const handleSave = async () => {
    if (!currentNotice.title || !currentNotice.content) {
      toast.error('제목과 내용을 입력해주세요.');
      return;
    }
    
    const toastId = toast.loading('저장 중...');
    const url = currentNotice.id ? `${SERVER}/notices/${currentNotice.id}` : `${SERVER}/notices`;
    const method = currentNotice.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(currentNotice)
      });
      if (res.ok) {
        setIsEditing(false);
        fetchNotices();
        toast.success('저장되었습니다.', { id: toastId });
      } else {
        toast.error('저장에 실패했습니다.', { id: toastId });
      }
    } catch (err) {
      toast.error('오류가 발생했습니다.', { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!(await showConfirm('정말 삭제하시겠습니까?'))) return;
    try {
      const res = await fetch(`${SERVER}/notices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (res.ok) {
        toast.success('삭제되었습니다.');
        fetchNotices();
      }
    } catch (err) {
      console.error(err);
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>로딩 중...</div>;

  if (isEditing) {
    return (
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#1E3A5F' }}>
          {currentNotice.id ? '공지사항 수정' : '새 공지사항 작성'}
        </h2>
        <input 
          type="text" 
          value={currentNotice.title} 
          onChange={e => setCurrentNotice({...currentNotice, title: e.target.value})} 
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
          placeholder="공지사항 제목"
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer', marginTop: '16px' }}>
          <input 
            type="checkbox" 
            checked={currentNotice.isPinned} 
            onChange={e => setCurrentNotice({...currentNotice, isPinned: e.target.checked})}
          />
          <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: '600' }}>상단 고정 (중요 공지)</span>
        </label>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 16px', background: '#F3F4F6', borderRadius: '8px', width: 'max-content' }}>
            <Paperclip size={16} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4B5563' }}>첨부파일 추가 (최대 10MB)</span>
            <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
          {currentNotice.attachments && currentNotice.attachments.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {currentNotice.attachments.map((att, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#E5E7EB', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>
                  <span style={{ color: '#374151', fontWeight: '500' }}>{att.name}</span>
                  <button onClick={() => {
                    const newAtts = [...currentNotice.attachments!];
                    newAtts.splice(i, 1);
                    setCurrentNotice({...currentNotice, attachments: newAtts});
                  }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#4B5563', padding: 0 }}><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '60px', paddingBottom: '40px' }}>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
            * 내용에 큰 이미지를 직접 붙여넣지 마시고, 가능하면 첨부파일 기능을 이용해주세요.
          </div>
          <ReactQuill 
            theme="snow" 
            value={currentNotice.content} 
            onChange={content => setCurrentNotice({...currentNotice, content})} 
            style={{ height: '300px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => setIsEditing(false)}
            style={{ padding: '10px 20px', background: '#F3F4F6', color: '#4B5563', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            취소
          </button>
          <button 
            onClick={handleSave}
            style={{ padding: '10px 20px', background: '#C8963E', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}
          >
            저장
          </button>
        </div>
      </div>
    );
  }


  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: '1 1 200px', maxWidth: '400px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="공지사항 검색" 
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 16px', background: '#1E3A5F', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            검색
          </button>
        </form>

        {isAdmin && (
          <div style={{ flexShrink: 0 }}>
            <button 
              onClick={() => { setCurrentNotice({ title: '', content: '', isPinned: false, attachments: [] }); setIsEditing(true); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#C8963E', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <Plus size={18} /> 새 공지 작성
            </button>
          </div>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {isMobile ? (
          <div>
            {notices.length === 0 ? (
              <div style={{ padding: '60px', color: '#9CA3AF', textAlign: 'center', fontSize: '14px' }}>등록된 공지사항이 없습니다.</div>
            ) : (
              notices.map((n, i) => (
                <Fragment key={n.id}>
                  <div 
                    onClick={() => handleExpand(n.id)}
                    style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid #E5E7EB', 
                      background: n.isPinned ? '#FFFBEB' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: n.isPinned ? '#D97706' : '#6B7280', fontWeight: n.isPinned ? '800' : '600', fontSize: '13px', minWidth: '24px', textAlign: 'center' }}>
                        {n.isPinned ? '공지' : notices.length - i}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: n.isPinned ? '700' : '600', color: '#111827', flex: 1, lineHeight: '1.4' }}>
                        {n.title}
                        {isNewNotice(n.createdAt) && (
                          <span style={{ marginLeft: '8px', padding: '2px 6px', background: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: '800', borderRadius: '4px', verticalAlign: 'middle', letterSpacing: '0.5px' }}>NEW</span>
                        )}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginLeft: '32px' }}>
                      <span style={{ fontWeight: '500' }}>{n.author}</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>{new Date(n.createdAt).toLocaleDateString().slice(2)}</span>
                        {isAdmin && n.viewCount !== undefined && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F3F4F6', padding: '2px 6px', borderRadius: '12px', fontSize: '11px' }}>
                            <Eye size={10} /> {n.viewCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedId === n.id && (
                    <div style={{ background: '#F8FAFC', padding: '20px 16px', borderBottom: '1px solid #E5E7EB' }}>
                      <div className="ql-editor" style={{ padding: 0, minHeight: '60px', marginBottom: '20px', fontSize: '14px', wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: n.content }} />
                      {n.attachments && n.attachments.length > 0 && (
                        <div style={{ marginTop: '16px', background: '#F3F4F6', padding: '16px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#4B5563', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Paperclip size={14} /> 첨부파일
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {n.attachments.map((att, i) => (
                              <a key={i} href={att.url} download={att.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563EB', textDecoration: 'none', fontSize: '13px', fontWeight: '500', background: '#fff', padding: '10px 16px', borderRadius: '6px', border: '1px solid #E5E7EB', width: 'max-content', maxWidth: '100%' }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {isAdmin && (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                          <button onClick={() => { setCurrentNotice(n); setIsEditing(true); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', border: '1px solid #CBD5E1', color: '#475569', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}><Edit2 size={14} /> 수정</button>
                          <button onClick={() => handleDelete(n.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}><Trash2 size={14} /> 삭제</button>
                        </div>
                      )}
                    </div>
                  )}
                </Fragment>
              ))
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'center', fontSize: '15px' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#4B5563' }}>
                  <th style={{ padding: '16px', width: '80px', fontWeight: '700' }}>번호</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>제목</th>
                  <th style={{ padding: '16px', width: '120px', fontWeight: '700' }}>작성자</th>
                  <th style={{ padding: '16px', width: '140px', fontWeight: '700' }}>작성일</th>
                </tr>
              </thead>
              <tbody>
                {notices.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '60px', color: '#9CA3AF' }}>등록된 공지사항이 없습니다.</td>
                  </tr>
                ) : (
                  notices.map((n, i) => (
                    <Fragment key={n.id}>
                      <tr 
                        onClick={() => handleExpand(n.id)}
                        style={{ 
                          borderBottom: '1px solid #E5E7EB', 
                          cursor: 'pointer', 
                          background: n.isPinned ? '#FFFBEB' : '#fff',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = n.isPinned ? '#FEF3C7' : '#F9FAFB')}
                        onMouseLeave={e => (e.currentTarget.style.background = n.isPinned ? '#FFFBEB' : '#fff')}
                      >
                        <td style={{ padding: '16px', color: n.isPinned ? '#D97706' : '#6B7280', fontWeight: n.isPinned ? '800' : '500' }}>
                          {n.isPinned ? '공지' : notices.length - i}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'left', fontWeight: n.isPinned ? '700' : '500', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {n.isPinned && <Pin size={14} color="#D97706" />}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
                            {isNewNotice(n.createdAt) && (
                              <span style={{ padding: '2px 6px', background: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: '800', borderRadius: '4px', flexShrink: 0, letterSpacing: '0.5px' }}>NEW</span>
                            )}
                          </div>
                          {isAdmin && n.viewCount !== undefined && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#9CA3AF', background: '#F3F4F6', padding: '2px 6px', borderRadius: '12px' }}>
                              <Eye size={12} /> {n.viewCount}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px', color: '#4B5563' }}>{n.author}</td>
                        <td style={{ padding: '16px', color: '#6B7280' }}>{new Date(n.createdAt).toLocaleDateString()}</td>
                      </tr>
                      {expandedId === n.id && (
                        <tr style={{ background: '#F8FAFC' }}>
                          <td colSpan={4} style={{ padding: '24px 32px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>
                            <div className="ql-editor" style={{ padding: 0, minHeight: '100px', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: n.content }} />
                            {n.attachments && n.attachments.length > 0 && (
                              <div style={{ marginTop: '16px', background: '#F3F4F6', padding: '16px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#4B5563', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Paperclip size={14} /> 첨부파일
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {n.attachments.map((att, i) => (
                                    <a key={i} href={att.url} download={att.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563EB', textDecoration: 'none', fontSize: '14px', fontWeight: '500', background: '#fff', padding: '10px 16px', borderRadius: '6px', border: '1px solid #E5E7EB', width: 'max-content' }}>
                                      {att.name}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {isAdmin && (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                                <button onClick={() => { setCurrentNotice(n); setIsEditing(true); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', border: '1px solid #CBD5E1', color: '#475569', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}><Edit2 size={14} /> 수정</button>
                                <button onClick={() => handleDelete(n.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}><Trash2 size={14} /> 삭제</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ display: 'flex', alignItems: 'center', padding: '8px', background: page === 1 ? '#F3F4F6' : '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', color: page === 1 ? '#9CA3AF' : '#4B5563', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#4B5563' }}>
            {page} <span style={{ color: '#9CA3AF', fontWeight: '400' }}>/ {totalPages}</span>
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ display: 'flex', alignItems: 'center', padding: '8px', background: page === totalPages ? '#F3F4F6' : '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', color: page === totalPages ? '#9CA3AF' : '#4B5563', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
