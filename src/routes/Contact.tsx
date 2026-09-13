import { Mail, Instagram, Send, Clock } from "lucide-react";
import { useState, FormEvent } from "react";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tone } from "@/copy/tone";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { validateEmail, isNonEmpty } from "@/lib/validation";

// Configurable support information
const SUPPORT_CONFIG = {
  email: "support@solun.app",
  responseTime: "We typically respond within 24-48 hours",
  supportHours: "Monday - Friday, 9:00 AM - 5:00 PM (AEST)",
  xHandle: "https://twitter.com/solun",
  instagramHandle: "https://instagram.com/solunapp",
} as const;

// Validation constraints
const MIN_NAME_LENGTH = 2;
const MIN_SUBJECT_LENGTH = 3;
const MIN_MESSAGE_LENGTH = 10;
const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateField = (name: keyof typeof formData, value: string): string | undefined => {
    switch (name) {
      case "name": {
        const nameResult = isNonEmpty(value, "Name");
        if (!nameResult.valid) {
          const nameForm = tone.form('name');
          return nameForm.validation.required;
        }
        if (nameResult.sanitized && nameResult.sanitized.length < MIN_NAME_LENGTH) {
          const nameForm = tone.form('name');
          return nameForm.validation.minLength?.(MIN_NAME_LENGTH);
        }
        if (nameResult.sanitized && nameResult.sanitized.length > MAX_NAME_LENGTH) {
          const nameForm = tone.form('name');
          return nameForm.validation.maxLength?.(MAX_NAME_LENGTH);
        }
        return undefined;
      }
      case "email": {
        const emailResult = validateEmail(value);
        if (!emailResult.valid) {
          const emailForm = tone.form('email');
          // Check if it's a required error or email format error
          if (emailResult.error?.includes('required')) {
            return emailForm.validation.required;
          }
          return emailForm.validation.email;
        }
        return undefined;
      }
      case "subject": {
        const subjectResult = isNonEmpty(value, "Subject");
        if (!subjectResult.valid) {
          const subjectForm = tone.form('subject');
          return subjectForm.validation.required;
        }
        if (subjectResult.sanitized && subjectResult.sanitized.length < MIN_SUBJECT_LENGTH) {
          const subjectForm = tone.form('subject');
          return subjectForm.validation.minLength?.(MIN_SUBJECT_LENGTH);
        }
        if (subjectResult.sanitized && subjectResult.sanitized.length > MAX_SUBJECT_LENGTH) {
          const subjectForm = tone.form('subject');
          return subjectForm.validation.maxLength?.(MAX_SUBJECT_LENGTH);
        }
        return undefined;
      }
      case "message": {
        const messageResult = isNonEmpty(value, "Message");
        if (!messageResult.valid) {
          const messageForm = tone.form('message');
          return messageForm.validation.required;
        }
        if (messageResult.sanitized && messageResult.sanitized.length < MIN_MESSAGE_LENGTH) {
          const messageForm = tone.form('message');
          return messageForm.validation.minLength?.(MIN_MESSAGE_LENGTH);
        }
        if (messageResult.sanitized && messageResult.sanitized.length > MAX_MESSAGE_LENGTH) {
          const messageForm = tone.form('message');
          return messageForm.validation.maxLength?.(MAX_MESSAGE_LENGTH);
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const nameError = validateField("name", formData.name);
    if (nameError) {
      newErrors.name = nameError;
      isValid = false;
    }

    const emailError = validateField("email", formData.email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const subjectError = validateField("subject", formData.subject);
    if (subjectError) {
      newErrors.subject = subjectError;
      isValid = false;
    }

    const messageError = validateField("message", formData.message);
    if (messageError) {
      newErrors.message = messageError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      const errorToast = tone.toast("error", "Let's fix a few things");
      toast({
        title: errorToast.title,
        description: errorToast.description,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize and prepare data
      const nameResult = isNonEmpty(formData.name, "Name");
      const emailResult = validateEmail(formData.email);
      const subjectResult = isNonEmpty(formData.subject, "Subject");
      const messageResult = isNonEmpty(formData.message, "Message");

      if (
        !nameResult.valid ||
        !emailResult.valid ||
        !subjectResult.valid ||
        !messageResult.valid
      ) {
        throw new Error("Invalid form data");
      }

      const { error } = await supabase.from("contact_messages").insert({
        name: nameResult.sanitized!,
        email: emailResult.sanitized!,
        subject: subjectResult.sanitized!,
        message: messageResult.sanitized!,
      });

      if (error) {
        // Don't expose internal error details
        throw new Error("Failed to send message");
      }

      // Success
      const successToast = tone.toast("success", "We'll get back to you soon!");
      toast({
        title: successToast.title,
        description: successToast.description,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      // Sanitized error message - no stack traces
      const errorToast = tone.toast("error", "Please try again or email us directly");
      toast({
        title: errorToast.title,
        description: errorToast.description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Solun</title>
        <meta
          name="description"
          content="Get in touch with the Solun team. We're here to help with questions, support, and feedback about our AI writing workspace."
        />
        <link rel="canonical" href="https://solun.app/contact" />
        <meta property="og:title" content="Contact Us - Solun" />
        <meta
          property="og:description"
          content="Get in touch with the Solun team. We're here to help."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/contact" />
      </Helmet>
      <div className="section">
        <div className="container max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Have a question, feedback, or need support? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your name"
                    disabled={isSubmitting}
                    maxLength={MAX_NAME_LENGTH}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-destructive" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="What's this about?"
                    disabled={isSubmitting}
                    maxLength={MAX_SUBJECT_LENGTH}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="text-sm text-destructive" role="alert">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Tell us more..."
                    disabled={isSubmitting}
                    rows={6}
                    maxLength={MAX_MESSAGE_LENGTH}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-sm text-destructive" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full" aria-label="Send message">
                  {isSubmitting ? (
                    <>
                      <Send className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {tone.cta('contact')}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information & Alternatives */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Other ways to reach us</h2>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                    <Mail className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href={`mailto:${SUPPORT_CONFIG.email}`}
                        className="text-muted-foreground hover:text-foreground transition-colors break-all"
                      >
                        {SUPPORT_CONFIG.email}
                      </a>
                    </div>
                  </div>

                  {/* Social Links */}
                  {SUPPORT_CONFIG.xHandle && (
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                      <svg
                        className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold mb-1">X (Twitter)</h3>
                        <a
                          href={SUPPORT_CONFIG.xHandle}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Follow us on X
                        </a>
                      </div>
                    </div>
                  )}

                  {SUPPORT_CONFIG.instagramHandle && (
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                      <Instagram className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Instagram</h3>
                        <a
                          href={SUPPORT_CONFIG.instagramHandle}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Follow us on Instagram
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Support Information */}
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      {SUPPORT_CONFIG.responseTime}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>Support Hours:</strong> {SUPPORT_CONFIG.supportHours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

