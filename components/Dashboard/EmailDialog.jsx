import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Edit3, Save, CheckCircle, Building, Briefcase, Mail } from 'lucide-react';
import Button from '../Button';
import RichTextEditor from './RichTextEditor';

const EmailModal = ({ isOpen, onClose, email, startInEditMode = false, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedCompany, setEditedCompany] = useState('');
  const [editedJobTitle, setEditedJobTitle] = useState('');
  const [editedRecipientEmail, setEditedRecipientEmail] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (email) {
      setEditedSubject(email.subject);
      setEditedContent(email.content);
      setEditedCompany(email.company);
      setEditedJobTitle(email.jobTitle);
      setEditedRecipientEmail(email.recipientEmail || '');
      setIsEditing(startInEditMode);
    }
  }, [email, startInEditMode]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (email && onSave) {
      onSave(email.id, editedSubject, editedContent, editedCompany, editedJobTitle, editedRecipientEmail);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (email) {
      setEditedSubject(email.subject);
      setEditedContent(email.content);
      setEditedCompany(email.company);
      setEditedJobTitle(email.jobTitle);
      setEditedRecipientEmail(email.recipientEmail || '');
    }
    setIsEditing(false);
  };

  const copyAsRichText = async () => {
    if (!email) return;

    try {
      const htmlContent = `<div><strong>Subject:</strong> ${editedSubject}</div><br>${editedContent}`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const plainText = `Subject: ${editedSubject}\n\n${stripHtml(editedContent)}`;

      const clipboardItem = new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
      });

      await navigator.clipboard.write([clipboardItem]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      const plainText = `Subject: ${editedSubject}\n\n${stripHtml(editedContent)}`;
      await navigator.clipboard.writeText(plainText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const downloadEmail = () => {
    if (!email) return;

    const plainText = `Subject: ${editedSubject}\n\n${stripHtml(editedContent)}`;
    const element = document.createElement('a');
    const file = new Blob([plainText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${email.company.toLowerCase().replace(/\s+/g, '-')}-cold-email.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!email) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto border border-dark-200 dark:border-dark-700"
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 flex items-center justify-between">
                <div className="flex-grow pr-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-xl font-semibold"
                      placeholder="Email Subject"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white">{editedSubject}</h2>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
                {isEditing && (
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                        <Building size={16} className="text-primary-500" />
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={editedCompany}
                        onChange={(e) => setEditedCompany(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg text-dark-800 dark:text-dark-100 placeholder-dark-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="e.g., TechCorp"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                        <Briefcase size={16} className="text-primary-500" />
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={editedJobTitle}
                        onChange={(e) => setEditedJobTitle(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg text-dark-800 dark:text-dark-100 placeholder-dark-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="e.g., Senior Developer"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                        <Mail size={16} className="text-primary-500" />
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        value={editedRecipientEmail}
                        onChange={(e) => setEditedRecipientEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg text-dark-800 dark:text-dark-100 placeholder-dark-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="e.g., hiring@company.com"
                      />
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="mb-6 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <Building size={16} className="text-primary-600 dark:text-primary-400" />
                      <span className="text-dark-700 dark:text-dark-300">{editedCompany}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <Briefcase size={16} className="text-primary-600 dark:text-primary-400" />
                      <span className="text-dark-700 dark:text-dark-300">{editedJobTitle}</span>
                    </div>
                    {editedRecipientEmail && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <Mail size={16} className="text-primary-600 dark:text-primary-400" />
                        <span className="text-dark-700 dark:text-dark-300">{editedRecipientEmail}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-dark-50 dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-700 overflow-hidden">
                  <RichTextEditor
                    content={editedContent}
                    onChange={setEditedContent}
                    editable={isEditing}
                  />
                </div>
              </div>

              <div className="border-t border-dark-200 dark:border-dark-700 p-6 bg-dark-50 dark:bg-dark-900 flex flex-wrap gap-3">
                {isEditing ? (
                  <>
                    <Button
                      variant="primary"
                      icon={Save}
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      icon={copySuccess ? CheckCircle : Copy}
                      onClick={copyAsRichText}
                    >
                      {copySuccess ? 'Copied!' : 'Copy Rich Text'}
                    </Button>
                    <Button
                      variant="outline"
                      icon={Edit3}
                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      icon={Download}
                      onClick={downloadEmail}
                    >
                      Download
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmailModal;
