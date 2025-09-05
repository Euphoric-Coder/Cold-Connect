import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Edit, CheckCircle, Send } from 'lucide-react';
import Button from './Button';

const EmailPreview = ({
  subject,
  content,
  jobTitle = '',
  company = '',
  onEdit,
  recipientEmail,
}) => {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const copyToClipboard = () => {
    const textToCopy = `Subject: ${subject}\n\n${content}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [`Subject: ${subject}\n\n${content}`], 
      {type: 'text/plain'}
    );
    element.href = URL.createObjectURL(file);
    element.download = `cold-email-${company ? company.toLowerCase().replace(/\s+/g, '-') : 'draft'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sendEmail = async () => {
    if (!recipientEmail) return;

    setSending(true);
    setSendError(null);

    try {
      const formData = new FormData();
      formData.append('recipient_email', recipientEmail);
      formData.append('subject', subject);
      formData.append('body', content);

      const response = await fetch('http://localhost:8900/send-email', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Handle success
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      setSendError('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div 
      className="card gradient-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Job/Company Header */}
      {(jobTitle || company) && (
        <div className="border-b border-dark-200 dark:border-dark-700 pb-4 mb-4">
          {jobTitle && <h3 className="text-xl font-semibold">{jobTitle}</h3>}
          {company && <p className="text-dark-600 dark:text-dark-300">{company}</p>}
        </div>
      )}

      {/* Email Content */}
      <div className="space-y-4">
        <div className="bg-dark-50 dark:bg-dark-900 rounded-lg p-4">
          <h4 className="font-medium mb-1">Subject:</h4>
          <p className="font-medium text-primary-500">{subject}</p>
        </div>
        
        <div 
          className="bg-dark-50 dark:bg-dark-900 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Button 
          variant="primary" 
          icon={copied ? CheckCircle : Copy}
          onClick={copyToClipboard}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
        
        <Button 
          variant="secondary" 
          icon={Download}
          onClick={downloadAsText}
        >
          Download
        </Button>

        {recipientEmail && (
          <Button
            variant="primary"
            icon={Send}
            onClick={sendEmail}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Email'}
          </Button>
        )}
        
        {onEdit && (
          <Button 
            variant="outline" 
            icon={Edit}
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
      </div>

      {sendError && (
        <p className="mt-4 text-error-500 text-sm">{sendError}</p>
      )}
    </motion.div>
  );
};

export default EmailPreview;