import React from 'react';
import img from '../../assets/service.png';

const ServiceCard = ({ serv }) => {
    const { title, description } = serv;
    return (
        <div className="border p-6 rounded-lg shadow-sm bg-amber-100 flex justify-center items-center flex-col gap-4 hover:bg-primary transition-colors">
            <img src={img} alt={title} />
            <h3 className="text-2xl font-semibold text-center">{title}</h3>
            <p className="text-lg text-center">{description}</p>
        </div>
    );
};

export default ServiceCard;
