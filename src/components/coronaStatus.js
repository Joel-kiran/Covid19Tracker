import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DropdownButton, DropdownItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './basicReact.css';

class CoronaCountryStatus extends Component {
    constructor() {
        super();
        this.state = {coronaData: {}, isLoaded: false, countryName:null, confirmed: null, deaths: null, recovered: null, active: null, search: []}
        console.log(this.state.coronaData)
        this.handleClick = this.handleClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    componentDidMount(){
        fetch("https://pomber.github.io/covid19/timeseries.json").then(response => response.json()).then((result) => {this.setState({coronaData: result, isLoaded: true})});
    }

    handleSearch(e){
        console.log(e.target.value)
        let searchMatchCountry = []
        if (e.target.value != null && e.target.value.length > 0)
            Object.keys(this.state.coronaData).filter((country)=>country.toLowerCase().startsWith(e.target.value.toLowerCase())).map((country) => searchMatchCountry.push(<div><button  id='prefixSearchMatch'  onClick={this.handleClick} value={country}>{country}</button></div>))
        console.log(searchMatchCountry)
        this.setState({search: searchMatchCountry})
    }

    handleClick(e) {
        let countryNam = e.target.value
        console.log(countryNam);
        let countryTimeSeriesData = this.state.coronaData[countryNam]
        let countryLatestData = countryTimeSeriesData[countryTimeSeriesData.length - 1]
        this.setState({search:[], countryName: countryNam, confirmed :countryLatestData.confirmed, deaths: countryLatestData.deaths, recovered: countryLatestData.recovered, active: countryLatestData.confirmed - countryLatestData.recovered - countryLatestData.deaths})
    }
    render() {
        return (
            <div>
                <h1 id='headline'>Covid - 19 Country Tracker</h1>
                {/*
                <div>
                    <DropdownButton class="dropdown-basic-button1" id="dropdown-basic-button" title="Country Status">
                        {Object.keys(this.state.coronaData).length > 0 ? Object.keys(this.state.coronaData).map((country) => <DropdownItem as='button'  id={country} onClick={this.handleClick}>{country}</DropdownItem>) : null}
                    </DropdownButton>

                </div>
                 */}
                <div id="countryName">
                    <h2>{this.state.countryName!=null ?  this.state.countryName : null}</h2>
                </div>
                <div id="confirmed">
                    <h3>{this.state.confirmed!=null ? "confirmed : " + this.state.confirmed : null}</h3>
                </div>
                <div id="deaths">
                    <h3>{this.state.deaths!=null ? "deaths : " + this.state.deaths: null}</h3>
                </div>
                <div id="recovered">
                    <h3>{this.state.recovered!=null ? "recovered : " + this.state.recovered: null}</h3>
                </div>
                <div id="active">
                    <h3>{this.state.active!=null ? "active : " + this.state.active: null}</h3>
                </div>
                <div id='search'><input type="text"  id='searchText' placeholder='Type The Country name to know covid 19 status' onInput={this.handleSearch}/><div> {this.state.search.length > 0 ? this.state.search : null}</div></div>
            </div>
        )
    }
}

export default CoronaCountryStatus;