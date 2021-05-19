import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FiInfo } from 'react-icons/fi';
import { debounce } from 'lodash';
import { Plot, PlotProps, Upload } from '../components';
import { query } from '../utils';

const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Формат входных данных</Popover.Title>
    <Popover.Content>
      Файл в формате json, задающий сигналы ЭКГ и реограммы: предсердий и мягких
      тканей. Также необходимо указать частоту дискретизации сигнала.
      <br />
      <strong>Формат:</strong>
      <br />
      {'{'}
      <br />
      <p style={{ marginLeft: 8, marginBottom: 0 }}>
        {'"ECG": [<сигнал ЭКГ, мкВ>],'}
        <br />
        {'"AT": [<сопротивление предсердий, мОм>],'}
        <br />
        {'"ST": [<сопротивление мягких тканей>, мОм],'}
        <br />
        {'"FS": <частота дискретизации, Гц>'}
      </p>
      {'}'}
      <br />
      <strong>Пример (данные невалидны):</strong>
      <br />
      {'{'}
      <br />
      <p style={{ marginLeft: 8, marginBottom: 0 }}>
        "ECG": [0, 1, 2, 3],
        <br />
        "AT": [0, 1, 2, 3],
        <br />
        "ST": [0, 1, 2, 3],
        <br />
        "FS": 1
      </p>
      {'}'}
    </Popover.Content>
  </Popover>
);

const Info = () => (
  <OverlayTrigger trigger="click" placement="left" overlay={popover}>
    {({ ref, ...props }) => (
      <div className="d-flex flex-row justify-content-center">
        <div className="me-1">Загрузите файл с данными</div>
        <div ref={ref} {...props} style={{ cursor: 'pointer' }}>
          <FiInfo />
        </div>
      </div>
    )}
  </OverlayTrigger>
);

export function Main() {
  const [plotProps, setPlotProps] = React.useState<PlotProps>(
    (undefined as unknown) as PlotProps
  );

  const setPlotPropsDebounced = debounce(setPlotProps, 500);

  const [error, setError] = React.useState('');

  const onUpload = async (json: string) => {
    try {
      const res = await query(json);
      setPlotPropsDebounced(res);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container className="px-0 mx-0 mw-100 w-100 h-100">
      <Row className="w-100 h-100 px-0 mx-0">
        <Col className="h-100 px-0">
          {plotProps !== undefined ? (
            <Plot {...plotProps} />
          ) : (
            <div className="text-danger">{error || 'Empty placeholder'}</div>
          )}
        </Col>
        <Col className="right-panel">
          <Upload label={<Info />} onChange={onUpload} />
        </Col>
      </Row>
    </Container>
  );
}
