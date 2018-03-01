import React from 'react';
import { connect } from 'react-redux';
import {ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import chartAction from '../../../redux/charts/actions';

const data = [{x: 100, y: 200, z: 200}, {x: 120, y: 100, z: 260},
    {x: 170, y: 300, z: 400}, {x: 140, y: 250, z: 280},
    {x: 150, y: 400, z: 500}, {x: 110, y: 280, z: 200}];

const {fetchData} = chartAction;

class ProjectLandscape extends React.Component {
    componentDidMount() {
        this.props.fetchData(null)
    }

    render() {

        return (
            <ScatterChart width={730} height={250}
                          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" name="stature" unit=" cm" />
                <YAxis dataKey="y" name="weight" unit=" kg" />
                <ZAxis dataKey="z" range={[64, 144]} name="score" unit=" km" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="A school" data={data} fill="#8884d8" />
            </ScatterChart>
        );
    }
}
export default connect(null, {fetchData})(ProjectLandscape);
