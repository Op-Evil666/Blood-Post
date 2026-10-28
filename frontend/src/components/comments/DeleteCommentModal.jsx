export default function DeleteCommentModal({
  isOpen,
  onCancel,
  onConfirm,
  isDeleting,
  error,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-comment-title"
        aria-describedby="delete-comment-description"
        className="w-full max-w-md rounded-2xl border border-[#81243B]
                   bg-[#16080D] p-6 shadow-2xl shadow-black/60"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center
                        rounded-full border border-red-900 bg-[#3A0D18]
                        text-2xl text-red-300">
          !
        </div>

        <h2
          id="delete-comment-title"
          className="text-xl font-bold text-[#F5E9E9]"
        >
          Banish this comment?
        </h2>

        <p
          id="delete-comment-description"
          className="mt-3 leading-6 text-[#C6AEB4]"
        >
          Are you sure you want to delete this comment? This action
          cannot be undone.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row
                        sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-[#64202D] px-4 py-2.5
                       font-medium text-[#E3CDD3] transition
                       hover:bg-[#2B1019] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg border border-red-800 bg-[#8F1838]
                       px-4 py-2.5 font-semibold text-white transition
                       hover:bg-[#B21F47] disabled:cursor-not-allowed
                       disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete comment"}
          </button>
        </div>
      </section>
    </div>
  );
}
