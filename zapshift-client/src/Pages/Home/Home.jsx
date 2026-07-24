import React, { Suspense } from 'react';
import Banner from '../../component/Banner/Banner';
import HowItWorks from '../../component/HowItWorks/HowItWorks';
import OurServices from '../../component/OurServices/OurServices';
import Brans from '../../component/Brands/Brans';
import Reviews from '../../component/Reviews/Reviews';

const Loader = () => (
    <div className="flex justify-center my-10">
        <span className="loading loading-bars loading-lg"></span>
    </div>
);

const Home = () => {
    return (
        <div>
            <Banner />
            <HowItWorks />
            <Suspense fallback={<Loader />}>
                <OurServices />
            </Suspense>
            <Brans />
            <Suspense fallback={<Loader />}>
                <Reviews />
            </Suspense>
        </div>
    );
};

export default Home;
