import { useEffect, useState, useRef } from 'react';
import { Save, Eye, EyeOff, Upload, Type, FileText, Image } from 'lucide-react';
import api from '../../api/client';

const SECTIONS = [
  {
    title: 'Ana Sayfa',
    keys: ['hero_title', 'hero_subtitle', 'hero_cta', 'hero_image', 'announcement_bar'],
  },
  {
    title: 'Hakkımızda',
    keys: ['about_title', 'about_content'],
  },
  {
    title: 'Klinisyenler',
    keys: ['clinician_title', 'clinician_content'],
  },
  {
    title: 'İletişim',
    keys: ['contact_title', 'contact_subtitle'],
  },
  {
    title: 'Footer',
    keys: ['footer_address', 'footer_phone', 'footer_email'],
  },
  {
    title: 'Marka',
    keys: ['logo_url'],
  },
];

function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current?.innerHTML || '');
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${isFocused ? 'border-teal-500 ring-2 ring-teal-100' : 'border-gray-200'}`}>
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50 flex-wrap">
        {[
          { cmd: 'bold', label: 'B', cls: 'font-bold' },
          { cmd: 'italic', label: 'İ', cls: 'italic' },
          { cmd: 'underline', label: 'A', cls: 'underline' },
        ].map(btn => (
          <button key={btn.cmd} type="button" onMouseDown={e => { e.preventDefault(); exec(btn.cmd); }}
            className={`w-7 h-7 rounded text-sm hover:bg-gray-200 transition-colors ${btn.cls}`}>
            {btn.label}
          </button>
        ))}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}
          className="px-2 h-7 rounded text-xs hover:bg-gray-200 transition-colors">• Liste</button>
        <button type="button" onMouseDown={e => {
          e.preventDefault();
          const url = prompt('Link URL:');
          if (url) exec('createLink', url);
        }} className="px-2 h-7 rounded text-xs hover:bg-gray-200 transition-colors">
          Link
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[120px] p-3 text-sm text-gray-800 outline-none"
      />
    </div>
  );
}

function ImageUploadField({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.upload('/uploads/products', [file]);
      if (res.success) onChange(res.data.urls[0]);
    } catch (err) {
      alert('Yükleme hatası: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors"
          placeholder="Görsel URL veya yükle..."
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <button type="button" onClick={() => inputRef.current?.click()}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm flex items-center gap-1.5 hover:bg-gray-50 transition-colors text-gray-600 flex-shrink-0">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          {uploading ? <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
          Yükle
        </button>
      </div>
      {value && (
        <div className="w-32 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

export default function AdminCms() {
  const [cms, setCms] = useState({});
  const [changes, setChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    api.get('/cms').then(res => {
      if (res.success) setCms(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const getValue = (key) => key in changes ? changes[key] : (cms[key]?.value || '');
  const setValue = (key, value) => setChanges(prev => ({ ...prev, [key]: value }));
  const hasChanges = Object.keys(changes).length > 0;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await api.put('/cms', { updates: changes });
      if (!res.success) throw new Error(res.error);
      setCms(res.data);
      setChanges({});
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Kaydetme hatası: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const typeIcon = (type) => {
    if (type === 'html') return <FileText size={14} className="text-purple-500" />;
    if (type === 'image') return <Image size={14} className="text-blue-500" />;
    return <Type size={14} className="text-gray-400" />;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İçerik Yönetimi (CMS)</h1>
          <p className="text-gray-500 text-sm mt-0.5">Site içeriklerini buradan düzenleyin</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full font-medium">
              Kaydedilmemiş değişiklikler
            </span>
          )}
          <button onClick={() => setPreview(p => !p)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            {preview ? <EyeOff size={16} /> : <Eye size={16} />}
            {preview ? 'Düzenle' : 'Önizleme'}
          </button>
          <button onClick={handleSave} disabled={saving || !hasChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition disabled:opacity-60 ${saved ? 'bg-green-500' : 'hover:opacity-90 active:scale-[0.98]'}`}
            style={saved ? {} : { backgroundColor: '#0d9488' }}>
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            {saved ? 'Kaydedildi!' : 'Yayınla'}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="prose max-w-none space-y-4">
            {SECTIONS.map(section => (
              <div key={section.title}>
                <h3 className="font-bold text-gray-900 border-b pb-2 mb-3">{section.title}</h3>
                <div className="grid gap-3">
                  {section.keys.map(key => {
                    const item = cms[key];
                    const val = getValue(key);
                    return (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-gray-600 mr-2">{item?.label || key}:</span>
                        {item?.type === 'html' ? (
                          <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700" dangerouslySetInnerHTML={{ __html: val || '<em>Boş</em>' }} />
                        ) : item?.type === 'image' ? (
                          val ? <img src={val} alt={key} className="mt-1 max-h-24 rounded-lg" /> : <em className="text-gray-400">Görsel yok</em>
                        ) : (
                          <span className="text-gray-700">{val || <em className="text-gray-400">Boş</em>}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {SECTIONS.map(section => (
            <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="p-5 space-y-5">
                {section.keys.map(key => {
                  const item = cms[key];
                  const type = item?.type || 'text';
                  const label = item?.label || key;
                  const val = getValue(key);
                  const changed = key in changes;

                  return (
                    <div key={key}>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
                        {typeIcon(type)}
                        {label}
                        {changed && <span className="text-orange-500 text-[10px] font-medium">(değiştirildi)</span>}
                      </label>
                      {type === 'html' ? (
                        <RichTextEditor value={val} onChange={v => setValue(key, v)} />
                      ) : type === 'image' ? (
                        <ImageUploadField value={val} onChange={v => setValue(key, v)} />
                      ) : (
                        <input
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors"
                          value={val}
                          onChange={e => setValue(key, e.target.value)}
                          placeholder={label}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
