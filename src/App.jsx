import React, { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';


function App() {

  return (
    <>
        <Scraper/>
    </>
  )
}

const Scraper = () => {
    const [classement, setClassement] = useState([]);

    useEffect(() => {
        const url = 'https://corsproxy.io/?' + encodeURIComponent('https://green-got.com/vote?utm_campaign=[Email]+Lancement+des+votes+Jour+J&utm_content=[Email]+Lancement+des+votes+Jour+J&utm_medium=email_action&utm_source=customerio');

        axios.get(url)
            .then(response => {
                const { data } = response;
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, 'text/html');
                const entreprises = htmlDoc.querySelectorAll('.assos_item.w-dyn-item');

                const classementData = Array.from(entreprises).map(entreprise => {
                    const nomEntreprise = entreprise.querySelector('.heading-nom-asso').textContent;
                    const nombreVote = parseInt(entreprise.querySelector('.assos_item-nombre-votes').innerHTML);

                    return { nomEntreprise, nombreVote };
                });

                classementData.sort((a, b) => b.nombreVote - a.nombreVote);
                setClassement(classementData);
            })
            .catch(error => {
                console.error('Une erreur s\'est produite lors du scraping du site :', error);
            });
    }, []);

    return (
        <div className={"container mx-auto"}>
            <h1 className={"text-center mb-10 text-5xl mt-6 text-white"}>Classement Green Got <img className={"inline w-10 h-10"} src="https://em-content.zobj.net/thumbs/240/apple/354/trophy_1f3c6.png" alt=""/></h1>
            <div className="flex flex-col mb-20">
                {classement.map((entreprise, index) => (
                    <div key={index} className="flex justify-between py-2">
                        <span className="text-gray-300 mr-4">{index + 1}.</span>
                        <span className="font-semibold text-white mr-4">{entreprise.nomEntreprise}</span>
                        <span className="text-blue-400">{entreprise.nombreVote} votants</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App
