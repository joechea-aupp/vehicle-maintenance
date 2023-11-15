import { useAsyncError } from "react-router-dom";

type Error = {
  message: string;
};

function assertError(data: unknown): asserts data is Error {
  if (typeof data !== "object") {
    throw new Error("Data isn't an object");
  }
  if (data === null) {
    throw new Error("Data is null");
  }
  if (!("message" in data)) {
    throw new Error("data doesn't contain posts");
  }
}

export default function ErrorBlock() {
  const error = useAsyncError();
  assertError(error);

  return (
    <div>
      <h1>ERROR: {error.message}</h1>
    </div>
  );
}
