import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  User,
  FileText,
  Github,
  Globe,
  CreditCard as Edit3,
  Trash2,
  Eye,
  Copy,
  Download,
  Plus,
  Calendar,
  Building,
  Briefcase,
  Settings,
  Save,
  X,
  Shield,
  CheckCircle,
  Clock,
  Send,
  TrendingUp,
  BarChart3,
  Linkedin,
} from "lucide-react";
import FileUpload from "../Onboarding/FileUpload";
import EmailModal from "./EmailDialog";
import DashboardNavbar from "./DashboardNavbar";
import Button from "../Button";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const DashboardPage = () => {
  const { user } = useUser();
  const userData = useQuery(api.users.getUserByEmail, {
    email: user?.emailAddresses[0]?.emailAddress,
  });
  const emails = useQuery(api.emails.getEmailsByUser, {
    createdBy: user?.emailAddresses[0]?.emailAddress,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState();
  const [editedProfile, setEditedProfile] = useState(profile);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(null);

  useEffect(() => {
    if (userData) {
      console.log("Fetched user details:", userData);
      setProfile(userData);
      setGeneratedEmails(emails);
      console.log("Emails:", emails);
    }
  }, [userData]);

  // Mock data for generated emails with rich text content
  const [generatedEmails, setGeneratedEmails] = useState([]);

  const [openInEditMode, setOpenInEditMode] = useState(false);

  // Calculate dashboard stats
  const stats = {
    totalEmails: generatedEmails.length,
    sentEmails: generatedEmails.filter((email) => email.status === "sent")
      .length,
    draftEmails: generatedEmails.filter((email) => email.status === "draft")
      .length,
    responseRate: 23, // Mock response rate
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setEditedProfile(profile);
  };

  const handleProfileSave = () => {
    setProfile(editedProfile);
    setIsEditingProfile(false);
    // Here you would typically save to backend
  };

  const handleProfileCancel = () => {
    setEditedProfile(profile);
    setIsEditingProfile(false);
  };

  const handleResumeUpload = (file) => {
    setEditedProfile((prev) => ({
      ...prev,
      resume: file,
      resumeName: file.name,
    }));
  };

  const openEmailModal = (email, editMode = false) => {
    setSelectedEmail(email);
    setOpenInEditMode(editMode);
    setIsEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setOpenInEditMode(false);
    setTimeout(() => setSelectedEmail(null), 300);
  };

  const handleEmailSave = (
    id,
    subject,
    content,
    company,
    jobTitle,
    recipientEmail
  ) => {
    setGeneratedEmails((prev) =>
      prev.map((email) =>
        email.id === id
          ? { ...email, subject, content, company, jobTitle, recipientEmail }
          : email
      )
    );
  };

  const copyEmailContent = async (email, event) => {
    event?.stopPropagation();

    try {
      const stripHtml = (html) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
      };

      const htmlContent = `<div><strong>Subject:</strong> ${email.subject}</div><br>${email.content}`;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const plainText = `Subject: ${email.subject}\n\n${stripHtml(email.content)}`;

      const clipboardItem = new ClipboardItem({
        "text/html": blob,
        "text/plain": new Blob([plainText], { type: "text/plain" }),
      });

      await navigator.clipboard.write([clipboardItem]);
      setCopySuccess(email.id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      const stripHtml = (html) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
      };
      const plainText = `Subject: ${email.subject}\n\n${stripHtml(email.content)}`;
      await navigator.clipboard.writeText(plainText);
      setCopySuccess(email.id);
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const downloadEmail = (email, event) => {
    event?.stopPropagation();

    const stripHtml = (html) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    const plainText = `Subject: ${email.subject}\n\n${stripHtml(email.content)}`;
    const element = document.createElement("a");
    const file = new Blob([plainText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${email.company.toLowerCase().replace(/\s+/g, "-")}-cold-email.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRecentEmails = () => {
    return generatedEmails
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  };

  return (
    <>
      <DashboardNavbar userName={profile?.name.split(" ")[0]} />
      <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/30 dark:from-dark-950 dark:via-dark-900 dark:to-primary-950/30">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(92, 150, 219, 0.3) 2px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="font-heading font-bold text-4xl md:text-5xl mb-2 bg-clip-text text-transparent bg-gradient-primary">
                    Dashboard
                  </h1>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => (window.location.href = "/generator")}
                    size="lg"
                  >
                    Generate New Email
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-2 inline-flex shadow-lg border border-dark-100 dark:border-dark-700">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === "overview"
                      ? "bg-gradient-primary text-white shadow-lg transform scale-105"
                      : "text-dark-600 dark:text-dark-300 hover:text-primary-500 hover:bg-dark-50 dark:hover:bg-dark-700"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab("emails")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === "emails"
                      ? "bg-gradient-primary text-white shadow-lg transform scale-105"
                      : "text-dark-600 dark:text-dark-300 hover:text-primary-500 hover:bg-dark-50 dark:hover:bg-dark-700"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Generated Emails</span>
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === "profile"
                      ? "bg-gradient-primary text-white shadow-lg transform scale-105"
                      : "text-dark-600 dark:text-dark-300 hover:text-primary-500 hover:bg-dark-50 dark:hover:bg-dark-700"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile Settings</span>
                </button>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === "overview" ? (
                /* Overview Section */
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.div
                      className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-dark-100 dark:border-dark-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-dark-500 dark:text-dark-400 text-sm font-medium">
                            Total Emails
                          </p>
                          <p className="text-3xl font-bold text-dark-800 dark:text-dark-100">
                            {stats.totalEmails}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-xl">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-dark-100 dark:border-dark-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-dark-500 dark:text-dark-400 text-sm font-medium">
                            Sent Emails
                          </p>
                          <p className="text-3xl font-bold text-dark-800 dark:text-dark-100">
                            {stats.sentEmails}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-success-500 to-success-600 p-3 rounded-xl">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-dark-100 dark:border-dark-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-dark-500 dark:text-dark-400 text-sm font-medium">
                            Draft Emails
                          </p>
                          <p className="text-3xl font-bold text-dark-800 dark:text-dark-100">
                            {stats.draftEmails}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-warning-500 to-warning-600 p-3 rounded-xl">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Emails */}
                    <div className="lg:col-span-2">
                      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-dark-100 dark:border-dark-700 overflow-hidden">
                        <div className="p-6 border-b border-dark-100 dark:border-dark-700">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-dark-800 dark:text-dark-100">
                              Recent Emails
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab("emails")}
                            >
                              View All
                            </Button>
                          </div>
                        </div>
                        <div className="divide-y divide-dark-100 dark:divide-dark-700">
                          {getRecentEmails().map((email, index) => (
                            <motion.div
                              key={email.id}
                              className="p-6 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-grow">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-medium text-dark-800 dark:text-dark-100 line-clamp-1">
                                      {email.subject}
                                    </h4>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        email.status === "sent"
                                          ? "bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                                          : "bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400"
                                      }`}
                                    >
                                      {email.status === "sent"
                                        ? "Sent"
                                        : "Draft"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
                                    <span className="flex items-center gap-1">
                                      <Building className="w-4 h-4" />
                                      {email.company}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {formatDate(email.createdAt)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    icon={
                                      copySuccess === email.id
                                        ? CheckCircle
                                        : Copy
                                    }
                                    onClick={(e) => copyEmailContent(email, e)}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions & Profile Summary */}
                    <div className="space-y-6">
                      {/* Quick Actions */}
                      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-dark-100 dark:border-dark-700 p-6">
                        <h3 className="text-xl font-semibold text-dark-800 dark:text-dark-100 mb-4">
                          Quick Actions
                        </h3>
                        <div className="space-y-3">
                          <Button
                            variant="primary"
                            className="w-full justify-start"
                            icon={Plus}
                            onClick={() =>
                              (window.location.href = "/generator")
                            }
                          >
                            Generate New Email
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            icon={Settings}
                            onClick={() => setActiveTab("profile")}
                          >
                            Update Profile
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            icon={FileText}
                            onClick={() => setActiveTab("profile")}
                          >
                            Upload New Resume
                          </Button>
                        </div>
                      </div>

                      {/* Profile Summary */}
                      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl border border-primary-200 dark:border-primary-800 p-6">
                        <h3 className="text-xl font-semibold text-dark-800 dark:text-dark-100 mb-4">
                          Profile Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-dark-800 dark:text-dark-100">
                                {profile?.name}
                              </p>
                              <p className="text-sm text-dark-500 dark:text-dark-400">
                                {profile?.email}
                              </p>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-primary-200 dark:border-primary-800">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-dark-600 dark:text-dark-300">
                                Profile Completion
                              </span>
                              <span className="font-medium text-primary-600 dark:text-primary-400">
                                85%
                              </span>
                            </div>
                            <div className="mt-2 bg-primary-200 dark:bg-primary-800 rounded-full h-2">
                              <div
                                className="bg-gradient-primary h-2 rounded-full"
                                style={{ width: "85%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === "emails" ? (
                /* Generated Emails Section */
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-dark-800 dark:text-dark-100 mb-2">
                        Your Generated Emails
                      </h2>
                      <p className="text-dark-600 dark:text-dark-300">
                        Manage and track all your cold email campaigns
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      icon={Plus}
                      onClick={() => (window.location.href = "/generator")}
                      size="lg"
                    >
                      Generate New Email
                    </Button>
                  </div>

                  {generatedEmails.length === 0 ? (
                    <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-dark-100 dark:border-dark-700 text-center py-16">
                      <div className="max-w-md mx-auto">
                        <div className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Mail className="w-10 h-10 text-primary-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-dark-800 dark:text-dark-100 mb-3">
                          No emails generated yet
                        </h3>
                        <p className="text-dark-600 dark:text-dark-300 mb-8">
                          Start by generating your first personalized cold email
                          to land your dream job
                        </p>
                        <Button
                          variant="primary"
                          icon={Plus}
                          onClick={() => (window.location.href = "/generator")}
                          size="lg"
                        >
                          Generate Your First Email
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {generatedEmails.map((email, index) => (
                        <motion.div
                          key={email.id}
                          className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-dark-100 dark:border-dark-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-xl font-semibold text-dark-800 dark:text-dark-100">
                                    {email.subject}
                                  </h3>
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      email.status === "sent"
                                        ? "bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                                        : "bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400"
                                    }`}
                                  >
                                    {email.status === "sent" ? "Sent" : "Draft"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-dark-500 dark:text-dark-400 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{email.jobTitle}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    <span>{email.company}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(email.createdAt)}</span>
                                  </div>
                                </div>
                                {email.recipientEmail && (
                                  <div className="flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400 mb-4">
                                    <Mail className="w-4 h-4" />
                                    <span>Sent to: {email.recipientEmail}</span>
                                  </div>
                                )}
                                <div className="bg-dark-50 dark:bg-dark-700 rounded-xl p-4">
                                  <div
                                    className="text-dark-600 dark:text-dark-300 line-clamp-3 prose prose-sm dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        email.content.length > 300
                                          ? email.content.substring(0, 300) +
                                            "..."
                                          : email.content,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-dark-100 dark:border-dark-700">
                              <Button
                                variant="primary"
                                size="sm"
                                icon={Eye}
                                onClick={() => openEmailModal(email)}
                              >
                                View Full Email
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={
                                  copySuccess === email.id ? CheckCircle : Copy
                                }
                                onClick={(e) => copyEmailContent(email, e)}
                              >
                                {copySuccess === email.id ? "Copied!" : "Copy"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={Download}
                                onClick={(e) => downloadEmail(email, e)}
                              >
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={Edit3}
                                onClick={() => openEmailModal(email, true)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={Trash2}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGeneratedEmails((prev) =>
                                    prev.filter((e) => e.id !== email.id)
                                  );
                                }}
                                className="text-error-500 hover:text-error-600 hover:border-error-500 dark:hover:border-error-400"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Profile Settings Section */
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-dark-800 dark:text-dark-100 mb-2">
                        Profile Settings
                      </h2>
                      <p className="text-dark-600 dark:text-dark-300">
                        Manage your personal information and preferences
                      </p>
                    </div>
                    {!isEditingProfile ? (
                      <Button
                        variant="primary"
                        icon={Edit3}
                        onClick={handleProfileEdit}
                        size="lg"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          icon={Save}
                          onClick={handleProfileSave}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          icon={X}
                          onClick={handleProfileCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-8">
                    {/* Account Information */}
                    <motion.div
                      className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-dark-100 dark:border-dark-700 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              Account Information
                            </h3>
                            <p className="text-primary-100">
                              Your verified account details
                            </p>
                          </div>
                          <div className="ml-auto flex items-center bg-white/20 px-3 py-1 rounded-full">
                            <Shield className="w-4 h-4 text-white mr-2" />
                            <span className="text-sm font-medium text-white">
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200 mb-2">
                              Full Name
                            </label>
                            <div className="relative">
                              <User
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500"
                                size={18}
                              />
                              <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-xl text-dark-800 dark:text-dark-200 font-medium cursor-not-allowed"
                                value={profile.name}
                                readOnly
                                disabled
                              />
                            </div>
                            <p className="text-xs text-dark-500 dark:text-dark-400 mt-2">
                              Contact support to change your name
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200 mb-2">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500"
                                size={18}
                              />
                              <input
                                type="email"
                                className="w-full pl-12 pr-4 py-4 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-xl text-dark-800 dark:text-dark-200 font-medium cursor-not-allowed"
                                value={profile.email}
                                readOnly
                                disabled
                              />
                            </div>
                            <p className="text-xs text-dark-500 dark:text-dark-400 mt-2">
                              Contact support to change your email
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Online Presence */}
                    <motion.div
                      className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-dark-100 dark:border-dark-700 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                            <Globe className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              Online Presence
                            </h3>
                            <p className="text-secondary-100">
                              Your professional links and portfolios
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200 mb-2">
                              GitHub Profile
                            </label>
                            <div className="relative">
                              <Github
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500"
                                size={18}
                              />
                              <input
                                type="url"
                                className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                                  isEditingProfile
                                    ? "bg-white dark:bg-dark-900 border-dark-200 dark:border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                                    : "bg-dark-50 dark:bg-dark-700 border-dark-200 dark:border-dark-600 cursor-not-allowed"
                                }`}
                                placeholder="https://github.com/yourusername"
                                value={
                                  isEditingProfile
                                    ? editedProfile.githubUrl
                                    : profile.githubUrl
                                }
                                onChange={(e) =>
                                  setEditedProfile((prev) => ({
                                    ...prev,
                                    githubUrl: e.target.value,
                                  }))
                                }
                                disabled={!isEditingProfile}
                              />
                            </div>
                            <p className="text-xs text-dark-500 dark:text-dark-400 mt-2">
                              Display your repositories and coding activity
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200 mb-2">
                              Portfolio Website
                            </label>
                            <div className="relative">
                              <Globe
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500"
                                size={18}
                              />
                              <input
                                type="url"
                                className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                                  isEditingProfile
                                    ? "bg-white dark:bg-dark-900 border-dark-200 dark:border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                                    : "bg-dark-50 dark:bg-dark-700 border-dark-200 dark:border-dark-600 cursor-not-allowed"
                                }`}
                                placeholder="https://yourportfolio.com"
                                value={
                                  isEditingProfile
                                    ? editedProfile.portfolioUrl
                                    : profile.portfolioUrl
                                }
                                onChange={(e) =>
                                  setEditedProfile((prev) => ({
                                    ...prev,
                                    portfolioUrl: e.target.value,
                                  }))
                                }
                                disabled={!isEditingProfile}
                              />
                            </div>
                            <p className="text-xs text-dark-500 dark:text-dark-400 mt-2">
                              Showcase your complete projects and design skills
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200 mb-2">
                              LinkedIn Profile
                            </label>
                            <div className="relative">
                              <Linkedin
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500"
                                size={18}
                              />
                              <input
                                type="url"
                                className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                                  isEditingProfile
                                    ? "bg-white dark:bg-dark-900 border-dark-200 dark:border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                                    : "bg-dark-50 dark:bg-dark-700 border-dark-200 dark:border-dark-600 cursor-not-allowed"
                                }`}
                                placeholder="https://linkedin.com/in/yourprofile"
                                value={
                                  isEditingProfile
                                    ? editedProfile.linkedinUrl
                                    : profile.linkedinUrl
                                }
                                onChange={(e) =>
                                  setEditedProfile((prev) => ({
                                    ...prev,
                                    linkedinUrl: e.target.value,
                                  }))
                                }
                                disabled={!isEditingProfile}
                              />
                            </div>
                            <p className="text-xs text-dark-500 dark:text-dark-400 mt-2">
                              Professional network and career achievements
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Resume */}
                    <motion.div
                      className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-dark-100 dark:border-dark-700 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              Resume Management
                            </h3>
                            <p className="text-accent-100">
                              Your current resume file for AI personalization
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        {!isEditingProfile ? (
                          <div className="bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 rounded-xl p-6 border border-accent-200 dark:border-accent-800">
                            <div className="flex items-center">
                              <div className="bg-accent-500 p-3 rounded-xl mr-4">
                                <FileText className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-grow">
                                <p className="font-semibold text-accent-800 dark:text-accent-200 text-lg">
                                  {profile.resumeName || "No resume uploaded"}
                                </p>
                                <p className="text-accent-600 dark:text-accent-400">
                                  Last updated: January 15, 2024
                                </p>
                              </div>
                              <div className="flex items-center bg-accent-200 dark:bg-accent-800 px-3 py-1 rounded-full">
                                <CheckCircle className="w-4 h-4 text-accent-600 dark:text-accent-400 mr-2" />
                                <span className="text-sm font-medium text-accent-700 dark:text-accent-300">
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <FileUpload
                              onFileSelect={handleResumeUpload}
                              accept=".pdf"
                              label="Upload new resume (PDF format)"
                            />
                            {profile.resumeName && (
                              <div className="mt-4 p-4 bg-accent-50 dark:bg-accent-900/20 rounded-xl border border-accent-200 dark:border-accent-800">
                                <p className="text-sm text-accent-700 dark:text-accent-300 font-medium">
                                  Current Resume: {profile.resumeName}
                                </p>
                                <p className="text-xs text-accent-600 dark:text-accent-400 mt-1">
                                  Upload a new file to replace the current
                                  resume
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
        email={selectedEmail}
        startInEditMode={openInEditMode}
        onSave={handleEmailSave}
      />
    </>
  );
};

export default DashboardPage;
