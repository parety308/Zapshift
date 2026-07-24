const Rider = () => {
    return (
        <div className="w-10/12 mx-auto">
            <h1 className="text-4xl font-bold my-5">Be a Rider</h1>
            <p className="lg:w-1/2">
                Join our growing rider community and earn on your own schedule. Fill in your details below and our
                team will reach out with the next steps to get you on the road.
            </p>
            <div className="my-10">
                <h1 className="font-bold text-xl">Tell us about yourself</h1>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 lg:w-1/2">
                    <div className="w-full lg:w-1/2 my-1">
                        <label className="label">Your Name</label>
                        <input type="text" placeholder="Type here" className="input w-full" />
                    </div>
                    <div className="w-full lg:w-1/2 my-1">
                        <label className="label">Your Age</label>
                        <input type="text" placeholder="Type here" className="input w-full" />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 lg:w-1/2">
                    <div className="w-full lg:w-1/2 my-1">
                        <label className="label">Your Email</label>
                        <input type="email" placeholder="Type here" className="input w-full" />
                    </div>
                    <div className="w-full lg:w-1/2 my-1">
                        <label className="label">Your Region</label>
                        <input type="text" placeholder="Type here" className="input w-full" />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 lg:w-1/2">
                    <div className="w-full lg:w-1/2 my-1">
                        <label className="label">NID No</label>
                        <input type="text" placeholder="Type here" className="input w-full" />
                    </div>
                    <div className="w-full lg:w-1/2 my-1">
                        <label className="label">Contact</label>
                        <input type="text" placeholder="Type here" className="input w-full" />
                    </div>
                </div>
                <button className="btn bg-lime-300 mt-4">Submit Application</button>
            </div>
        </div>
    );
};

export default Rider;
