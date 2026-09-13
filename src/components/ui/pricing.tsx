import NumberFlow from "@number-flow/react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Check, Star, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "@/hooks/use-session";
import { useSubscription } from "@/hooks/use-subscription";
import { analytics } from "@/lib/analytics";
import { type StripeLookupKey } from "@/lib/stripe";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
  /** If true, this is a free plan that doesn't require Stripe */
  isFree?: boolean;
  /** Stripe lookup key for monthly billing */
  stripeLookupKeyMonthly?: StripeLookupKey;
  /** Stripe lookup key for yearly billing */
  stripeLookupKeyYearly?: StripeLookupKey;
  /** If true, this plan requires contacting sales */
  isContactSales?: boolean;
}

export interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [searchParams] = useSearchParams();
  const [isMonthly, setIsMonthly] = useState(searchParams.get('billing') !== 'yearly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  
  const { user, loading: sessionLoading } = useSession();
  const { startCheckoutAsync, isCheckingOut, isActive, subscription } = useSubscription();

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  const handlePlanClick = async (plan: PricingPlan) => {
    // Track analytics
    analytics.track({
      name: 'pricing_plan_clicked',
      properties: {
        plan_name: plan.name,
        billing_period: isMonthly ? 'monthly' : 'yearly',
        is_free: plan.isFree,
        is_contact_sales: plan.isContactSales,
      }
    });

    // Free plan - just navigate to download
    if (plan.isFree) {
      navigate(plan.href);
      return;
    }

    // Contact sales - navigate to contact page
    if (plan.isContactSales) {
      navigate(plan.href);
      return;
    }

    // Paid plan - need to be logged in
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(`/pricing?billing=${isMonthly ? 'monthly' : 'yearly'}`)}`);
      return;
    }

    // User already has active subscription
    if (isActive) {
      navigate('/account');
      return;
    }

    // Get the appropriate lookup key
    const lookupKey = isMonthly 
      ? plan.stripeLookupKeyMonthly 
      : plan.stripeLookupKeyYearly;

    if (!lookupKey) {
      console.error('No lookup key configured for plan:', plan.name);
      return;
    }

    setLoadingPlan(plan.name);

    try {
      const result = await startCheckoutAsync({
        lookupKey,
        successUrl: `${window.location.origin}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing?checkout=cancelled`,
      });

      // If we got a URL, the redirect happens in the mutation
      // If there's an error, it's handled by the mutation's onError
      if (result.error && !result.url) {
        console.error('Checkout failed:', result.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const getButtonText = (plan: PricingPlan) => {
    if (loadingPlan === plan.name || (isCheckingOut && loadingPlan === plan.name)) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing...
        </>
      );
    }

    if (isActive && !plan.isFree && !plan.isContactSales) {
      // Check if this is their current plan
      const currentTier = subscription?.tier;
      if (currentTier === 'professional' && plan.name === 'Pro') {
        return 'Current Plan';
      }
      if (currentTier === 'team' && plan.name === 'Team') {
        return 'Current Plan';
      }
      return 'Manage Subscription';
    }

    if (!user && !plan.isFree && !plan.isContactSales) {
      return 'Sign In to Subscribe';
    }

    return plan.buttonText;
  };

  const isButtonDisabled = (plan: PricingPlan) => {
    if (!plan.isFree && !plan.isContactSales && sessionLoading) return true;
    if (loadingPlan === plan.name) return true;
    if (isCheckingOut) return true;
    
    // Disable if this is their current plan
    if (isActive && !plan.isFree && !plan.isContactSales) {
      const currentTier = subscription?.tier;
      if (currentTier === 'professional' && plan.name === 'Pro') {
        return true;
      }
      if (currentTier === 'team' && plan.name === 'Team') {
        return true;
      }
    }
    
    return false;
  };

  return (
    <div className="container py-8">
      {title && (
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg whitespace-pre-line">
            {description}
          </p>
        </div>
      )}

      <div className="flex justify-center mb-6">
        <label className="relative inline-flex items-center cursor-pointer">
          <Label>
            <Switch
              ref={switchRef}
              aria-label="Annual billing"
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative"
            />
          </Label>
        </label>
        <span className="ml-2 font-semibold">
          Annual billing
        </span>
      </div>

      <div className={`grid grid-cols-1 ${plans.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              `rounded-2xl border-[1px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative`,
              plan.isPopular ? "border-primary border-2" : "border-border",
              "flex flex-col",
              !plan.isPopular && "mt-5",
              index === 0 || index === 2
                ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                : "z-10",
              index === 0 && "origin-right",
              index === 2 && "origin-left"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="text-primary-foreground h-4 w-4 fill-current" aria-hidden="true" />
                <span className="text-primary-foreground ml-1 font-sans font-semibold">
                  Popular
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <p className="text-base font-semibold text-muted-foreground">
                {plan.name}
              </p>
              <div className="mt-6 flex items-center justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    transformTiming={{
                      duration: 500,
                      easing: "ease-out",
                    }}
                    willChange
                    className="font-variant-numeric: tabular-nums"
                  />
                </span>
                {plan.period !== "Next 3 months" && plan.period !== "forever" && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                    / month
                  </span>
                )}
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                {plan.isFree ? "Free forever · No account required" : isMonthly ? `${plan.price} USD billed monthly` : `${Number(plan.yearlyPrice) * 12} USD billed annually`}
              </p>

              <ul className="mt-5 gap-2 flex flex-col">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                    <span className="text-left">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-4" />

              {/* Subscription button */}
              {plan.isFree ? (
                <Link
                  to={plan.href}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                    }),
                    "w-full text-lg font-semibold tracking-tighter"
                  )}
                >
                  {plan.buttonText}
                </Link>
              ) : plan.isContactSales ? (
                <Link
                  to={plan.href}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                    }),
                    "w-full text-lg font-semibold tracking-tighter"
                  )}
                >
                  {plan.buttonText}
                </Link>
              ) : (
                <Link
                  to={user ? "#" : `/login?redirect=/pricing&plan=${plan.name.toLowerCase()}`}
                  onClick={(e) => {
                    if (user || isButtonDisabled(plan)) {
                      e.preventDefault();
                      if (!isButtonDisabled(plan)) {
                        handlePlanClick(plan);
                      }
                    }
                  }}
                  className={cn(
                    // Base button styles
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-180 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-[1px] hover:shadow-soft [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                    // Size
                    "h-11 px-4 py-2 min-h-[44px] w-full text-lg font-semibold tracking-tighter",
                    // Conditional styles based on user state
                    !user && !plan.isFree && !plan.isContactSales 
                      ? "bg-white border-2 border-primary text-black hover:bg-primary hover:text-white" 
                      : buttonVariants({
                          variant: plan.isPopular ? "default" : "outline",
                        }),
                    isButtonDisabled(plan) && "opacity-50 pointer-events-none"
                  )}
                >
                  {getButtonText(plan)}
                </Link>
              )}
              <p className="mt-6 text-xs leading-5 text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
