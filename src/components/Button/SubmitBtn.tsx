type Props = {
  isSubmitting: boolean;
};

export default function SubmitBtn({ isSubmitting }: Props) {
  return (
    <button className="btn px-8" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <span className="loading loading-spinner"></span>
          Submitting...
        </>
      ) : (
        <>Submit</>
      )}
    </button>
  );
}
