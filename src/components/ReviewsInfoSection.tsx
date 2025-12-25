'use client';

import React from 'react';

export type ReviewsInfoSectionProps = {
  userName: string;
  reviewCount: number;
};

export default function ReviewsInfoSection({ userName, reviewCount }: ReviewsInfoSectionProps) {
  const modalId = `reviews-info-${userName}`;

  return (
    <>
      <div
        className="font-semibold no-hover"
        onClick={() => (document.getElementById(modalId) as HTMLDialogElement)?.showModal()}
      >
        {reviewCount}
      </div>
      <div className="text-md text-base-content/70">Reviews</div>
      <dialog id={modalId} className="modal">
        <div className="modal-box text-center space-y-4">
          {/* Simple review-themed graphic (clipboard with star) */}
          <div className="mx-auto mb-2 w-16 h-16 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16"
              aria-hidden="true"
            >
              {/* Clipboard */}
              <path d="M9 2.75A1.75 1.75 0 0 0 7.25 4.5v.25H6.5A2.75 2.75 0 0 0 3.75 7.5v11.25A2.75 2.75 0 0 0 6.5 21.5h11a2.75 2.75 0 0 0 2.75-2.75V7.5A2.75 2.75 0 0 0 17.5 4.75h-.75V4.5A1.75 1.75 0 0 0 15 2.75H9Zm0 1.5h6a.25.25 0 0 1 .25.25v.25h-6.5V4.5a.25.25 0 0 1 .25-.25ZM6.5 6.25h11c.69 0 1.25.56 1.25 1.25v11.25c0 .69-.56 1.25-1.25 1.25h-11c-.69 0-1.25-.56-1.25-1.25V7.5c0-.69.56-1.25 1.25-1.25Z" />
              {/* Star */}
              <path d="M12 9.25c.195 0 .39.102.5.306l1.071 2.032 2.22.323c.45.065.629.62.304.938l-1.606 1.566.379 2.212c.078.458-.402.807-.812.59L12 16.596l-1.986 1.021c-.41.217-.89-.132-.812-.59l.379-2.212-1.606-1.566c-.325-.319-.145-.873.304-.938l2.22-.323L11.5 9.556c.11-.204.305-.306.5-.306Z" />
            </svg>
          </div>

          <p className="text-lg">
            <span className="font-bold">{userName}</span> has reviewed{' '}
            {reviewCount === 1 ? '1 place so far' : `${reviewCount} places`}!
          </p>

          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        {/* Modal backdrop - clicking it will close */}
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </>
  );
}
