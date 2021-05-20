import * as React from 'react';
import Plotly, { Layout, PlotData, Shape } from 'plotly.js';
import { exponentialSmoothingArray } from '../../utils';

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
    const timeline = ECG.map((_, i) => i / fs);

    const ECGTrace: Partial<PlotData> = {
      type: 'scatter',
      mode: 'lines',
      name: 'ЭКГ, мкВ',
      x: timeline,
      y: ECG,
      line: { color: 'blue' },
    };

    const ICGTrace: Partial<PlotData> = {
      type: 'scatter',
      mode: 'lines',
      name: 'Реограмма, мОм',
      x: timeline,
      y: ICG,
      line: { color: 'red' },
    };

    const data = [ECGTrace, ICGTrace];
    const colors = [
      // '#cd7eaf',
      // 'green',
      'red',
      // 'blue',
      // '#a262a9',
      // '#6f4d96'
    ];
    const shapes = [
      // P,
      // Q,
      R,
      // S,
      // APEP,
      // AET
    ].reduce(
      (acc: Partial<Shape>[], lines, i) =>
        acc.concat(
          lines.map((lineX) => ({
            type: 'line',
            x0: lineX / fs,
            y0: 0,
            x1: lineX / fs,
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
      showlegend: true,
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1,
      },
      margin: {
        t: 4,
        b: 14,
      },
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

    const beats = R.map((x) => x / fs);
    const alpha = 0.6;
    const [HR_mean, APEP_mean, AET_mean] = [R, APEP, AET].map((pts) => {
      const smoothed = exponentialSmoothingArray(pts, alpha).map(
        (x) => 6e4 / x
      );
      return [smoothed[0]].concat(smoothed);
    });

    const HRTrace: Partial<PlotData> = {
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Частота сердечных сокращений, уд/мин',
      x: beats,
      y: HR_mean,
      line: { color: 'red' },
    };

    // const APEPTrace: Partial<PlotData> = {
    //   type: 'scatter',
    //   mode: 'lines',
    //   name: 'APEP',
    //   x: beats,
    //   y: APEP_mean,
    //   line: { color: '#cd7eaf', dash: 'dot' },
    // };

    // const AETTrace: Partial<PlotData> = {
    //   type: 'scatter',
    //   mode: 'lines',
    //   name: 'AET',
    //   x: beats,
    //   y: AET_mean,
    //   line: { color: '#a262a9', dash: 'dot' },
    // };

    const supportiveData = [HRTrace];
    const supportiveShapes: Partial<Shape>[] = [
      {
        type: 'line',
        x0: timeline[0],
        y0: 60,
        x1: timeline[timeline.length - 1],
        y1: 60,
        yref: 'y',
        line: {
          color: 'blue',
          width: 1,
        },
      },
      {
        type: 'line',
        x0: timeline[0],
        y0: 90,
        x1: timeline[timeline.length - 1],
        y1: 90,
        yref: 'y',
        line: {
          color: 'blue',
          width: 1,
        },
      },
    ];

    const minY =
      Math.min(
        HR_mean.reduce(
          (acc, val) => Math.min(acc, val),
          Number.POSITIVE_INFINITY
        ),
        60
      ) - 5;
    const maxY =
      Math.max(
        HR_mean.reduce(
          (acc, val) => Math.max(acc, val),
          Number.NEGATIVE_INFINITY
        ),
        90
      ) + 5;
    const supportiveLayout: Partial<Layout> = {
      xaxis: {
        range: [timeline[0], timeline[timeline.length - 1]],
        title: 'Время, с',
      },
      yaxis: {
        range: [minY, maxY],
      },
      showlegend: true,
      legend: {
        orientation: 'h',
      },
      margin: {
        t: 4,
      },
      shapes: supportiveShapes,
    };

    Plotly.newPlot(
      this.supportivePlot.current as HTMLElement,
      supportiveData,
      supportiveLayout,
      {
        responsive: true,
      }
    );
  }

  render() {
    return (
      <div className="h-100 w-100">
        <div className="plot-main w-100" ref={this.markedPlot} />
        <div className="plot-supportive w-100" ref={this.supportivePlot} />
      </div>
    );
  }
}
