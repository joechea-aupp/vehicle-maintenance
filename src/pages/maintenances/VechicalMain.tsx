import VechicalForm from "./VechicalForm";
import { Helmet } from "react-helmet";

export default function VechicalMain() {
  return (
    <div className="container md:mx-auto px-20 h-screen">
      <Helmet>
        <title>Vechical Maintenance</title>
      </Helmet>
      <div className="flex justify-center">
        <h1 className="text-3xl font-extrabold font-custom-two tracking-wider">
          Vehical Maintenance
        </h1>
      </div>
      <div className="divider"></div>
      <VechicalForm />
    </div>
  );
}
