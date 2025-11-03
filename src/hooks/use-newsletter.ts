import { useMutation } from '@tanstack/react-query';
import { subscribeToNewsletter, type NewsletterSource, type NewsletterSubscriptionResult } from '@/lib/newsletter';
import { toast } from 'sonner';

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
        toast.success(
          result.already_subscribed ? 'Already subscribed' : 'Subscribed!',
          {
            description: result.message,
          }
        );
      } else {
        toast.error('Subscription failed', {
          description: result.message,
        });
      }
    },
    onError: (error) => {
      console.error('Newsletter subscription error:', error);
      toast.error('Error', {
        description: 'An unexpected error occurred. Please try again later.',
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

