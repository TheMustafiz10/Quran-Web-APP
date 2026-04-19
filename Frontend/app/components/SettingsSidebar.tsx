'use client';

type Settings = {
  theme: string;
  arabicFont: string;
  arabicFontSize: string;
  translationFontSize: string;
  language: string;
};

export default function SettingsSidebar({
  settings,
  updateSettings,
  onClose,
}: {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  onClose: () => void;
}) {

  const handleThemeChange = () => {
    updateSettings({ 
      theme: settings.theme === 'light' ? 'dark' : 'light' 
    });
  };

  const handleFontSizeChange = (size: string) => {
    updateSettings({
      arabicFontSize: size,
    });
  };

  const handleLanguageChange = (lang: string) => {
    updateSettings({ language: lang });
  };

  const handleArabicFontChange = (font: string) => {
    updateSettings({ arabicFont: font });
  };

  const handleTranslationSizeChange = (size: string) => {
    updateSettings({ translationFontSize: size });
  };

  return (
    <aside className="sidebar settings-sidebar">
      <div className="sidebar-header">
        <h3>Settings</h3>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="settings-group">
        <label>Theme</label>
        <button 
          type="button"
          className={`setting-button ${settings.theme === 'light' ? 'active' : ''}`}
          onClick={handleThemeChange}
        >
          {settings.theme === 'light' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="settings-group">
        <label>Arabic Font</label>
        <div className="font-choice-controls">
          <button
            type="button"
            className={`setting-button ${settings.arabicFont === 'amiri' ? 'active' : ''}`}
            onClick={() => handleArabicFontChange('amiri')}
          >
            Amiri
          </button>
          <button
            type="button"
            className={`setting-button ${settings.arabicFont === 'naskh' ? 'active' : ''}`}
            onClick={() => handleArabicFontChange('naskh')}
          >
            Noto Naskh Arabic
          </button>
        </div>
      </div>

      <div className="settings-group">
        <label>Arabic Font Size</label>
        <div className="font-size-controls">
          {['small', 'medium', 'large'].map((size) => (
            <button
              type="button"
              key={size}
              className={`size-button ${settings.arabicFontSize === size ? 'active' : ''}`}
              onClick={() => handleFontSizeChange(size)}
            >
              {size.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-group">
        <label>Translation Font Size</label>
        <div className="font-size-controls">
          {['small', 'medium', 'large'].map((size) => (
            <button
              type="button"
              key={size}
              className={`size-button ${settings.translationFontSize === size ? 'active' : ''}`}
              onClick={() => handleTranslationSizeChange(size)}
            >
              {size.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-group">
        <label>Language</label>
        <select 
          value={settings.language} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="language-select"
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="ur">اردو</option>
        </select>
      </div>
    </aside>
  );
}
