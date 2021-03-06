import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './basicReact.css';
import CanvasJSReact from '../canvasjs.react';


var CanvasJSChart = CanvasJSReact.CanvasJSChart

class CoronaCountryStatus extends Component {
    constructor() {
        super();
        this.state = {
            coronaData: {},
            isLoaded: false,
            countryName: null,
            confirmed: null,
            deaths: null,
            recovered: null,
            active: null,
            search: [],
            chartData: null,
        }
        console.log(this.state.coronaData)
        this.handleClick = this.handleClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        fetch("https://pomber.github.io/covid19/timeseries.json").then(response => response.json()).then((result) => this.onDatafetch(result))
    }

    onDatafetch(result) {
        let globalStatus = []

        for (let i = 0; i < result['India'].length; i++) {
            let conf = 0;
            let recov = 0;
            let death = 0;
            let date = null;
            Object.keys(result).forEach(function (country) {
                conf = conf + result[country][i].confirmed
                recov = recov + result[country][i].recovered
                death = death + result[country][i].deaths
                date = result[country][i].date
            })
            globalStatus.push({recovered: recov, confirmed: conf, deaths: death, date: date})
        }
        result['Global'] = globalStatus;
        this.setState({coronaData: result, isLoaded: true});
        this.displayData('Global')
    }

    handleSearch(e) {
        console.log(e.target.value);
        let searchMatchCountry = [];
        if (e.target.value != null && e.target.value.length > 0)
            Object.keys(this.state.coronaData).filter((country) => country.toLowerCase().startsWith(e.target.value.toLowerCase())).map((country) =>
                searchMatchCountry.push(<div>
                    <button id='prefixSearchMatch' onClick={this.handleClick} value={country}>{country}</button>
                </div>));
        this.setState({search: searchMatchCountry});
    }

    handleClick(e) {
        let countryNam = e.target.value
        this.displayData(countryNam)
    }

    displayData(countryNam) {
        let countryTimeSeriesData = this.state.coronaData[countryNam]
        let countryLatestData = countryTimeSeriesData[countryTimeSeriesData.length - 1]
        let chartData = this.generatechart(countryTimeSeriesData)
        this.setState({
            search: [],
            countryName: countryNam,
            confirmed: countryLatestData.confirmed,
            deaths: countryLatestData.deaths,
            recovered: countryLatestData.recovered,
            active: countryLatestData.confirmed - countryLatestData.recovered - countryLatestData.deaths,
            chartData: chartData
        })
    }

    generatechart(countryTimeSeriesData) {

        let confirmedSeries = [];
        let recoveredSeries = [];
        let deathSeries = [];
        let activeSeries = [];

        countryTimeSeriesData.map((Data) => {
            confirmedSeries.push({x: new Date(Data.date), y: Data.confirmed});
            recoveredSeries.push({x: new Date(Data.date), y: Data.recovered});
            deathSeries.push({x: new Date(Data.date), y: Data.deaths});
            activeSeries.push({x: new Date(Data.date), y: Data.confirmed - Data.recovered - Data.deaths})
        });
        let data = [
            {
                type: "line",
                showInLegend: true,
                name: "confirmed",
                dataPoints: confirmedSeries
            },
            {
                type: "line",
                name: "active",
                showInLegend: true,
                dataPoints: activeSeries
            },
            {
                type: "line",
                name: "recovered",
                showInLegend: true,
                dataPoints: recoveredSeries
            },
            {
                type: "line",
                name: "deaths",
                showInLegend: true,
                dataPoints: deathSeries
            }
        ];

        const chartData = {
            animationEnabled: true,
            exportEnabled: true,
            backgroundColor: "white",
            theme: "light2", // "light1", "dark1", "dark2"
            title: {
                text: "Corona Status Trend"
            },
            axisY: {
                title: "Person Count",
            },
            axisX: {
                title: "Date",
                valueFormatString: "YYYY-MM-DD"
            },
            data: data
        };
        return chartData;
    }

    render() {
        return (
            <div>
                <h1 id='headline'>Covid - 19 Country Tracker</h1>
                <div id="countryName">
                    <h2>{this.state.countryName != null ? this.state.countryName : null}</h2>
                </div>
                <div id="confirmed">
                    <h3>{this.state.confirmed != null ? "confirmed : " + this.state.confirmed : null}</h3>
                </div>
                <div id="deaths">
                    <h3>{this.state.deaths != null ? "deaths : " + this.state.deaths : null}</h3>
                </div>
                <div id="recovered">
                    <h3>{this.state.recovered != null ? "recovered : " + this.state.recovered : null}</h3>
                </div>
                <div id="active">
                    <h3>{this.state.active != null ? "active : " + this.state.active : null}</h3>
                </div>
                <div id='search'><input type="text" id='searchText'
                                        placeholder='Type The Country name to know covid 19 status'
                                        onInput={this.handleSearch}/>
                    <div> {this.state.search.length > 0 ? this.state.search : null}</div>
                </div>
                <div id='chart'>
                    {this.state.chartData !== null ? <CanvasJSChart options={this.state.chartData}/> : null}
                </div>
            </div>
        )
    }
}

export default CoronaCountryStatus;