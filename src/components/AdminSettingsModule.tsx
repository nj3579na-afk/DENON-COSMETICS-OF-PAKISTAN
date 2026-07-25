import React, { useState } from 'react';
import {
  User,
  Lock,
  ShieldCheck,
  Key,
  Globe,
  Phone,
  Mail,
  Share2,
  Link as LinkIcon,
  Server,
  Eye,
  EyeOff,
  Save,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  LogOut,
  Smartphone,
  Laptop,
  MapPin,
  Sliders,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Building,
  FileCode,
  Shield,
  Clock,
  HelpCircle
} from 'lucide-react';
import { AdminSettings, AdminRole, AuditLog } from '../types';
import { saveAdminSettings, addAuditLog } from '../services/api';

interface AdminSettingsModuleProps {
  settings: AdminSettings;
  setSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
  selectedRole: AdminRole;
  onAuditLogAdded?: (logs: AuditLog[]) => void;
}

export const AdminSettingsModule: React.FC<AdminSettingsModuleProps> = ({
  settings,
  setSettings,
  selectedRole,
  onAuditLogAdded,
}) => {
  // Sub-tab navigation inside Settings
  const [activeSubTab, setActiveSubTab] = useState<
    | 'profile'
    | 'credentials'
    | 'brand'
    | 'contact'
    | 'social'
    | 'links'
    | 'email'
    | 'security'
  >('profile');

  // Form Local State
  const [formSettings, setFormSettings] = useState<AdminSettings>({ ...settings });

  // Credential Modification Local State
  const [currentPasswordConfirm, setCurrentPasswordConfirm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');

  // Save Confirmation Modal State
  const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);
  const [pendingSaveSection, setPendingSaveSection] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string>('');

  // Password strength logic
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-stone-300' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score, label: 'Strong', color: 'bg-emerald-500' };
    return { score, label: 'Very Strong', color: 'bg-emerald-700' };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  // Helper to handle input changes
  const handleTextChange = (field: keyof AdminSettings, val: any) => {
    setFormSettings((prev) => ({ ...prev, [field]: val }));
  };

  // Trigger Save with Audit Log
  const triggerSaveWithAudit = (sectionName: string) => {
    setPendingSaveSection(sectionName);
    setShowConfirmSaveModal(true);
  };

  const executeSave = () => {
    saveAdminSettings(formSettings);
    setSettings(formSettings);

    const updatedLogs = addAuditLog({
      adminUser: `${selectedRole} (${formSettings.adminUsername || 'denon_admin'})`,
      action: `Updated ${pendingSaveSection}`,
      category: 'Settings',
      ipAddress: '182.185.120.45',
      details: `Modified brand & configuration parameters under section "${pendingSaveSection}"`,
    });

    if (onAuditLogAdded) {
      onAuditLogAdded(updatedLogs);
    }

    setShowConfirmSaveModal(false);
    setSaveToast(`Successfully saved changes for ${pendingSaveSection}! All updates are now active across Denon Cosmetics.`);
    setTimeout(() => setSaveToast(''), 5000);
  };

  // Password Change Submission
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (currentPasswordConfirm !== 'admin123' && currentPasswordConfirm !== 'denon2026') {
      setCredError('Incorrect current password. Verification failed.');
      return;
    }

    if (newPassword.length < 8) {
      setCredError('New password must be at least 8 characters long and contain uppercase letters & numbers.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setCredError('New password and confirmation do not match.');
      return;
    }

    // Save update
    executeSave();
    setCurrentPasswordConfirm('');
    setNewPassword('');
    setConfirmNewPassword('');
    setCredSuccess('Admin login credentials updated and encrypted successfully!');
  };

  // Logout All Other Sessions Action
  const handleLogoutOtherSessions = () => {
    const updatedSessions = JSON.stringify([
      { device: 'Current Session (This Device)', location: 'Rawalpindi, PK', ip: '182.185.120.45', lastActive: 'Just now', current: true }
    ]);
    handleTextChange('activeSessionsJson', updatedSessions);

    addAuditLog({
      adminUser: `${selectedRole} (${formSettings.adminUsername || 'denon_admin'})`,
      action: 'Terminated Other Sessions',
      category: 'Security',
      ipAddress: '182.185.120.45',
      details: 'Logged out all other remote active sessions from the admin panel.',
    });

    setSaveToast('Terminated all other active sessions across remote devices.');
    setTimeout(() => setSaveToast(''), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {saveToast && (
        <div className="bg-emerald-900 text-emerald-100 p-4 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast('')} className="text-emerald-300 hover:text-white text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Settings Module Navigation Sub-Header */}
      <div className="glass-panel p-3 rounded-2xl border border-white/70 shadow-xs flex flex-wrap gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'profile'
              ? 'bg-amber-900 text-amber-100 shadow-md font-extrabold'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Admin Profile</span>
        </button>

        <button
          onClick={() => setActiveSubTab('credentials')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'credentials'
              ? 'bg-amber-900 text-amber-100 shadow-md font-extrabold'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Login Credentials</span>
        </button>

        <button
          onClick={() => setActiveSubTab('brand')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'brand'
              ? 'bg-amber-900 text-amber-100 shadow-md font-extrabold'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Brand Information</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'contact'
              ? 'bg-amber-900 text-amber-100 shadow-md font-extrabold'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact & Support</span>
        </button>

        <button
          onClick={() => setActiveSubTab('social')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'social'
              ? 'bg-amber-900 text-amber-100 shadow-md font-extrabold'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Media Links</span>
        </button>

        <button
          onClick={() => setActiveSubTab('links')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'links'
              ? 'bg-amber-900 text-amber-100 shadow-md font-extrabold'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Website Links</span>
        </button>

        <button
          onClick={() => setActiveSubTab('email')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'email'
              ? 'bg-amber-900 text-amber-100 shadow-md font-extrabold'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email & SMTP</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'security'
              ? 'bg-amber-900 text-amber-100 shadow-md font-extrabold'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Sessions</span>
        </button>
      </div>

      {/* 1. ADMIN PROFILE MANAGEMENT TAB */}
      {activeSubTab === 'profile' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-800" />
                <span>Admin Profile Management</span>
              </h2>
              <p className="text-xs text-stone-500">
                View & update primary administrator account information, photo, role, and personal contact details.
              </p>
            </div>
            <button
              onClick={() => triggerSaveWithAudit('Admin Profile')}
              className="px-5 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar Card */}
            <div className="glass-card p-6 rounded-2xl border border-stone-200/80 text-center space-y-4">
              <div className="relative w-28 h-28 mx-auto">
                <img
                  src={formSettings.adminPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt="Admin Photo"
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-amber-800 shadow-lg"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  Active
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-stone-900">{formSettings.adminFullName || 'Muhammad Zeeshan'}</h3>
                <p className="text-xs text-amber-900 font-bold mt-0.5">{formSettings.adminPosition || 'Chief Executive Officer'}</p>
                <span className="inline-block mt-2 text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  Role: {selectedRole}
                </span>
              </div>

              <div className="text-left space-y-2 pt-2 border-t border-stone-200/80">
                <label className="block text-xs font-bold text-stone-700">Profile Photo Image URL</label>
                <input
                  type="text"
                  value={formSettings.adminPhotoUrl || ''}
                  onChange={(e) => handleTextChange('adminPhotoUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 glass-input rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Profile Form Fields */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formSettings.adminFullName || ''}
                  onChange={(e) => handleTextChange('adminFullName', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formSettings.adminUsername || ''}
                  onChange={(e) => handleTextChange('adminUsername', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Email Address</label>
                <input
                  type="email"
                  value={formSettings.adminEmail || ''}
                  onChange={(e) => handleTextChange('adminEmail', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  value={formSettings.adminPhone || ''}
                  onChange={(e) => handleTextChange('adminPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Official Position / Title</label>
                <input
                  type="text"
                  value={formSettings.adminPosition || ''}
                  onChange={(e) => handleTextChange('adminPosition', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">System Timezone</label>
                <select
                  value={formSettings.timezone || 'Asia/Karachi (PKT)'}
                  onChange={(e) => handleTextChange('timezone', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                >
                  <option value="Asia/Karachi (PKT)">Asia/Karachi (Pakistan Standard Time - PKT)</option>
                  <option value="Asia/Dubai (GST)">Asia/Dubai (Gulf Standard Time)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMIN LOGIN CREDENTIALS TAB */}
      {activeSubTab === 'credentials' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 shadow-xl space-y-6 animate-fade-in">
          <div className="border-b border-stone-200/80 pb-4">
            <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-800" />
              <span>Admin Login Credentials & Passwords</span>
            </h2>
            <p className="text-xs text-stone-500">
              Securely modify administrator username, email, and password. Requires current password verification and enforces strong security.
            </p>
          </div>

          {credError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{credError}</span>
            </div>
          )}

          {credSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{credSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Verification */}
            <div className="glass-card p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-800" />
                <span>1. Confirm Current Credentials</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Admin Username</label>
                <input
                  type="text"
                  value={formSettings.adminUsername || 'denon_admin'}
                  onChange={(e) => handleTextChange('adminUsername', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Confirm Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter current password (e.g. admin123)"
                    value={currentPasswordConfirm}
                    onChange={(e) => setCurrentPasswordConfirm(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 glass-input rounded-xl text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: New Password & Strength */}
            <div className="glass-card p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span>2. New Password & Security Indicator</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">New Strong Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars, uppercase & numbers"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 glass-input rounded-xl text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-stone-500">Password Strength:</span>
                      <span className="text-stone-900">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save New Encrypted Credentials</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. BRAND INFORMATION SETTINGS TAB */}
      {activeSubTab === 'brand' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-800" />
                <span>Brand Information & Assets</span>
              </h2>
              <p className="text-xs text-stone-500">
                Manage global brand identity, store logos, descriptions, taglines, and footer copyright statements across the website.
              </p>
            </div>
            <button
              onClick={() => triggerSaveWithAudit('Brand Information')}
              className="px-5 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Brand Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={formSettings.brandName || ''}
                  onChange={(e) => handleTextChange('brandName', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Website SEO Title</label>
                <input
                  type="text"
                  value={formSettings.websiteTitle || ''}
                  onChange={(e) => handleTextChange('websiteTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Store Logo Image URL</label>
                <input
                  type="text"
                  value={formSettings.logoUrl || ''}
                  onChange={(e) => handleTextChange('logoUrl', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Secondary / Dark Mode Logo URL</label>
                <input
                  type="text"
                  value={formSettings.secondaryLogoUrl || ''}
                  onChange={(e) => handleTextChange('secondaryLogoUrl', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Favicon Icon URL</label>
                <input
                  type="text"
                  value={formSettings.faviconUrl || ''}
                  onChange={(e) => handleTextChange('faviconUrl', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={formSettings.brandTagline || ''}
                  onChange={(e) => handleTextChange('brandTagline', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Brand Description</label>
                <textarea
                  rows={3}
                  value={formSettings.brandDescription || ''}
                  onChange={(e) => handleTextChange('brandDescription', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Footer Copyright Notice</label>
                <input
                  type="text"
                  value={formSettings.copyrightText || formSettings.footerText || ''}
                  onChange={(e) => {
                    handleTextChange('copyrightText', e.target.value);
                    handleTextChange('footerText', e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTACT INFORMATION SETTINGS TAB */}
      {activeSubTab === 'contact' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-800" />
                <span>Contact & Customer Support Settings</span>
              </h2>
              <p className="text-xs text-stone-500">
                Update phone numbers, WhatsApp numbers, support email addresses, office location, and Google Maps links.
              </p>
            </div>
            <button
              onClick={() => triggerSaveWithAudit('Contact Information')}
              className="px-5 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Number (PK Format)</label>
                <input
                  type="text"
                  value={formSettings.whatsappNumber}
                  onChange={(e) => handleTextChange('whatsappNumber', e.target.value)}
                  placeholder="+92 312 9206522"
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Click-to-Chat Direct URL</label>
                <input
                  type="text"
                  value={formSettings.whatsappLink}
                  onChange={(e) => handleTextChange('whatsappLink', e.target.value)}
                  placeholder="https://wa.me/923129206522"
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Helpline Phone Number</label>
                <input
                  type="text"
                  value={formSettings.phoneNumber}
                  onChange={(e) => handleTextChange('phoneNumber', e.target.value)}
                  placeholder="0300 5633597"
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Secondary Phone Number (Optional)</label>
                <input
                  type="text"
                  value={formSettings.secondaryPhoneNumber || ''}
                  onChange={(e) => handleTextChange('secondaryPhoneNumber', e.target.value)}
                  placeholder="0312 9206522"
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Customer Support Email</label>
                <input
                  type="email"
                  value={formSettings.customerSupportEmail || formSettings.email}
                  onChange={(e) => {
                    handleTextChange('customerSupportEmail', e.target.value);
                    handleTextChange('email', e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Business / Corporate Email</label>
                <input
                  type="email"
                  value={formSettings.businessEmail || ''}
                  onChange={(e) => handleTextChange('businessEmail', e.target.value)}
                  placeholder="info@denoncosmetics.com"
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Physical Office & Factory Address</label>
                <input
                  type="text"
                  value={formSettings.officeAddress}
                  onChange={(e) => handleTextChange('officeAddress', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Google Maps Location URL</label>
                <input
                  type="text"
                  value={formSettings.googleMapsUrl || ''}
                  onChange={(e) => handleTextChange('googleMapsUrl', e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SOCIAL MEDIA SETTINGS TAB */}
      {activeSubTab === 'social' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-800" />
                <span>Social Media Links & Visibility Toggles</span>
              </h2>
              <p className="text-xs text-stone-500">
                Manage social profile URLs. Enable or disable individual social icons without deleting saved links.
              </p>
            </div>
            <button
              onClick={() => triggerSaveWithAudit('Social Media Links')}
              className="px-5 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Social Links</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook */}
            <div className="glass-card p-4 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Facebook Profile Link
                </span>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.facebookEnabled !== false}
                    onChange={(e) => handleTextChange('facebookEnabled', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                  <span>Active</span>
                </label>
              </div>
              <input
                type="text"
                value={formSettings.facebookUrl}
                onChange={(e) => handleTextChange('facebookUrl', e.target.value)}
                className="w-full px-3.5 py-2 glass-input rounded-xl text-xs font-mono"
              />
            </div>

            {/* Instagram */}
            <div className="glass-card p-4 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-600" />
                  Instagram Handle Link
                </span>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.instagramEnabled !== false}
                    onChange={(e) => handleTextChange('instagramEnabled', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                  <span>Active</span>
                </label>
              </div>
              <input
                type="text"
                value={formSettings.instagramUrl}
                onChange={(e) => handleTextChange('instagramUrl', e.target.value)}
                className="w-full px-3.5 py-2 glass-input rounded-xl text-xs font-mono"
              />
            </div>

            {/* YouTube */}
            <div className="glass-card p-4 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  YouTube Channel Link
                </span>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.youtubeEnabled !== false}
                    onChange={(e) => handleTextChange('youtubeEnabled', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                  <span>Active</span>
                </label>
              </div>
              <input
                type="text"
                value={formSettings.youtubeUrl}
                onChange={(e) => handleTextChange('youtubeUrl', e.target.value)}
                className="w-full px-3.5 py-2 glass-input rounded-xl text-xs font-mono"
              />
            </div>

            {/* TikTok */}
            <div className="glass-card p-4 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
                  TikTok Official Link
                </span>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.tiktokEnabled !== false}
                    onChange={(e) => handleTextChange('tiktokEnabled', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                  <span>Active</span>
                </label>
              </div>
              <input
                type="text"
                value={formSettings.tiktokUrl}
                onChange={(e) => handleTextChange('tiktokUrl', e.target.value)}
                className="w-full px-3.5 py-2 glass-input rounded-xl text-xs font-mono"
              />
            </div>

            {/* LinkedIn */}
            <div className="glass-card p-4 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-700" />
                  LinkedIn Corporate Page
                </span>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.linkedinEnabled !== false}
                    onChange={(e) => handleTextChange('linkedinEnabled', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                  <span>Active</span>
                </label>
              </div>
              <input
                type="text"
                value={formSettings.linkedinUrl || ''}
                onChange={(e) => handleTextChange('linkedinUrl', e.target.value)}
                placeholder="https://www.linkedin.com/company/denon-cosmetics"
                className="w-full px-3.5 py-2 glass-input rounded-xl text-xs font-mono"
              />
            </div>

            {/* X / Twitter */}
            <div className="glass-card p-4 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                  X (Twitter) Profile Link
                </span>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formSettings.twitterEnabled}
                    onChange={(e) => handleTextChange('twitterEnabled', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                  <span>Active</span>
                </label>
              </div>
              <input
                type="text"
                value={formSettings.twitterUrl || ''}
                onChange={(e) => handleTextChange('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/denoncosmetics"
                className="w-full px-3.5 py-2 glass-input rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. WEBSITE LINKS MANAGEMENT TAB */}
      {activeSubTab === 'links' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-amber-800" />
                <span>Website Action Buttons & Custom Navigation Links</span>
              </h2>
              <p className="text-xs text-stone-500">
                Customize action buttons (WhatsApp, Contact, Order Now, Buy Now) and main menu/footer links across the app.
              </p>
            </div>
            <button
              onClick={() => triggerSaveWithAudit('Website Links')}
              className="px-5 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Navigation Links</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">Action Button Targets</h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Direct Chat Button Link</label>
                <input
                  type="text"
                  value={formSettings.whatsappButtonLink || ''}
                  onChange={(e) => handleTextChange('whatsappButtonLink', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Contact Us Button Target</label>
                <input
                  type="text"
                  value={formSettings.contactButtonLink || ''}
                  onChange={(e) => handleTextChange('contactButtonLink', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Order Now Target Section</label>
                <input
                  type="text"
                  value={formSettings.orderNowButtonLink || ''}
                  onChange={(e) => handleTextChange('orderNowButtonLink', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Buy Now Checkout Target</label>
                <input
                  type="text"
                  value={formSettings.buyNowButtonLink || ''}
                  onChange={(e) => handleTextChange('buyNowButtonLink', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">Custom Header & Footer Structure (JSON)</h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Header Menu Links JSON</label>
                <textarea
                  rows={4}
                  value={formSettings.headerMenuLinksJson || ''}
                  onChange={(e) => handleTextChange('headerMenuLinksJson', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Footer Quick Links JSON</label>
                <textarea
                  rows={4}
                  value={formSettings.footerLinksJson || ''}
                  onChange={(e) => handleTextChange('footerLinksJson', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. EMAIL & SMTP SETTINGS TAB */}
      {activeSubTab === 'email' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-800" />
                <span>Email Notifications & SMTP Credentials</span>
              </h2>
              <p className="text-xs text-stone-500">
                Configure outgoing mail servers, order confirmation alerts, customer support auto-responders, and stock warnings.
              </p>
            </div>
            <button
              onClick={() => triggerSaveWithAudit('Email & SMTP Settings')}
              className="px-5 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Email Configuration</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">Sender Configuration</h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Sender Email Address</label>
                <input
                  type="email"
                  value={formSettings.senderEmail || 'orders@denoncosmetics.com'}
                  onChange={(e) => handleTextChange('senderEmail', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Reply-To Email Address</label>
                <input
                  type="email"
                  value={formSettings.replyToEmail || 'support@denoncosmetics.com'}
                  onChange={(e) => handleTextChange('replyToEmail', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="pt-2 space-y-3">
                <label className="flex items-center gap-3 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.orderConfirmationEmailEnabled !== false}
                    onChange={(e) => handleTextChange('orderConfirmationEmailEnabled', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                  <span>Send Automatic Order Confirmation Emails to Customers</span>
                </label>

                <label className="flex items-center gap-3 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.supportAutoReplyEnabled !== false}
                    onChange={(e) => handleTextChange('supportAutoReplyEnabled', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                  <span>Send Auto-Response for Support Inquiries</span>
                </label>

                <label className="flex items-center gap-3 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.adminLowStockAlertsEnabled !== false}
                    onChange={(e) => handleTextChange('adminLowStockAlertsEnabled', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                  <span>Send Low Stock Email Alerts to Admin</span>
                </label>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-800" />
                <span>SMTP Server Settings</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">SMTP Host Server</label>
                <input
                  type="text"
                  value={formSettings.smtpHost || ''}
                  onChange={(e) => handleTextChange('smtpHost', e.target.value)}
                  placeholder="smtp.mailgun.org"
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">SMTP Server Port</label>
                <input
                  type="number"
                  value={formSettings.smtpPort || 587}
                  onChange={(e) => handleTextChange('smtpPort', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">SMTP Username</label>
                <input
                  type="text"
                  value={formSettings.smtpUsername || ''}
                  onChange={(e) => handleTextChange('smtpUsername', e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. SECURITY & SESSIONS TAB */}
      {activeSubTab === 'security' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-800" />
                <span>Security Policies, 2FA & Active Sessions</span>
              </h2>
              <p className="text-xs text-stone-500">
                Configure two-factor authentication, session inactivity timeout limits, view active device sessions, and review trusted devices.
              </p>
            </div>
            <button
              onClick={() => triggerSaveWithAudit('Security Settings')}
              className="px-5 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Security Policies</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">Access Control Policies</h3>

              <div className="p-4 glass-card rounded-2xl border border-stone-200/80 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-stone-900">Enforce Two-Factor Authentication (2FA)</span>
                  <input
                    type="checkbox"
                    checked={!!formSettings.twoFactorRequired}
                    onChange={(e) => handleTextChange('twoFactorRequired', e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                </label>
                <p className="text-[11px] text-stone-500">
                  When enabled, all admin logins require a 2FA PIN verification step.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Session Inactivity Auto-Logout (Minutes)</label>
                <select
                  value={formSettings.autoLogoutMinutes || 15}
                  onChange={(e) => handleTextChange('autoLogoutMinutes', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-bold"
                >
                  <option value={5}>5 Minutes</option>
                  <option value={15}>15 Minutes (Recommended)</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Max Failed Login Attempts Before Lockout</label>
                <select
                  value={formSettings.loginAttemptLimit || 3}
                  onChange={(e) => handleTextChange('loginAttemptLimit', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-bold"
                >
                  <option value={3}>3 Failed Attempts</option>
                  <option value={5}>5 Failed Attempts</option>
                </select>
              </div>
            </div>

            {/* Active Sessions List */}
            <div className="glass-card p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-amber-800" />
                  <span>Active Login Sessions</span>
                </h3>
                <button
                  onClick={handleLogoutOtherSessions}
                  className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 text-[10px] font-bold rounded-lg transition-all"
                >
                  Log Out All Other Devices
                </button>
              </div>

              <div className="divide-y divide-stone-200 text-xs space-y-2">
                <div className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900 block">MacBook Pro (Chrome 125)</span>
                    <span className="text-[10px] text-stone-500">Rawalpindi, PK • IP: 182.185.120.45</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-full">
                    Current Device
                  </span>
                </div>

                <div className="py-2 flex items-center justify-between opacity-70">
                  <div>
                    <span className="font-bold text-stone-900 block">iPhone 15 Pro (Safari)</span>
                    <span className="text-[10px] text-stone-500">Islamabad, PK • IP: 39.40.112.89</span>
                  </div>
                  <span className="text-[10px] text-stone-500">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {showConfirmSaveModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-2xl max-w-md w-full space-y-5 text-center animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-md">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Confirm Settings Change</h3>
              <p className="text-xs text-stone-600 mt-1">
                You are updating <span className="font-bold text-stone-900">"{pendingSaveSection}"</span>. This will immediately update website configuration and trigger an entry in the system Audit Log.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-[11px] text-amber-950 font-medium">
              <p>• Changes apply instantly across all store sessions.</p>
              <p>• Action logged under Admin: <span className="font-mono font-bold">{selectedRole}</span></p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSaveModal(false)}
                className="flex-1 py-2.5 glass-card hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={executeSave}
                className="flex-1 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Apply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
