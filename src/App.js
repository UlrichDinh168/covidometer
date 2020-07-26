import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import { sortData, prettyPrintStat } from "./components/util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) => ({
              name: country.country, 
              value: country.countryInfo.iso2 
            }));
            const sortedData = sortData(data);
            setTableData(sortedData);
            setMapCountries(data);
            setCountries(countries);
          });
      };
      getCountriesData()
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url = countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        if(countryCode === 'worldwide'){
          setMapCenter(mapCenter);
          setMapZoom(mapZoom);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        };
      });
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVIDOMETER</h1>
          
          <form className="form">
            <select name="countries" id="countries" onChange={onCountryChange}>
              <option value="worldwide">Worldwide</option>
              {countries.map((country) => (
                <option id="option" value={country.value}>{country.name}</option>
              ))}
            </select>
          </form>
        </div>
        <div className="app__stats">
          <InfoBox className="boxes"
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType('cases')}
            title="Coronavirus Cases Today"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          <InfoBox className="boxes"
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')}
            title="Recovered Today"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox className="boxes"
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}
            title="Deaths Today"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map 
          casesType={casesType}
          countries={mapCountries} 
          center={mapCenter} 
          zoom={mapZoom} 
        />
      </div>
      <div className="app__right">
        <div className="sidebar">
          <h3 className="app__rightTableTitle">CURRENT CASES BY COUNTRY</h3>
          <Table countries={tableData} />
          <h3 className="app__rightGraphTitle">NEW DAILY WORLDWIDE</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </div>   
      </div>
    </div>
  );
}

export default App;