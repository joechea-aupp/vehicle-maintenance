import VechicalForm from "./VechicalForm";

export default function VechicalMain() {
  return (
    <div className="container md:mx-auto px-20 md:h-screen">
      <div className="flex justify-center">
        <h1 className="text-xl font-extrabold font-custom tracking-wider">
          Vehical Maintenance
        </h1>
      </div>
      <div className="divider"></div>
      <VechicalForm />
    </div>
  );
}
