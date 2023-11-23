import VechicalForm from "./VechicalForm";

export default function VechicalMain() {
  return (
    <div className="container md:mx-auto mx-10 md:h-screen">
      <div className="flex justify-center">
        <h1 className="text-xl font-extrabold">Vehical Maintenance</h1>
      </div>
      <div className="divider"></div>
      <VechicalForm />
    </div>
  );
}
