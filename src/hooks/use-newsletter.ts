import { useMutation } from '@tanstack/react-query';
import { subscribeToNewsletter, type NewsletterSource, type NewsletterSubscriptionResult } from '@/lib/newsletter';
import { toast } from 'sonner';
import { tone } from '@/copy/tone';

/**
 * Hook for subscribing to newsletter (mutation)
 */
export function useNewsletter() {
  const mutation = useMutation({
    mutationFn: ({ email, source }: { email: string; source?: NewsletterSource }): Promise<NewsletterSubscriptionResult> => {
      return subscribeToNewsletter(email, source ?? 'footer');
    },
    onSuccess: (result) => {
      if (result.success) {
        const successToast = tone.toast("success", result.message);
        toast.success(successToast.title, {
          description: successToast.description,
        });
      } else {
        const errorToast = tone.toast("error", result.message);
        toast.error(errorToast.title, {
          description: errorToast.description,
        });
      }
    },
    onError: (error) => {
      console.error('Newsletter subscription error:', error);
      const errorToast = tone.toast("error", 'An unexpected error occurred. Please try again later.');
      toast.error(errorToast.title, {
        description: errorToast.description,
      });
    },
  });

  return {
    subscribe: mutation.mutate,
    subscribeAsync: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  };
}

