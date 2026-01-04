// We could over here use confirm-modal as well, which was used with the help of certain triggers in Actions.tsx
// But this is going to be called and used diffrently as because it is going to work according to the "zustand store" that has been created as a modal functionality.
// This zustand is going to be programatically be opened depending upon the needs.
"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import { useAction } from "convex/react";
import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useProModal } from "@/store/use-pro-modals";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();

  // Define the action for processing payments
  const pay = useAction(api.stripe.pay);

  // State to manage the pending status of the payment process
  const [pending, setPending] = useState(false);

  // Get the current organization context
  const { organization } = useOrganization();

  // Function to handle the click event for upgrading to pro features
  const onClick = async () => {
    // If organization ID is not available, exit the function
    if (!organization?.id) return;

    // Set pending to true to disable the upgrade button during payment processing
    setPending(true);

    try {
      // Call the pay action with the organization ID and get the redirect URL
      const redirectUrl = await pay({ orgId: organization.id });

      // Redirect the user to the payment page
      window.location.href = redirectUrl;
    } finally {
      // Reset the pending state to re-enable the upgrade button
      setPending(false);
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[540px] p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image
            src="/pro.svg"
            alt="Pro Modal"
            className="object-fit"
            width={
              310
            }
            height={
              310
            }
          />
        </div>
        <div className={cn(
          "text-neutral-400 mx-auto space-y-6 p-6",
          font.className,
        )}>
          <h2 className="font-medium text-lg">
            Upgrade to the Pro Plan to access this feature.🚀
          </h2>

          <div className="pl-3">
            <ul className="text-[11px] space-y-1 list-disc">
              <li>Unlimited Boards</li>
              <li>Unlimited Organization</li>
              <li>Unlimited Tools</li>
              <li>Unlimited Members</li>
            </ul>
          </div>
          <Button
            onClick={onClick}
            disabled={pending}
            size="sm"
            className="w-full"
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// If we directly use our Modal "here: "RenameModal" " directly in the root layout

// In Next.js when we use programitic control of our modals using something like zustand.
// That can create hydration errors.

// So we would be understanding a practice of of creating a provider something like a modal provider: that would help us get over these Hydration errors and that would help us in not writing same piece of code again and again.
