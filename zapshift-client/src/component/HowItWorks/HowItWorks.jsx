import bookingIcon from "../../assets/bookingIcon.png";

const steps = [
  { title: "Booking Pick & Drop", desc: "From personal packages to business shipments \u2014 we deliver on time, every time." },
  { title: "Cash on Delivery", desc: "From personal packages to business shipments \u2014 we deliver on time, every time." },
  { title: "Delivery Hub", desc: "From personal packages to business shipments \u2014 we deliver on time, every time." },
  { title: "Booking SME & Corporate", desc: "From personal packages to business shipments \u2014 we deliver on time, every time." },
];

const HowItWorks = () => {
  return (
    <div className="my-10 w-10/12 mx-auto">
      <h1 className="text-4xl font-bold">How it Works</h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 my-8">
        {steps.map((step) => (
          <div key={step.title} className="border p-4 rounded-lg shadow-sm bg-[#FFFFFF] flex flex-col justify-center items-center gap-2">
            <img src={bookingIcon} alt={step.title} />
            <h3 className="text-2xl font-semibold text-center">{step.title}</h3>
            <p className="text-lg text-center">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
