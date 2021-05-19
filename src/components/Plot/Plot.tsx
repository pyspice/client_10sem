import * as React from 'react';
import Plotly, { Layout, PlotData, Shape } from 'plotly.js';

/**
 * Mimics QueryResult
 */
export type PlotProps = {
  fs: number;
  ECG: number[];
  ICG: number[];
  P: number[];
  Q: number[];
  R: number[];
  S: number[];
  APEP: number[];
  AET: number[];
};

export class Plot extends React.Component<PlotProps> {
  private markedPlot = React.createRef<HTMLDivElement>();
  private supportivePlot = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  private redraw() {
    const { fs, ECG, ICG, P, Q, R, S, APEP, AET } = this.props;
    const timeline = ECG.map((_, i) => (i * 1000.0) / fs);

    const ECGTrace: Partial<PlotData> = {
      type: 'scatter',
      mode: 'lines',
      name: 'ECG',
      x: timeline,
      y: ECG,
      line: { color: 'blue' },
    };

    const ICGTrace: Partial<PlotData> = {
      type: 'scatter',
      mode: 'lines',
      name: 'ICG',
      x: timeline,
      y: ICG,
      line: { color: 'red' },
    };

    const data = [ECGTrace, ICGTrace];
    const colors = ['#cd7eaf', 'green', 'red', 'blue', '#a262a9', '#6f4d96'];
    const shapes = [P, Q, R, S, APEP, AET].reduce(
      (acc: Partial<Shape>[], lines, i) =>
        acc.concat(
          lines.map((lineX) => ({
            type: 'line',
            x0: timeline[lineX],
            y0: 0,
            x1: timeline[lineX],
            y1: 1,
            yref: 'paper',
            line: {
              color: colors[i],
              width: 2,
              dash: 'dot',
            },
          }))
        ),
      []
    );

    const layout: Partial<Layout> = {
      xaxis: {
        type: 'linear',
      },
      shapes,
    };

    Plotly.newPlot(this.markedPlot.current as HTMLElement, data, layout, {
      // editable: true,
      // edits: {
      //   //@ts-ignore
      //   shapePosition: { dx: true },
      // },
      responsive: true,
    });
    // .then((node) => {
    //   node.on('plotly_relayout', (...args) => {
    //     console.log(args);
    //   });
    // });
  }

  render() {
    return (
      <div className="h-100 w-100">
        <div className="h-75 w-100" ref={this.markedPlot} />
        <div className="h-25 w-100" ref={this.supportivePlot} />
      </div>
    );
  }
}
