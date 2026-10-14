import React, { useState, useEffect } from 'react';
import { ActivePanel, Language, ThumbnailItem, ToastNotification } from './types';
import { 
  loadItems, 
  saveItems, 
  DEFAULT_ITEMS, 
  getBookmarks, 
  toggleBookmark, 
  isAdminAuthenticated, 
  setAdminAuthenticated 
} from './utils/storage';
import { translations } from './utils/i18n';
import { Navbar } from './components/Navbar';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginGate } from './components/AdminLoginGate';
import { Toast } from './components/Toast';

export default function App() {
  const [activePanel, setActivePanel] = useState<ActivePanel>('user');
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(isAdminAuthenticated());
  const [items, setItems] = useState<ThumbnailItem[]>(loadItems());
  const [bookmarks, setBookmarks] = useState<string[]>(getBookmarks());
  const [language, setLanguage] = useState<Language>('bn');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const t = translations[language];

  // Toast dispatcher
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  // Admin login handler
  const handleAdminLoginSuccess = () => {
    setIsAdminAuth(true);
    setAdminAuthenticated(true);
    showToast(
      language === 'bn' 
        ? 'অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে!' 
        : 'Welcome to Admin Panel!', 
      'success'
    );
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    setAdminAuthenticated(false);
    setActivePanel('user');
    showToast(
      language === 'bn' 
        ? 'অ্যাডমিন প্যানেল থেকে লগআউট সম্পন্ন হয়েছে।' 
        : 'Logged out from Admin Panel.', 
      'info'
    );
  };

  // Item additions
  const handleAddItem = (
    newItemData: Omit<ThumbnailItem, 'id' | 'downloadsCount' | 'copiesCount' | 'createdAt'>
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newItem: ThumbnailItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
      downloadsCount: 0,
      copiesCount: 0,
      createdAt: today,
    };
    const updated = [newItem, ...items];
    setItems(updated);
    saveItems(updated);
  };

  // Item update
  const handleUpdateItem = (updatedItem: ThumbnailItem) => {
    const updated = items.map((i) => (i.id === updatedItem.id ? updatedItem : i));
    setItems(updated);
    saveItems(updated);
  };

  // Item delete
  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveItems(updated);
  };

  // Restore sample items
  const handleResetDefault = () => {
    if (window.confirm(t.resetConfirm)) {
      setItems(DEFAULT_ITEMS);
      saveItems(DEFAULT_ITEMS);
      showToast(t.resetDone, 'success');
    }
  };

  // Increment download count
  const handleIncrementDownload = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, downloadsCount: (item.downloadsCount || 0) + 1 };
      }
      return item;
    });
    setItems(updated);
    saveItems(updated);
  };

  // Increment copy count
  const handleIncrementCopy = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, copiesCount: (item.copiesCount || 0) + 1 };
      }
      return item;
    });
    setItems(updated);
    saveItems(updated);
  };

  // Toggle bookmark
  const handleToggleBookmark = (id: string) => {
    const updated = toggleBookmark(id);
    setBookmarks(updated);
    const isAdded = updated.includes(id);
    showToast(
      isAdded
        ? (language === 'bn' ? 'সংরক্ষিত তালিকায় যোগ করা হয়েছে!' : 'Saved to bookmarks!')
        : (language === 'bn' ? 'সংরক্ষিত তালিকা থেকে সরানো হয়েছে।' : 'Removed from bookmarks.'),
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Primary Top Bar */}
      <Navbar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        isAdminAuth={isAdminAuth}
        onLogoutAdmin={handleAdminLogout}
        language={language}
        setLanguage={setLanguage}
        totalItems={items.length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activePanel === 'user' ? (
          <UserDashboard
            items={items}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onIncrementDownload={handleIncrementDownload}
            onIncrementCopy={handleIncrementCopy}
            language={language}
            showToast={showToast}
            onNavigateToAdmin={() => setActivePanel('admin')}
          />
        ) : activePanel === 'admin' ? (
          !isAdminAuth ? (
            <AdminLoginGate
              onSuccess={handleAdminLoginSuccess}
              onCancel={() => setActivePanel('user')}
              language={language}
            />
          ) : (
            <AdminDashboard
              items={items}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onResetDefault={handleResetDefault}
              onSwitchToUserPanel={() => setActivePanel('user')}
              language={language}
              showToast={showToast}
            />
          )
        ) : null}
      </main>

      {/* Global Toast Feedback */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Quiet Footer adhering to anti-slop guidelines */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Shamim Hossain</span>
            <span>·</span>
            <span>
              {language === 'bn' 
                ? 'সুরক্ষিত অ্যাডমিন ও উন্মুক্ত ইউজার ড্যাশবোর্ড' 
                : 'Protected Admin & Open User Portal'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === 'user' ? 'admin' : 'user')}
              className="hover:text-white transition-colors"
            >
              {activePanel === 'user' 
                ? (language === 'bn' ? 'অ্যাডমিন মোড' : 'Admin Mode') 
                : (language === 'bn' ? 'ইউজার মোডে যান' : 'Switch to User View')}
            </button>
            <span>·</span>
            <span className="text-slate-600">
              © {new Date().getFullYear()} Shamim Hossain
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
