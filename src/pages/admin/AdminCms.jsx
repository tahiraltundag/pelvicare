import { useEffect, useState, useRef, useMemo } from 'react';
import { Save, Eye, EyeOff, Upload, Type, FileText, Image, List, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/client';

const PHASES_SCHEMA = [
  { key: 'code', label: 'Kod (F1, F2...)', type: 'text' },
  { key: 'name', label: 'Ad', type: 'text' },
  { key: 'duration', label: 'Süre', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
];
const APP_FEATURES_SCHEMA = [
  { key: 'icon', label: 'İkon Adı (Activity/Zap/Waves/Smartphone)', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
];
const PROFILE_SCHEMA = [
  { key: 'icon', label: 'İkon (emoji)', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'modes', label: 'Modlar (örn: K-01)', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
];
const STUDY_SCHEMA = [
  { key: 'modalite', label: 'Modalite', type: 'text' },
  { key: 'endikasyon', label: 'Endikasyon', type: 'text' },
  { key: 'sonuc', label: 'Sonuç', type: 'text' },
  { key: 'kaynak', label: 'Kaynak', type: 'text' },
  { key: 'tag', label: 'Etiket (RCT/Cochrane/Klinik/Meta-Analiz)', type: 'text' },
];
const DIFF_SCHEMA = [
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
];
const REVIEW_SCHEMA = [
  { key: 'name', label: 'İsim', type: 'text' },
  { key: 'location', label: 'Şehir', type: 'text' },
  { key: 'rating', label: 'Puan (1-5)', type: 'number' },
  { key: 'date', label: 'Tarih', type: 'text' },
  { key: 'text', label: 'Yorum', type: 'textarea' },
  { key: 'verified', label: 'Doğrulanmış', type: 'boolean' },
];
const DOWNLOAD_SCHEMA = [
  { key: 'icon', label: 'İkon (emoji)', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
  { key: 'format', label: 'Format (PDF/DOCX)', type: 'text' },
];
const TRUST_BADGE_SCHEMA = [
  { key: 'icon', label: 'İkon (emoji)', type: 'text' },
  { key: 'label', label: 'Başlık', type: 'text' },
  { key: 'sub', label: 'Alt Başlık', type: 'text' },
];
const HOME_STAT_SCHEMA = [
  { key: 'value', label: 'Değer (%95 gibi)', type: 'text' },
  { key: 'label', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'text' },
];
const HOME_STEP_SCHEMA = [
  { key: 'step', label: 'Adım No (01, 02...)', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
];
const HOME_CLINICAL_SCHEMA = [
  { key: 'value', label: 'Değer (%74 gibi)', type: 'text' },
  { key: 'label', label: 'Başlık', type: 'text' },
  { key: 'detail', label: 'Detay', type: 'text' },
  { key: 'source', label: 'Kaynak', type: 'text' },
];
const PACKAGE_SCHEMA = [
  { key: 'id', label: 'ID (pkg-starter / pkg-premium / pkg-pro)', type: 'text' },
  { key: 'name', label: 'Paket Adı', type: 'text' },
  { key: 'icon', label: 'İkon (emoji)', type: 'text' },
  { key: 'variant', label: 'Varyant Açıklaması', type: 'text' },
  { key: 'price', label: 'Fiyat (sadece sayı: 4990)', type: 'number' },
  { key: 'displayPrice', label: 'Gösterim Fiyatı (₺4.990)', type: 'text' },
  { key: 'oldPrice', label: 'Eski Fiyat (yoksa boş bırakın)', type: 'text' },
  { key: 'badge', label: 'Rozet Metni (yoksa boş)', type: 'text' },
  { key: 'features', label: 'Özellikler (her satıra bir tane)', type: 'textarea' },
  { key: 'cta', label: 'Buton Metni', type: 'text' },
  { key: 'highlighted', label: 'Öne Çıkan (vurgulu)', type: 'boolean' },
];
const GUARANTEE_SCHEMA = [
  { key: 'icon', label: 'İkon (emoji)', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'text' },
];
const PRODUCT_FEAT_SCHEMA = [
  { key: 'icon', label: 'İkon (emoji)', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
];
const PAD_SPEC_SCHEMA = [
  { key: 'label', label: 'Özellik Adı', type: 'text' },
  { key: 'value', label: 'Değer', type: 'text' },
];
const ABOUT_VALUE_SCHEMA = [
  { key: 'icon', label: 'İkon (emoji)', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
];
const TEAM_MEM_SCHEMA = [
  { key: 'name', label: 'Ad Soyad', type: 'text' },
  { key: 'role', label: 'Pozisyon/Unvan', type: 'text' },
  { key: 'bg', label: 'Renk (#0d9488 veya #1e3a5f)', type: 'text' },
];
const CERT_SCHEMA = [
  { key: 'title', label: 'Sertifika Adı', type: 'text' },
  { key: 'detail', label: 'Detay', type: 'text' },
];
const ABOUT_ITEM_SCHEMA = [
  { key: 'item', label: 'Madde metni', type: 'text' },
];
const CLINICIAN_EV_SCHEMA = [
  { key: 'title', label: 'Başlık / İstatistik', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
  { key: 'source', label: 'Kaynak (makale)', type: 'text' },
];
const CLINICIAN_STEP_SCHEMA2 = [
  { key: 'step', label: 'Adım No', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
];
const CLINICIAN_DL_SCHEMA = [
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
  { key: 'format', label: 'Format (PDF/FORM)', type: 'text' },
];
const SCIENCE_STAT_SCHEMA = [
  { key: 'value', label: 'Değer (%95 gibi)', type: 'text' },
  { key: 'label', label: 'Etiket', type: 'text' },
];
const HOW_USE_STEP_SCHEMA = [
  { key: 'num', label: 'Numara (01, 02...)', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'desc', label: 'Açıklama', type: 'textarea' },
];

const SECTIONS = [
  {
    title: 'Genel',
    icon: '🌐',
    desc: 'Her sayfada görünen içerikler (footer, duyuru)',
    keys: ['announcement_bar', 'logo_url', 'footer_address', 'footer_phone', 'footer_email'],
  },
  {
    title: 'Ana Sayfa',
    icon: '🏠',
    desc: 'Ana sayfa tüm bölümleri',
    keys: [
      'hero_title', 'hero_subtitle', 'hero_cta', 'hero_image',
      { key: 'home_trust_badges', type: 'json-list', label: 'Güven Rozetleri', itemLabel: 'Rozet', schema: TRUST_BADGE_SCHEMA },
      'home_stats_title', 'home_stats_subtitle',
      { key: 'home_stats_items', type: 'json-list', label: 'İstatistikler', itemLabel: 'İstatistik', schema: HOME_STAT_SCHEMA },
      'home_modalities_title', 'home_modalities_subtitle', 'home_modalities_synergy',
      'home_steps_title', 'home_steps_subtitle',
      { key: 'home_steps_items', type: 'json-list', label: '4 Adım', itemLabel: 'Adım', schema: HOME_STEP_SCHEMA },
      'home_clinical_title', 'home_clinical_subtitle',
      { key: 'home_clinical_results', type: 'json-list', label: 'Klinik Sonuç Kartları', itemLabel: 'Sonuç', schema: HOME_CLINICAL_SCHEMA },
      'home_comparison_title', 'home_comparison_subtitle',
      'home_reviews_title', 'home_reviews_rating', 'home_reviews_count',
      'home_quiz_title', 'home_quiz_subtitle', 'home_quiz_button',
      'home_newsletter_title', 'home_newsletter_subtitle', 'home_newsletter_button',
    ],
  },
  {
    title: 'Ürün Sayfası',
    icon: '📦',
    desc: 'PelviCare cihaz sayfası ve paketler',
    keys: [
      'product_hero_badge', 'product_hero_title', 'product_hero_subtitle', 'product_hero_tagline', 'product_rating_text',
      'product_features_title',
      { key: 'product_features', type: 'json-list', label: 'Ürün Özellikleri', itemLabel: 'Özellik', schema: PRODUCT_FEAT_SCHEMA },
      'product_packages_title', 'product_packages_subtitle',
      { key: 'product_packages', type: 'json-list', label: 'Paket Seçenekleri', itemLabel: 'Paket', schema: PACKAGE_SCHEMA },
      { key: 'product_guarantees', type: 'json-list', label: 'Garanti / Güven Rozetleri', itemLabel: 'Rozet', schema: GUARANTEE_SCHEMA },
      'product_pad_title', 'product_pad_desc', 'product_pad_price',
      { key: 'product_pad_specs', type: 'json-list', label: 'Pad Teknik Detaylar', itemLabel: 'Satır', schema: PAD_SPEC_SCHEMA },
    ],
  },
  {
    title: 'Hakkımızda',
    icon: 'ℹ️',
    desc: 'Şirket, ekip, değerler ve sertifikalar',
    keys: [
      'about_title', 'about_hero_subtitle',
      'about_mission_title', 'about_mission_text1', 'about_mission_text2',
      { key: 'about_mission_items', type: 'json-list', label: 'Misyon Maddeleri', itemLabel: 'Madde', schema: ABOUT_ITEM_SCHEMA },
      'about_values_title',
      { key: 'about_values', type: 'json-list', label: 'Temel Değerler', itemLabel: 'Değer', schema: ABOUT_VALUE_SCHEMA },
      'about_team_title', 'about_team_subtitle',
      { key: 'about_team', type: 'json-list', label: 'Ekip Üyeleri', itemLabel: 'Üye', schema: TEAM_MEM_SCHEMA },
      'about_certs_title',
      { key: 'about_certs', type: 'json-list', label: 'Sertifikalar', itemLabel: 'Sertifika', schema: CERT_SCHEMA },
      'about_founder_name', 'about_founder_role', 'about_founder_quote',
    ],
  },
  {
    title: 'İletişim',
    icon: '📞',
    desc: 'İletişim bilgileri',
    keys: [
      'contact_title', 'contact_subtitle',
      'contact_email', 'contact_clinician_email', 'contact_phone', 'contact_hours', 'contact_address',
    ],
  },
  {
    title: 'Klinisyenler',
    icon: '👨‍⚕️',
    desc: 'Klinisyen sayfası içerikleri',
    keys: [
      'clinician_title',
      'clinician_hero_badge', 'clinician_hero_subtitle', 'clinician_contact_email',
      { key: 'clinician_evidence', type: 'json-list', label: 'Klinik Kanıtlar', itemLabel: 'Kanıt', schema: CLINICIAN_EV_SCHEMA },
      { key: 'clinician_steps', type: 'json-list', label: 'Reçete Adımları', itemLabel: 'Adım', schema: CLINICIAN_STEP_SCHEMA2 },
      { key: 'clinician_downloads', type: 'json-list', label: 'Profesyonel Kaynaklar', itemLabel: 'Belge', schema: CLINICIAN_DL_SCHEMA },
    ],
  },
  {
    title: 'SSS',
    icon: '❓',
    desc: 'Sık sorulan sorular ve kategoriler',
    keys: [
      'faq_hero_title', 'faq_hero_subtitle',
      { key: 'faq_categories', type: 'json-faq', label: 'SSS Kategorileri ve Sorular' },
    ],
  },
  {
    title: 'Nasıl Çalışır',
    icon: '⚙️',
    desc: 'Tedavi fazları ve uygulama özellikleri',
    keys: [
      'how_hero_title', 'how_hero_subtitle',
      'how_steps_title', 'how_steps_subtitle',
      { key: 'how_use_steps', type: 'json-list', label: 'Kullanım Adımları', itemLabel: 'Adım', schema: HOW_USE_STEP_SCHEMA },
      'how_phases_title', 'how_phases_subtitle',
      { key: 'how_phases', type: 'json-list', label: 'Tedavi Fazları', itemLabel: 'Faz', schema: PHASES_SCHEMA },
      'how_app_title',
      { key: 'how_app_features', type: 'json-list', label: 'Uygulama Özellikleri', itemLabel: 'Özellik', schema: APP_FEATURES_SCHEMA },
    ],
  },
  {
    title: 'Kadın Sağlığı',
    icon: '👩',
    desc: 'Kadın sayfası hedef profiller ve bölüm başlıkları',
    keys: [
      'women_hero_title', 'women_hero_subtitle',
      { key: 'women_profiles', type: 'json-list', label: 'Hedef Profiller', itemLabel: 'Profil', schema: PROFILE_SCHEMA },
      'women_modes_title', 'women_modes_subtitle',
      'women_cta_title', 'women_cta_subtitle',
    ],
  },
  {
    title: 'Erkek Sağlığı',
    icon: '👨',
    desc: 'Erkek sayfası hedef profiller ve bölüm başlıkları',
    keys: [
      'men_hero_title', 'men_hero_subtitle',
      { key: 'men_profiles', type: 'json-list', label: 'Hedef Profiller', itemLabel: 'Profil', schema: PROFILE_SCHEMA },
      'men_modes_title', 'men_modes_subtitle',
      'men_cta_title', 'men_cta_subtitle',
    ],
  },
  {
    title: 'Bilim',
    icon: '🔬',
    desc: 'Klinik araştırmalar ve kanıtlar',
    keys: [
      'science_hero_title', 'science_hero_subtitle',
      { key: 'science_hero_stats', type: 'json-list', label: 'Hero İstatistikleri', itemLabel: 'İstatistik', schema: SCIENCE_STAT_SCHEMA },
      { key: 'science_studies', type: 'json-list', label: 'Klinik Çalışmalar', itemLabel: 'Çalışma', schema: STUDY_SCHEMA },
      { key: 'science_differentiators', type: 'json-list', label: 'Farklılaştırıcılar', itemLabel: 'Madde', schema: DIFF_SCHEMA },
    ],
  },
  {
    title: 'Yorumlar',
    icon: '⭐',
    desc: 'Kullanıcı yorumları ve değerlendirmeler',
    keys: [
      'reviews_hero_title',
      { key: 'reviews_items', type: 'json-list', label: 'Yorumlar Listesi', itemLabel: 'Yorum', schema: REVIEW_SCHEMA },
    ],
  },
  {
    title: 'Kaynaklar',
    icon: '📚',
    desc: 'İndirilebilir belgeler ve makaleler',
    keys: [
      'resources_hero_title',
      { key: 'resources_downloads', type: 'json-list', label: 'İndirilebilir Belgeler', itemLabel: 'Belge', schema: DOWNLOAD_SCHEMA },
      { key: 'resources_articles', type: 'json-articles', label: 'Makale Kategorileri' },
    ],
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
        {[{ cmd: 'bold', label: 'B', cls: 'font-bold' }, { cmd: 'italic', label: 'İ', cls: 'italic' }, { cmd: 'underline', label: 'A', cls: 'underline' }].map(btn => (
          <button key={btn.cmd} type="button" onMouseDown={e => { e.preventDefault(); exec(btn.cmd); }}
            className={`w-7 h-7 rounded text-sm hover:bg-gray-200 transition-colors ${btn.cls}`}>{btn.label}</button>
        ))}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}
          className="px-2 h-7 rounded text-xs hover:bg-gray-200 transition-colors">• Liste</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); const url = prompt('Link URL:'); if (url) exec('createLink', url); }}
          className="px-2 h-7 rounded text-xs hover:bg-gray-200 transition-colors">Link</button>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: value }}
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
        className="min-h-[120px] p-3 text-sm text-gray-800 outline-none" />
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
    } catch (err) { alert('Yükleme hatası: ' + err.message); }
    finally { setUploading(false); }
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors"
          placeholder="Görsel URL veya yükle..." value={value} onChange={e => onChange(e.target.value)} />
        <button type="button" onClick={() => inputRef.current?.click()}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm flex items-center gap-1.5 hover:bg-gray-50 transition-colors text-gray-600 flex-shrink-0">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          {uploading ? <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
          Yükle
        </button>
      </div>
      {value && <div className="w-32 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200"><img src={value} alt="preview" className="w-full h-full object-cover" /></div>}
    </div>
  );
}

function ListEditor({ value, onChange, schema, itemLabel = 'Öğe' }) {
  const items = useMemo(() => { try { return JSON.parse(value) || []; } catch { return []; } }, [value]);
  const update = (arr) => onChange(JSON.stringify(arr));
  const addItem = () => {
    const blank = {};
    schema.forEach(f => { blank[f.key] = f.type === 'boolean' ? false : f.type === 'number' ? 0 : ''; });
    update([...items, blank]);
  };
  const removeItem = (i) => update(items.filter((_, idx) => idx !== i));
  const updateField = (i, field, val) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: val };
    update(next);
  };
  const moveItem = (i, dir) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-600">{itemLabel} {i + 1}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"><ChevronUp size={14} /></button>
              <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"><ChevronDown size={14} /></button>
              <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {schema.map(field => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-500 resize-none transition-colors" rows={3}
                    value={item[field.key] || ''} onChange={e => updateField(i, field.key, e.target.value)} />
                ) : field.type === 'boolean' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!item[field.key]} onChange={e => updateField(i, field.key, e.target.checked)} className="w-4 h-4 rounded accent-teal-600" />
                    <span className="text-sm text-gray-600">Evet</span>
                  </label>
                ) : field.type === 'number' ? (
                  <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-500 transition-colors"
                    value={item[field.key] || ''} onChange={e => updateField(i, field.key, Number(e.target.value))} />
                ) : (
                  <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-500 transition-colors"
                    value={item[field.key] || ''} onChange={e => updateField(i, field.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addItem}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2">
        <Plus size={16} /> {itemLabel} Ekle
      </button>
    </div>
  );
}

function FaqEditor({ value, onChange }) {
  const cats = useMemo(() => { try { return JSON.parse(value) || []; } catch { return []; } }, [value]);
  const update = (arr) => onChange(JSON.stringify(arr));
  const [openCat, setOpenCat] = useState(null);

  const addCat = () => update([...cats, { category: 'Yeni Kategori', questions: [] }]);
  const removeCat = (i) => update(cats.filter((_, idx) => idx !== i));
  const updateCatName = (i, name) => { const next = [...cats]; next[i] = { ...next[i], category: name }; update(next); };
  const addQ = (i) => { const next = [...cats]; next[i].questions = [...next[i].questions, { q: '', a: '' }]; update(next); };
  const removeQ = (i, j) => { const next = [...cats]; next[i].questions = next[i].questions.filter((_, idx) => idx !== j); update(next); };
  const updateQ = (i, j, field, val) => { const next = [...cats]; next[i].questions[j] = { ...next[i].questions[j], [field]: val }; update(next); };

  return (
    <div className="space-y-3">
      {cats.map((cat, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
            <button onClick={() => setOpenCat(openCat === i ? null : i)} className="flex-1 flex items-center gap-2 text-left">
              {openCat === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              <input className="flex-1 bg-transparent font-semibold text-sm text-gray-800 outline-none border-b border-transparent focus:border-teal-400"
                value={cat.category} onChange={e => updateCatName(i, e.target.value)} onClick={e => e.stopPropagation()} />
            </button>
            <span className="text-xs text-gray-400">{cat.questions.length} soru</span>
            <button onClick={() => removeCat(i)} className="p-1 rounded hover:bg-red-100 text-red-400 transition-colors"><Trash2 size={14} /></button>
          </div>
          {openCat === i && (
            <div className="p-4 space-y-3">
              {cat.questions.map((qa, j) => (
                <div key={j} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">Soru {j + 1}</span>
                    <button onClick={() => removeQ(i, j)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={12} /></button>
                  </div>
                  <input className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-500 transition-colors"
                    placeholder="Soru" value={qa.q || ''} onChange={e => updateQ(i, j, 'q', e.target.value)} />
                  <textarea className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-500 resize-none transition-colors" rows={3}
                    placeholder="Cevap" value={qa.a || ''} onChange={e => updateQ(i, j, 'a', e.target.value)} />
                </div>
              ))}
              <button onClick={() => addQ(i)} className="w-full border border-dashed border-gray-300 rounded-lg py-2 text-xs text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-1">
                <Plus size={12} /> Soru Ekle
              </button>
            </div>
          )}
        </div>
      ))}
      <button onClick={addCat} className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2">
        <Plus size={16} /> Kategori Ekle
      </button>
    </div>
  );
}

function ArticlesEditor({ value, onChange }) {
  const cats = useMemo(() => { try { return JSON.parse(value) || []; } catch { return []; } }, [value]);
  const update = (arr) => onChange(JSON.stringify(arr));
  const [openCat, setOpenCat] = useState(null);

  const addCat = () => update([...cats, { category: 'Yeni Kategori', items: [] }]);
  const removeCat = (i) => update(cats.filter((_, idx) => idx !== i));
  const updateCatName = (i, name) => { const next = [...cats]; next[i] = { ...next[i], category: name }; update(next); };
  const addItem = (i) => { const next = [...cats]; next[i].items = [...next[i].items, { title: '', date: '', desc: '' }]; update(next); };
  const removeItem = (i, j) => { const next = [...cats]; next[i].items = next[i].items.filter((_, idx) => idx !== j); update(next); };
  const updateItem = (i, j, field, val) => { const next = [...cats]; next[i].items[j] = { ...next[i].items[j], [field]: val }; update(next); };

  return (
    <div className="space-y-3">
      {cats.map((cat, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
            <button onClick={() => setOpenCat(openCat === i ? null : i)} className="flex-1 flex items-center gap-2 text-left">
              {openCat === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              <input className="flex-1 bg-transparent font-semibold text-sm text-gray-800 outline-none border-b border-transparent focus:border-teal-400"
                value={cat.category} onChange={e => updateCatName(i, e.target.value)} onClick={e => e.stopPropagation()} />
            </button>
            <span className="text-xs text-gray-400">{cat.items.length} makale</span>
            <button onClick={() => removeCat(i)} className="p-1 rounded hover:bg-red-100 text-red-400 transition-colors"><Trash2 size={14} /></button>
          </div>
          {openCat === i && (
            <div className="p-4 space-y-3">
              {cat.items.map((item, j) => (
                <div key={j} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">Makale {j + 1}</span>
                    <button onClick={() => removeItem(i, j)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={12} /></button>
                  </div>
                  <input className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-500 transition-colors"
                    placeholder="Başlık" value={item.title || ''} onChange={e => updateItem(i, j, 'title', e.target.value)} />
                  <input className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-500 transition-colors"
                    placeholder="Tarih (örn: Ocak 2026)" value={item.date || ''} onChange={e => updateItem(i, j, 'date', e.target.value)} />
                  <textarea className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-500 resize-none transition-colors" rows={2}
                    placeholder="Açıklama" value={item.desc || ''} onChange={e => updateItem(i, j, 'desc', e.target.value)} />
                </div>
              ))}
              <button onClick={() => addItem(i)} className="w-full border border-dashed border-gray-300 rounded-lg py-2 text-xs text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-1">
                <Plus size={12} /> Makale Ekle
              </button>
            </div>
          )}
        </div>
      ))}
      <button onClick={addCat} className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2">
        <Plus size={16} /> Kategori Ekle
      </button>
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
  const [activeSection, setActiveSection] = useState(SECTIONS[0].title);

  useEffect(() => {
    api.get('/cms').then(res => { if (res.success) setCms(res.data); }).finally(() => setLoading(false));
  }, []);

  const getValue = (key) => key in changes ? changes[key] : (cms[key]?.value || '');
  const setValue = (key, value) => setChanges(prev => ({ ...prev, [key]: value }));
  const hasChanges = Object.keys(changes).length > 0;

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const res = await api.put('/cms', { updates: changes });
      if (!res.success) throw new Error(res.error);
      setCms(res.data); setChanges({});
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert('Kaydetme hatası: ' + err.message); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const typeIcon = (type) => {
    if (type === 'html') return <FileText size={14} className="text-purple-500" />;
    if (type === 'image') return <Image size={14} className="text-blue-500" />;
    if (type?.startsWith('json')) return <List size={14} className="text-orange-500" />;
    return <Type size={14} className="text-gray-400" />;
  };

  const renderField = (keyEntry) => {
    const isObj = typeof keyEntry === 'object';
    const key = isObj ? keyEntry.key : keyEntry;
    const type = isObj ? keyEntry.type : (cms[key]?.type || 'text');
    const label = isObj ? keyEntry.label : (cms[key]?.label || key);
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
        ) : type === 'json-list' ? (
          <ListEditor value={val} onChange={v => setValue(key, v)} schema={keyEntry.schema} itemLabel={keyEntry.itemLabel} />
        ) : type === 'json-faq' ? (
          <FaqEditor value={val} onChange={v => setValue(key, v)} />
        ) : type === 'json-articles' ? (
          <ArticlesEditor value={val} onChange={v => setValue(key, v)} />
        ) : (
          <input
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors"
            value={val} onChange={e => setValue(key, e.target.value)} placeholder={label}
          />
        )}
      </div>
    );
  };

  const currentSection = SECTIONS.find(s => s.title === activeSection) || SECTIONS[0];
  const sectionHasChanges = (section) =>
    section.keys.some(k => {
      const key = typeof k === 'object' ? k.key : k;
      return key in changes;
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İçerik Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kategori seçerek içerikleri düzenleyin</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full font-medium">
              Kaydedilmemiş değişiklikler
            </span>
          )}
          <button onClick={handleSave} disabled={saving || !hasChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition disabled:opacity-60 ${saved ? 'bg-green-500' : 'hover:opacity-90 active:scale-[0.98]'}`}
            style={saved ? {} : { backgroundColor: '#0d9488' }}>
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            {saved ? 'Kaydedildi!' : 'Yayınla'}
          </button>
        </div>
      </div>

      {/* Mobile: yatay scroll sekmeler */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {SECTIONS.map(s => (
          <button
            key={s.title}
            onClick={() => setActiveSection(s.title)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeSection === s.title
                ? 'text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={activeSection === s.title ? { backgroundColor: '#0d9488' } : {}}
          >
            <span>{s.icon}</span>
            {s.title}
            {sectionHasChanges(s) && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />}
          </button>
        ))}
      </div>

      {/* Desktop: iki kolonlu layout */}
      <div className="hidden lg:flex gap-5 items-start">
        {/* Sol: kategori listesi */}
        <aside className="w-56 flex-shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kategoriler</span>
            </div>
            <nav className="p-2 space-y-0.5">
              {SECTIONS.map(s => (
                <button
                  key={s.title}
                  onClick={() => setActiveSection(s.title)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeSection === s.title
                      ? 'text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={activeSection === s.title ? { backgroundColor: '#0d9488' } : {}}
                >
                  <span className="text-base leading-none">{s.icon}</span>
                  <span className="flex-1 truncate">{s.title}</span>
                  {sectionHasChanges(s) && (
                    <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Sağ: seçili kategori alanları */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
              <span className="text-2xl">{currentSection.icon}</span>
              <div>
                <h2 className="font-bold text-gray-900">{currentSection.title}</h2>
                {currentSection.desc && (
                  <p className="text-xs text-gray-500 mt-0.5">{currentSection.desc}</p>
                )}
              </div>
            </div>
            <div className="p-5 space-y-5">
              {currentSection.keys.map(keyEntry => renderField(keyEntry))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: seçili kategori alanları */}
      <div className="lg:hidden">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <span className="text-2xl">{currentSection.icon}</span>
            <div>
              <h2 className="font-bold text-gray-900">{currentSection.title}</h2>
              {currentSection.desc && (
                <p className="text-xs text-gray-500 mt-0.5">{currentSection.desc}</p>
              )}
            </div>
          </div>
          <div className="p-5 space-y-5">
            {currentSection.keys.map(keyEntry => renderField(keyEntry))}
          </div>
        </div>
      </div>
    </div>
  );
}
