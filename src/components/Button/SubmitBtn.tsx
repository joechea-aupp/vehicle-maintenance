type Props = {
  isSubmitting: boolean;
};

export default function SubmitBtn({ isSubmitting }: Props) {
  return (
    <button className="btn" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <span className="loading loading-spinner"></span>
          Submitting...
        </>
      ) : (
        <input type="submit" value="Submit" className="btn" />
      )}
    </button>
  );
}
