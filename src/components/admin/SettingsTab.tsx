"use client";
import { useEffect, useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Settings {
  productPrices: Record<string, number>;
  shippingFees: Record<string, number>;
  customTextPrice: number;
  discountCodes: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
  }[];
  isOrderingEnabled: boolean;
  maintenanceMode: boolean;
  contactInfo: {
    whatsappNumber: string;
    email: string;
    address: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

export default function SettingsTab() {
  const { formatPrice } = useCurrency();
  const [settings, setSettings] = useState<Settings>({
    productPrices: {},
    shippingFees: {},
    customTextPrice: 15,
    discountCodes: [],
    isOrderingEnabled: true,
    maintenanceMode: false,
    contactInfo: {
      whatsappNumber: '',
      email: '',
      address: '',
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Moroccan cities for shipping
  const moroccanCities = [
    'Tetouan', 'Casablanca', 'Rabat', 'Marrakech', 'Fez', 'Agadir',
    'Tangier', 'Meknes', 'Oujda', 'Kenitra', 'Safi', 'Mohammedia',
    'Khouribga', 'Beni Mellal', 'El Jadida', 'Taza', 'Nador', 'Settat',
    'Larache', 'Ksar El Kebir'
  ];

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();
      
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showNotification('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        showNotification('success', 'Settings saved successfully!');
        setEditMode(false);
      } else {
        throw new Error(result.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('error', 'Failed to save settings: ' + error);
    } finally {
      setSaving(false);
    }
  };

  // Reset to defaults
  const resetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/settings/reset', {
        method: 'POST',
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        await fetchSettings();
        showNotification('success', 'Settings reset to defaults!');
        setEditMode(false);
      } else {
        throw new Error(result.message || 'Failed to reset settings');
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      showNotification('error', 'Failed to reset settings: ' + error);
    } finally {
      setSaving(false);
    }
  };

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Update shipping fee
  const updateShippingFee = (city: string, fee: number) => {
    setSettings(prev => ({
      ...prev,
      shippingFees: {
        ...prev.shippingFees,
        [city]: fee
      }
    }));
  };

  // Add discount code
  const addDiscountCode = () => {
    setSettings(prev => ({
      ...prev,
      discountCodes: [
        ...prev.discountCodes,
        {
          code: '',
          type: 'percentage',
          value: 0,
          isActive: true,
        }
      ]
    }));
  };

  // Update discount code
  const updateDiscountCode = (index: number, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      discountCodes: prev.discountCodes.map((code, i) => 
        i === index ? { ...code, [field]: value } : code
      )
    }));
  };

  // Remove discount code
  const removeDiscountCode = (index: number) => {
    setSettings(prev => ({
      ...prev,
      discountCodes: prev.discountCodes.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-lg font-display font-bold uppercase tracking-tight text-black">
            Loading Settings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 border-6 border-black shadow-brutal max-w-md ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="flex justify-between items-center">
            <div className="font-bold">
              {notification.type === 'success' ? '✅' : '❌'} {notification.message}
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-xl font-bold ml-4"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-black mb-2">
              Settings Management
            </h2>
            <p className="text-lg text-brand-accent font-bold">
              Configure your store settings
            </p>
          </div>
          <div className="flex gap-4">
            {editMode ? (
              <>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    fetchSettings();
                  }}
                  className="btn-brutal bg-gray-500 text-white font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
                >
                  Edit Settings
                </button>
                <button
                  onClick={fetchSettings}
                  className="btn-brutal bg-black text-white font-bold uppercase tracking-wider"
                >
                  Refresh
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Store Configuration */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
          Store Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-3 border-gray-300">
            <div>
              <div className="font-bold text-black">Ordering System</div>
              <div className="text-sm text-gray-500">Allow customers to place orders</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isOrderingEnabled}
                onChange={(e) => editMode && setSettings(prev => ({ ...prev, isOrderingEnabled: e.target.checked }))}
                disabled={!editMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 border-3 border-gray-300">
            <div>
              <div className="font-bold text-black">Maintenance Mode</div>
              <div className="text-sm text-gray-500">Show maintenance page</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => editMode && setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                disabled={!editMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Pricing Settings */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
          Pricing Settings
        </h3>
        
        {/* Custom Text Price */}
        <div className="mb-6">
          <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
            Custom Text Fee ({formatPrice(0).replace(/[0-9.,]/g, '')})
          </label>
          <input
            type="number"
            value={settings.customTextPrice}
            onChange={(e) => editMode && setSettings(prev => ({ ...prev, customTextPrice: parseFloat(e.target.value) || 0 }))}
            disabled={!editMode}
            className="w-full max-w-xs px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
            min="0"
            step="0.01"
          />
          <p className="text-sm text-gray-500 mt-1">Fee added for custom text on products</p>
        </div>

        {/* Shipping Fees */}
        <div>
          <h4 className="text-lg font-bold text-black mb-4">Shipping Fees by City</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moroccanCities.map((city) => (
              <div key={city} className="flex items-center justify-between p-3 bg-gray-50 border-3 border-gray-300">
                <div className="font-bold text-black">{city}</div>
                <div className="flex items-center">
                  <span className="mr-2">{formatPrice(0).replace(/[0-9.,]/g, '')}</span>
                  <input
                    type="number"
                    value={settings.shippingFees[city] || 0}
                    onChange={(e) => editMode && updateShippingFee(city, parseFloat(e.target.value) || 0)}
                    disabled={!editMode}
                    className="w-20 px-2 py-1 border-3 border-gray-300 focus:border-black transition-colors text-center font-body text-black disabled:bg-gray-100"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discount Codes */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black">
            Discount Codes
          </h3>
          {editMode && (
            <button
              onClick={addDiscountCode}
              className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider text-sm"
            >
              Add Code
            </button>
          )}
        </div>
        
        {settings.discountCodes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎫</div>
            <p className="text-brand-accent font-bold">No discount codes yet</p>
            {editMode && (
              <button
                onClick={addDiscountCode}
                className="mt-4 btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
              >
                Add First Code
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {settings.discountCodes.map((code, index) => (
              <div key={index} className="p-4 bg-gray-50 border-3 border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Code
                    </label>
                    <input
                      type="text"
                      value={code.code}
                      onChange={(e) => editMode && updateDiscountCode(index, 'code', e.target.value.toUpperCase())}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
                      placeholder="DISCOUNT10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Type
                    </label>
                    <select
                      value={code.type}
                      onChange={(e) => editMode && updateDiscountCode(index, 'type', e.target.value)}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ({formatPrice(0).replace(/[0-9.,]/g, '')})</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Value
                    </label>
                    <input
                      type="number"
                      value={code.value}
                      onChange={(e) => editMode && updateDiscountCode(index, 'value', parseFloat(e.target.value) || 0)}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={code.isActive}
                        onChange={(e) => editMode && updateDiscountCode(index, 'isActive', e.target.checked)}
                        disabled={!editMode}
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-sm font-bold text-black">Active</span>
                    </div>
                    {editMode && (
                      <button
                        onClick={() => removeDiscountCode(index)}
                        className="px-2 py-1 bg-red-500 text-white font-bold border-3 border-black text-sm"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={settings.contactInfo.whatsappNumber}
              onChange={(e) => editMode && setSettings(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, whatsappNumber: e.target.value }
              }))}
              disabled={!editMode}
              className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
              placeholder="+212 6XX XXX XXX"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={settings.contactInfo.email}
              onChange={(e) => editMode && setSettings(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, email: e.target.value }
              }))}
              disabled={!editMode}
              className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
              placeholder="contact@ensaoffline.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Physical Address
            </label>
            <input
              type="text"
              value={settings.contactInfo.address}
              onChange={(e) => editMode && setSettings(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, address: e.target.value }
              }))}
              disabled={!editMode}
              className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
              placeholder="Tetouan, Morocco"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Instagram Handle
            </label>
            <input
              type="text"
              value={settings.socialMedia.instagram}
              onChange={(e) => editMode && setSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, instagram: e.target.value }
              }))}
              disabled={!editMode}
              className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
              placeholder="@ensaoffline"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Facebook Page
            </label>
            <input
              type="text"
              value={settings.socialMedia.facebook}
              onChange={(e) => editMode && setSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, facebook: e.target.value }
              }))}
              disabled={!editMode}
              className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
              placeholder="ENSA OFFLINE"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Twitter Handle
            </label>
            <input
              type="text"
              value={settings.socialMedia.twitter}
              onChange={(e) => editMode && setSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, twitter: e.target.value }
              }))}
              disabled={!editMode}
              className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black disabled:bg-gray-100"
              placeholder="@ensaoffline"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-6 border-red-500 shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight text-red-700 mb-4">
          Danger Zone
        </h3>
        <p className="text-red-600 mb-4">
          These actions cannot be undone. Please be very careful.
        </p>
        <button
          onClick={resetSettings}
          disabled={saving}
          className="btn-brutal bg-red-500 text-white font-bold uppercase tracking-wider"
        >
          Reset All Settings
        </button>
      </div>
    </div>
  );
}
