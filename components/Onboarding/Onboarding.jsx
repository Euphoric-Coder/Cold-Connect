import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Github,
  FileText,
  CheckCircle,
  Globe,
  Shield,
  Linkedin,
  AlertTriangle,
  X,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Button from "../../components/Button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FileUpload from "../../components/FileUpload";
import { useUser } from "@clerk/nextjs";

const OnboardingPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    githubUrl: "",
    portfolioUrl: "",
    linkedinUrl: "",
    resume: null,
  });
  const [errors, setErrors] = useState({});
  const [showRestoreAlert, setShowRestoreAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateUser = useMutation(api.users.updateUser);
  const deleteFile = useMutation(api.resumeDelete.deleteById);
  const status = useQuery(api.users.onboardingStatus, {
    email: user?.emailAddresses[0]?.emailAddress,
  });

  useEffect(() => {
    if (!user?.id) return;

    const key = `onboardingFormData_${user.id}`;
    const savedData = localStorage.getItem(key);

    if (savedData) {
      const parsedData = JSON.parse(savedData);

      // Default Form
      const defaultForm = {
        name: user?.fullName,
        email: user?.emailAddresses[0]?.emailAddress,
        githubUrl: "",
        portfolioUrl: "",
        linkedinUrl: "",
        resume: null,
      };

      // Check if saved data differs from the default form
      const isDifferent = Object.keys(defaultForm).some(
        (key) =>
          parsedData[key] !== null &&
          parsedData[key] !== "" &&
          JSON.stringify(parsedData[key]) !== JSON.stringify(defaultForm[key])
      );

      if (isDifferent) {
        setShowRestoreAlert(true);
        setFormData(parsedData);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    const key = `onboardingFormData_${user.id}`;
    localStorage.setItem(key, JSON.stringify(formData));
  }, [formData, user]);

  useEffect(() => {
    if (user && !formData.name && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [user]);

  const validateGithubUrl = (url) => {
    if (!url) return true;
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
    return githubRegex.test(url);
  };

  const validatePortfolioUrl = (url) => {
    if (!url) return true;
    const urlRegex =
      /^https?:\/\/(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\/?.*$/;
    return urlRegex.test(url);
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.githubUrl && !validateGithubUrl(formData.githubUrl)) {
      newErrors.githubUrl = "Please enter a valid GitHub URL";
    }

    if (formData.portfolioUrl && !validatePortfolioUrl(formData.portfolioUrl)) {
      newErrors.portfolioUrl = "Please enter a valid portfolio URL";
    }

    if (!formData.resume) {
      newErrors.resume = "Resume is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleResumeUpload = (fileData) => {
    setFormData((prev) => ({ ...prev, resume: fileData }));
    if (errors.resume) {
      setErrors((prev) => ({ ...prev, resume: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      //   await updateUser({
      //     name: formData.name,
      //     email: formData.email,
      //     githubURL: formData.githubUrl,
      //     resumeURL: formData.resume.fileURL, // from uploaded file
      //     hasOnboarded: true,
      //   });

      console.log({
        name: formData.name,
        email: formData.email,
        githubURL: formData.githubUrl,
        resumeURL: formData.resume.fileURL, // from uploaded file
        portfolioUrl: formData.portfolioUrl,
        hasOnboarded: true,
      });

      // router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSavedData = async () => {
    if (!user?.id) return;
    if (formData.resume) {
      await deleteFile({ storageId: formData.resume.storageId });
    }
    const key = `onboardingFormData_${user.id}`;
    localStorage.removeItem(key);
    setShowRestoreAlert(false);
  };

  if (status === true) {
    return <div>Please complete the onboarding process.</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-white to-secondary-50/30 dark:from-primary-950/30 dark:via-dark-900 dark:to-secondary-950/30 pt-24 pb-16">
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

      {showRestoreAlert && (
        <div className="container mx-auto -mt-20">
          <Alert
            variant="warning"
            className="mt-5 mb-5 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border border-yellow-400 dark:border-gray-600 shadow-lg p-4 rounded-3xl flex items-center hover:shadow-xl"
          >
            {/* Content that grows to fill space */}
            <div className="flex flex-col gap-2 flex-grow">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-yellow-700 text-sm md:text-lg dark:text-yellow-300 font-bold">
                  Pending Onboarding - {user?.fullName}
                </AlertTitle>
              </div>
              <div className="flex items-center gap-2">
                <AlertDescription className="w-full">
                  <div
                    className="rounded-xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10 
                       px-4 py-3 text-sm sm:text-base text-justify leading-relaxed text-yellow-800 dark:text-yellow-200 
                       shadow-sm transition-all"
                  >
                    <p className="text-wrap break-words">
                      It looks like you haven&apos;t already completed the
                      onboarding process. Would you like to continue?
                    </p>
                  </div>
                </AlertDescription>
                {/* Button on the right */}
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="accept hover:bg-green-300 hover:text-green-700 dark:hover:text-green-400 [&_svg]:size-6"
                    onClick={() => setShowRestoreAlert(false)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="del3 hover:bg-red-300 hover:text-red-500 border-red-400 dark:border-red-600 [&_svg]:size-6"
                    onClick={clearSavedData}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-primary">
              ColdConnect
            </span>
          </h1>
          <p className="text-dark-600 dark:text-dark-300 text-lg max-w-2xl mx-auto">
            Let's set up your profile to create compelling, personalized cold
            emails that get responses
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-dark-100 dark:border-dark-700 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Account Information Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-800 dark:text-dark-100">
                      Account Information
                    </h2>
                    <p className="text-dark-600 dark:text-dark-300">
                      Your verified account details
                    </p>
                  </div>
                  <div className="ml-auto flex items-center bg-success-50 dark:bg-success-900/20 px-3 py-1 rounded-full">
                    <Shield className="w-4 h-4 text-success-600 dark:text-success-400 mr-2" />
                    <span className="text-sm font-medium text-success-700 dark:text-success-300">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200">
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
                        value={formData.name}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200">
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
                        value={formData.email}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dark-200 dark:border-dark-700"></div>

              {/* Online Presence Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-800 dark:text-dark-100">
                      Online Presence
                    </h2>
                    <p className="text-dark-600 dark:text-dark-300">
                      Showcase your work and projects{" "}
                      <span className="text-dark-500">(Optional)</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200">
                      GitHub Profile
                    </label>
                    <div className="relative">
                      <Github
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500"
                        size={18}
                      />
                      <input
                        type="url"
                        className={`w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-900 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                          errors.githubUrl
                            ? "border-error-500 focus:ring-error-400"
                            : "border-dark-200 dark:border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                        }`}
                        placeholder="https://github.com/yourusername"
                        value={formData.githubUrl}
                        onChange={(e) =>
                          handleInputChange("githubUrl", e.target.value)
                        }
                      />
                    </div>
                    {errors.githubUrl && (
                      <p className="text-sm text-error-500">
                        {errors.githubUrl}
                      </p>
                    )}
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      Display your repositories and coding activity
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200">
                      Portfolio Website
                    </label>
                    <div className="relative">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500"
                        size={18}
                      />
                      <input
                        type="url"
                        className={`w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-900 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                          errors.portfolioUrl
                            ? "border-error-500 focus:ring-error-400"
                            : "border-dark-200 dark:border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                        }`}
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolioUrl}
                        onChange={(e) =>
                          handleInputChange("portfolioUrl", e.target.value)
                        }
                      />
                    </div>
                    {errors.portfolioUrl && (
                      <p className="text-sm text-error-500">
                        {errors.portfolioUrl}
                      </p>
                    )}
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      Showcase your complete projects and design skills
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <Linkedin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500"
                        size={18}
                      />
                      <input
                        type="url"
                        className={`w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-900 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                          errors.linkedinUrl
                            ? "border-error-500 focus:ring-error-400"
                            : "border-dark-200 dark:border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                        }`}
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedinUrl}
                        onChange={(e) =>
                          handleInputChange("linkedinUrl", e.target.value)
                        }
                      />
                    </div>
                    {errors.linkedinUrl && (
                      <p className="text-sm text-error-500">
                        {errors.linkedinUrl}
                      </p>
                    )}
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      Professional network and career achievements
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dark-200 dark:border-dark-700"></div>

              {/* Resume Upload Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-800 dark:text-dark-100">
                      Resume Upload
                    </h2>
                    <p className="text-dark-600 dark:text-dark-300">
                      Upload your resume for AI-powered personalization{" "}
                      <span className="text-error-500 font-medium">
                        *Required
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <FileUpload
                    onFileSelect={handleResumeUpload}
                    createdBy={formData.email}
                    accept=".pdf"
                    label="Upload your resume (PDF format)"
                  />

                  {errors.resume && (
                    <p className="mt-3 text-sm text-error-500">
                      {errors.resume}
                    </p>
                  )}
                  <div className="mt-4 bg-accent-50 dark:bg-accent-900/10 rounded-xl p-4">
                    <h4 className="font-semibold text-accent-700 dark:text-accent-300 mb-2">
                      What we'll extract from your resume:
                    </h4>
                    <ul className="text-sm text-accent-600 dark:text-accent-400 space-y-1">
                      <li>• Key skills and technical expertise</li>
                      <li>• Professional experience and achievements</li>
                      <li>• Education and certifications</li>
                      <li>• Industry-specific keywords for job matching</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting || !formData.resume}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Setting up your profile...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className="w-5 h-5" />
                      <span>Complete Setup & Start Generating Emails</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-dark-500 dark:text-dark-400 text-sm">
            Your information is secure and will only be used to personalize your
            cold emails
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPage;
